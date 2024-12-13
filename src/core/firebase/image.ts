import { fb } from "./setup";

export enum FOLDERS {
  PROFILE = "profile",
  PRODUCT = "product",
}
class RemoteImage {
  images: { [key: string]: string } = {};

  getCachedImage = (path: string) => {
    const image = this.images?.[path];
    return image ?? null;
  };

  cacheImage = (path: string, downloadUrl?: string) => {
    if (!downloadUrl)
      throw new Error(`Unable to cache image, invalid url for path: ${path}`);

    this.images[path] = downloadUrl;
  };

  getUrl = async (path: string) => {
    const _cachedUrl = this.getCachedImage(path);

    if (_cachedUrl) return _cachedUrl;

    const _downloadUrl = await fb.getDownloadUrl(path);

    if (!_downloadUrl)
      throw new Error(
        `Unable to download image, invalid url for path: ${path}`
      );

    this.cacheImage(path, _downloadUrl);
    return _downloadUrl;
  };

  upload = async (folder: FOLDERS, file: any) => {
    const _uploadedPath = await fb.upload(
      file,
      `${folder}/${crypto.randomUUID()}`
    );
    return _uploadedPath;
  };

  delete = async (path: string) => {
    await fb.deleteFile(path);
  };
}

export const RemoteImageManager = new RemoteImage();
