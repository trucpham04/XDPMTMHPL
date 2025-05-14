import { useState, useCallback } from "react";
import { Media } from "../types/media";
import { mediaService } from "../services/mediaService";

export const useMedia = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<Media[]>([]);
  const [videos, setVideos] = useState<Media[]>([]);

  const getImagesByUserId = useCallback(
    async (userId: number): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const response = await mediaService.getAllImagesByUserId(userId);
        setImages(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch images");
        setImages([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getVideosByUserId = useCallback(
    async (userId: number): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const response = await mediaService.getAllVideosByUserId(userId);
        setVideos(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch videos");
        setVideos([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    error,
    images,
    videos,
    getImagesByUserId,
    getVideosByUserId,
  };
};
