import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { useEffect, useState } from "react";

const s3Client = new S3Client({
  region: import.meta.env.VITE_API_APP_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_API_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_API_APP_AWS_SECRET_ACCESS_KEY,
  },
});

// Cache object to store signed urls
const urlCache: { [key: string]: { url: string; expiry: number } } = {};
const CACHE_DURATION = 55 * 60 * 1000;

async function getSignedUrlWithCache(key: string): Promise<string> {
  const now = Date.now();

  if (urlCache[key] && urlCache[key].expiry > now) {
    return urlCache[key].url;
  }

  const command = new GetObjectCommand({
    Bucket: import.meta.env.VITE_API_APP_AWS_BUCKET_NAME,
    Key: key,
  });
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  urlCache[key] = { url, expiry: now + CACHE_DURATION };

  return url;
}

export default function useS3Image(keys: string | string[] | undefined) {
  const [imageUrl, setImageUrl] = useState<string[]>([]);

  useEffect(() => {
    async function fetchSignedUrl() {
      if (!keys) return;

      const keyArray = Array.isArray(keys) ? keys : [keys];
      const urls = await Promise.all(
        keyArray.map(async (key) => {
          try {
            const urlKey = key.split("/").pop();
            if (urlKey) return await getSignedUrlWithCache(urlKey);
          } catch (error) {
            console.error("Error fetching signed URL:", error);
          }
        })
      );
      setImageUrl(urls.filter((url): url is string => url !== undefined));
    }
    fetchSignedUrl();
  }, [keys]);
  return imageUrl;
}
