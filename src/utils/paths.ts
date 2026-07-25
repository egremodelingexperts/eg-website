const basePath = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

export function withBase(path: string): string {
  if (
    path.startsWith("#") ||
    path.startsWith("http:") ||
    path.startsWith("https:") ||
    path.startsWith("mailto:") ||
    path.startsWith("tel:")
  ) {
    return path;
  }

  return `${basePath}${path.replace(/^\/+/, "")}`;
}
