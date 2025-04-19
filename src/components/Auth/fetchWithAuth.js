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

  // Hem 401 hem 403 geldiğinde refresh deneyelim
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
        throw new Error("Refresh token expired or invalid.");
      }

      const refreshData = await refreshRes.json();
      localStorage.setItem("token", refreshData.token);

      // ✅ Yeni token ile isteği tekrar deniyoruz
      res = await makeRequest(refreshData.token);
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return;
    }
  }

  return res;
};
