export function posterUrl(path, size = "w342") {
  if (!path) return "https://via.placeholder.com/342x513?text=Nessuna+immagine";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
