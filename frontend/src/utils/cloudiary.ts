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

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

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

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  const data = await res.json();
  console.log("Cloudinary upload response:", data);

  return data.secure_url as string;
};
