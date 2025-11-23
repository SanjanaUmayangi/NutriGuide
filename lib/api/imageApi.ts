import { UNSPLASH_KEY } from "../../constants/config";

export async function fetchFoodImage(query: string): Promise<string | undefined> {
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
    );
    const data = await res.json();
    return data.results[0]?.urls.small; // small image URL
  } catch (e) {
    console.warn("Unsplash image fetch failed", e);
    return undefined;
  }
}
