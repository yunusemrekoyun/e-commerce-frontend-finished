export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  const makeRequest = async (accessToken) => {
    return fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...(options.headers || {}),
      },
    });
  };

  // İlk deneme → Access Token ile
  let res = await makeRequest(token);

  // Token süresi dolmuşsa → Refresh ile yenile
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
        throw new Error("Refresh token geçersiz");
      }

      const { token: newToken } = await refreshRes.json();
      localStorage.setItem("token", newToken);

      // Yeni token ile tekrar dene
      res = await makeRequest(newToken);
    } catch (err) {
      console.warn("Token yenileme başarısız. Oturum sona erdi.");

      // Temizle & login'e yönlendir
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";

      return new Response(null, { status: 401 });
    }
  }

  return res;
};
