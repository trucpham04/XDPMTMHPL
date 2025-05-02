import { User } from "@/types/User";
import { MessageResponse } from "@/types/Response";
import apiClient from "./apiClient";

const serviceBase = "user-service/api/admin";

export interface NewUserAdminRequest {
  username: string;
  email: string;
  password: string;
  gender: string;
  dateOfBirth: string;
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
  roles?: string[];
}

export interface UpdateUserAdminRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  dateOfBirth?: string;
  profilePictureUrl?: string;
  roles?: string[];
}

export interface GetAllUsersResponse {
  content: User[];
  pageable: {
    sort: {
      empty: boolean;
    };
    offset: number;
    pageSize: number;
    pageNumber: number;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export class AdminService {
  async addNewUser(userData: NewUserAdminRequest): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(
      `${serviceBase}/user/add`,
      userData,
    );
    return response;
  }

  async getAllUsers(
    page: number = 0,
    size: number = 25,
  ): Promise<GetAllUsersResponse> {
    const response = await apiClient.get<GetAllUsersResponse>(
      `${serviceBase}/users?page=${page}&size=${size}`,
    );
    return response;
  }

  async searchUsers(
    keyword: string,
    page: number = 0,
    size: number = 25,
  ): Promise<GetAllUsersResponse> {
    const response = await apiClient.get<GetAllUsersResponse>(
      `${serviceBase}/users/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`,
    );
    return response;
  }

  async updateUser(
    userId: number,
    userData: UpdateUserAdminRequest,
  ): Promise<MessageResponse> {
    const response = await apiClient.put<MessageResponse>(
      `${serviceBase}/user/${userId}`,
      userData,
    );
    return response;
  }

  async toggleUserStatus(userId: number): Promise<MessageResponse> {
    const response = await apiClient.put<MessageResponse>(
      `${serviceBase}/user/${userId}/activate`,
    );
    return response;
  }
}
