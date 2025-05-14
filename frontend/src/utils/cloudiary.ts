// utils/cloudinary.ts
export const uploadImagesToCloudinary = async (
  files: FileList | File[],
): Promise<string[]> => {
  const CLOUD_NAME = "dzhzuxpph";
  const UPLOAD_PRESET = "unsigned_preset";
  const uploads = Array.from(files).map(async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    // Determine if file is video or image
    const isVideo = file.type.startsWith("video/");
    const resourceType = isVideo ? "video" : "image";

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!res.ok) {
      throw new Error(`Upload failed: ${res.statusText}`);
    }

    const data = await res.json();
    return data.secure_url as string;
  });

  return Promise.all(uploads);
};

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const CLOUD_NAME = "dzhzuxpph";
  const UPLOAD_PRESET = "unsigned_preset";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  // Determine if file is video or image
  const isVideo = file.type.startsWith("video/");
  const resourceType = isVideo ? "video" : "image";

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!res.ok) {
    throw new Error(`Upload failed: ${res.statusText}`);
  }

  const data = await res.json();
  console.log("Cloudinary upload response:", data);

  return data.secure_url as string;
};

// New function specifically for video uploads
export const uploadVideoToCloudinary = async (file: File): Promise<string> => {
  const CLOUD_NAME = "dzhzuxpph";
  const UPLOAD_PRESET = "unsigned_preset";

  if (!file.type.startsWith("video/")) {
    throw new Error("File must be a video");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!res.ok) {
    throw new Error(`Video upload failed: ${res.statusText}`);
  }

  const data = await res.json();
  console.log("Cloudinary video upload response:", data);

  return data.secure_url as string;
};
