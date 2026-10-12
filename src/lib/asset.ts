/** Public asset URL. Respects Vite's base so GitHub project pages resolve images and audio. */
export function asset(path: string) {
  const clean = path.replace(/^\/+/, "")
  return `${import.meta.env.BASE_URL}${clean}`
}
