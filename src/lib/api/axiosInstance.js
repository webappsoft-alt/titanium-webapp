import axios from "axios"

export const baseURL = 'https://api.titanium.com/api/'
// export const baseURL = 'http://localhost:5004/api/'

export const axiosInstance = axios.create({
  baseURL: baseURL
})

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('titanium-token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => Promise.reject(error)
);

  export const logoutCookes = async () => {
  // Remove cookie from the server
  await fetch("/api/delete-cookie", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "user"
    }),
  });
  window.location.reload()
  // router.replace('/auth/login');
};