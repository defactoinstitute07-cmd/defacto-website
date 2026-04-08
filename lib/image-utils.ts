type ImageOptions = {
  width?: number;
  quality?: number;
};

const DEFAULT_WIDTHS = [320, 480, 640, 768, 960, 1200, 1600];

export function isCloudinaryUrl(url: string) {
  return /^https?:\/\/res\.cloudinary\.com\//i.test(url);
}

export function getOptimizedImageUrl(url: string, options: ImageOptions = {}) {
  if (!url || !isCloudinaryUrl(url) || !url.includes("/upload/")) {
    return url;
  }

  try {
    const transformations = [
      "f_auto",
      "q_auto",
      options.width ? `c_limit,w_${options.width}` : null,
      options.quality ? `q_${options.quality}` : null,
    ]
      .filter(Boolean)
      .join(",");

    const [prefix, suffix] = url.split("/upload/");

    if (!prefix || !suffix) {
      return url;
    }

    return `${prefix}/upload/${transformations}/${suffix}`;
  } catch {
    return url;
  }
}

export function getCloudinarySrcSet(url: string, widths = DEFAULT_WIDTHS) {
  if (!isCloudinaryUrl(url)) {
    return undefined;
  }

  return widths
    .map((width) => `${getOptimizedImageUrl(url, { width })} ${width}w`)
    .join(", ");
}
