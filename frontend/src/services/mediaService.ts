import { Media } from "../types/media";
import apiClient from "./apiClient";

const serviceName = "post-service";

export const mediaService = {
  getAllImagesByUserId: async (userId: number): Promise<Media[]> => {
    return apiClient.get<Media[]>(
      `${serviceName}/api/posts/user/${userId}/images`,
    );
  },

  getAllVideosByUserId: async (userId: number): Promise<Media[]> => {
    return apiClient.get<Media[]>(
      `${serviceName}/api/posts/user/${userId}/videos`,
    );
  },
};
