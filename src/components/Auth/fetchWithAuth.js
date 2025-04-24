// /Applications/Works/kozmetik/frontend/src/components/Auth/fetchWithAuth.js
export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  const makeRequest = async (accessToken) => {
    const isFormData = options.body instanceof FormData;
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  // 1. Önce mevcut token ile dene
  let res = await makeRequest(token);

  // 2. 401/403 gelirse refresh token ile yenile
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
      if (!refreshRes.ok) throw new Error("Refresh token geçersiz");
      const { token: newToken } = await refreshRes.json();
      localStorage.setItem("token", newToken);
      // Yeni token ile tekrar isteği çalıştır
      res = await makeRequest(newToken);
    } catch {
      // Yenileme başarısızsa logout
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/auth";
      return new Response(null, { status: 401 });
    }
  }

  return res;
};
