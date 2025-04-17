// /src/utils/fetchWithAuth.js

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  let res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers, // sonradan gelen headers, ön tanımlıları gerektiğinde geçersiz kılsın
    },
  });

  if (res.status === 401 && refreshToken) {
    const refreshRes = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken, oldAccessToken: token }),
      }
    );

    if (!refreshRes.ok) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return;
    }

    const refreshData = await refreshRes.json();
    localStorage.setItem("token", refreshData.token);

    res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshData.token}`,
        ...options.headers,
      },
    });
  }

  return res;
};
