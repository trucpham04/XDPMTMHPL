// // src/services/apiClient.js
// import axios from 'axios';

// // URL gốc của API
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// // Tạo axios instance
// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   withCredentials: true, // Gửi cookie cùng request
// });

// // Xử lý phản hồi và lỗi chung
// apiClient.interceptors.response.use(
//   (response) => response.data,
//   (error) => {
//     const { response } = error;
//     if (response && response.status === 401) {
//       window.location.href = '/auth/login'; // Chuyển hướng khi không xác thực
//     }
//     return Promise.reject(error.response?.data?.message || 'Lỗi không xác định');
//   },
// );

// export default apiClient;
