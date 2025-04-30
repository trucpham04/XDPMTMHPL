// // src/services/auth.ts
// import apiClient from './api';

// // Định nghĩa kiểu cho dữ liệu trả về
// interface JwtResponse {
//   id: string;
//   username: string;
//   email: string;
//   roles: string[];
// }

// interface UserProfileResponse {
//   id: string;
//   username: string;
//   email: string;
//   fullName: string;
//   roles: string[];
// }

// export const login = async (identifier: string, password: string): Promise<JwtResponse> => {
//   return apiClient.post('/auth/login', { identifier, password });
// };

// export const signup = async (userData: {
//   username: string;
//   email: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   roles: string[];
// }): Promise<any> => {
//   return apiClient.post('/auth/register', userData);
// };

// export const refreshToken = async (): Promise<JwtResponse> => {
//   return apiClient.post('/auth/refresh');
// };

// export const logout = async (): Promise<any> => {
//   return apiClient.post('/auth/logout');
// };

// export const getCurrentUser = async (): Promise<UserProfileResponse> => {
//   return apiClient.get('/auth/me');
// };

// export const getUserById = async (id: string): Promise<UserProfileResponse> => {
//   return apiClient.get(`/users/${id}`);
// };

// export const updateUser = async (id: string, userData: any): Promise<any> => {
//   return apiClient.put(`/users/${id}`, userData);
// };

// // Xử lý yêu cầu với làm mới token
// export const apiCallWithRefresh = async <T>(apiCall: () => Promise<T>): Promise<T> => {
//   try {
//     return await apiCall();
//   } catch (error: any) {
//     if (error.response?.status === 401) {
//       try {
//         await refreshToken();
//         return await apiCall();
//       } catch (refreshError) {
//         throw new Error('Phiên hết hạn, vui lòng đăng nhập lại');
//       }
//     }
//     throw error;
//   }
// };