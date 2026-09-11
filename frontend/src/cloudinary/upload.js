const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export async function uploadAvatar(file) {
  if (!file) {
    throw new Error("Choose an image first.");
  }

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET."
    );
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Avatar must be an image file.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Avatar must be smaller than 5 MB.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "247box/avatars");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Avatar upload failed.");
  }

  const result = await response.json();

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}
