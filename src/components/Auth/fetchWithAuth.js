export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  const makeRequest = async (accessToken) => {
    return fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      },
    });
  };

  let res = await makeRequest(token);

  // ✅ 401 veya 403 olursa refresh dene
  if ((res.status === 401 || res.status === 403) && refreshToken) {
    try {
      const refreshRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken, oldAccessToken: token }),
        }
      );

      if (!refreshRes.ok) {
        throw new Error("Refresh failed");
      }

      const { token: newToken } = await refreshRes.json();
      localStorage.setItem("token", newToken);

      // tekrar deneyelim
      res = await makeRequest(newToken);
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/auth"; // ya da "/login"
      return new Response(null, { status: 401 });
    }
  }

  return res;
};
