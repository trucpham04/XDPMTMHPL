export interface Media {
  url: string;
  type: "image" | "video";
  postId: number;
}

export interface MediaResponse {
  data: Media[];
}
