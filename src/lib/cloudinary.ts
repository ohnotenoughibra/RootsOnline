import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

// Generate signed URL for secure video playback
export function generateSignedVideoUrl(publicId: string, expiresInSeconds = 3600): string {
  const timestamp = Math.round(Date.now() / 1000) + expiresInSeconds;

  return cloudinary.url(publicId, {
    resource_type: "video",
    type: "authenticated",
    sign_url: true,
    secure: true,
    transformation: [
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
    expires_at: timestamp,
  });
}

// Generate upload signature for client-side uploads
export function generateUploadSignature(paramsToSign: Record<string, string | number>) {
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );
  return signature;
}

// Generate upload preset params
export function getUploadParams() {
  const timestamp = Math.round(Date.now() / 1000);

  const params = {
    timestamp,
    folder: "roa-videos",
    resource_type: "video",
    type: "authenticated", // Makes videos private by default
  };

  const signature = generateUploadSignature(params as Record<string, string | number>);

  return {
    ...params,
    signature,
    api_key: process.env.CLOUDINARY_API_KEY,
  };
}

// Delete video from Cloudinary
export async function deleteVideo(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
      type: "authenticated",
    });
    return result;
  } catch (error) {
    console.error("Error deleting video from Cloudinary:", error);
    throw error;
  }
}

// Get video info
export async function getVideoInfo(publicId: string) {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: "video",
      type: "authenticated",
    });
    return result;
  } catch (error) {
    console.error("Error getting video info:", error);
    throw error;
  }
}
