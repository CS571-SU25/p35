// Glob-import every raster image under /src/assets
const allImages = import.meta.glob(
  '../assets/**/*.{png,jpg,jpeg,webp}',
  { eager: true, import: 'default' }
) as Record<string, string>;

/**
 * Returns the public URL that Vite generated for a given path.
 * Example: imageUrl('cpu/i5_13600k.png')
 */
export function imageUrl(relPath: string): string {
  // normalise slashes in case paths come with or without leading './'
  relPath = relPath.replace(/^\.?\/*/, '');

  for (const [modulePath, url] of Object.entries(allImages)) {
    if (modulePath.endsWith('/' + relPath)) return url;
  }
  console.warn(`imageUrl: ${relPath} not found`);
  return allImages['../assets/placeholder.png'] ?? '';
}
