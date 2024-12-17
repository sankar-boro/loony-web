type ImageRes = {
    name: string
}
  
export const extractImage = (images: ImageRes[] | string | null | undefined): ImageRes | null => {
    if (!images) return null;

    if (typeof images === "object" && images.length > 0) {
      return images[0];
    }

    let parsedImage = null;
    if (typeof images === "string") {
        const image = images && JSON.parse(images);
        if (image && Array.isArray(image) && image.length > 0) {
          parsedImage = image[0];
        }
    }
  
    return parsedImage;
};

export const parseImage = extractImage;