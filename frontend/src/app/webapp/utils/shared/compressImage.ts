import imageCompression from "browser-image-compression";

export const handleFileCompression = async (file: File) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };

  try {
    const blob = await imageCompression(file, options);
    // Then upload `compressedFile` to your server or directly to S3
    const compressedFile = new File([blob], file.name, {
      type: blob.type,
      lastModified: blob.lastModified,
    });
    return compressedFile;
  } catch (error) {
    console.error("Compression error:", error);
  }
};
