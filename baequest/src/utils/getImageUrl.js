import { baseUrl } from "./api";

const getImageUrl = (pictureUrl) => {
  if (!pictureUrl) return null;

  if (pictureUrl.startsWith("http")) {
    return pictureUrl;
  }

  return `${baseUrl}${pictureUrl}`;
};

export default getImageUrl;