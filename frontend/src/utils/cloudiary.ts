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
