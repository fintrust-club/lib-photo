import { useCallback, useEffect, useState } from "react";
import { RemoteImageManager } from "src/core/firebase/image";

export const useStorateUrl = (path: string) => {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);

  const _fetchUrl = useCallback(async () => {
    try {
      setFetching(true);
      const _url = await RemoteImageManager.getUrl(path);
      setDownloadUrl(_url);
    } catch (err) {
      setDownloadUrl(null);
    } finally {
      setFetching(false);
    }
  }, [path]);

  useEffect(() => {
    _fetchUrl();
  }, [_fetchUrl]);

  return {
    fetching,
    url: downloadUrl,
  };
};
