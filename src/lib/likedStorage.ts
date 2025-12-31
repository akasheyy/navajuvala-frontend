const STORAGE_KEY = "savedBookIds";
const EVENT_NAME = "liked-books-updated";

export const getSavedBookIds = (): string[] =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

export const toggleSavedBookId = (id: string) => {
  const saved = getSavedBookIds();

  const updated = saved.includes(id)
    ? saved.filter(bid => bid !== id)
    : [...saved, id];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // 🔥 notify navbar + others
  window.dispatchEvent(new Event(EVENT_NAME));
};

export const subscribeToLikedChanges = (callback: () => void) => {
  window.addEventListener(EVENT_NAME, callback);
  return () => window.removeEventListener(EVENT_NAME, callback);
};
