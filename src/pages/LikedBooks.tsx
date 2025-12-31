import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";
import {
  Heart,
  ArrowLeft,
  Trash2,
  Library,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/BookCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPublicBooks } from "@/lib/api";

/* ================= TYPES ================= */
interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  year: string;
  available: number;
  description?: string;
  categories: string[];
  cover?: string;
}

/* ================= LOCAL STORAGE (IDs ONLY) ================= */
const STORAGE_KEY = "savedBookIds";

const getSavedBookIds = (): string[] =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const removeSavedBookId = (id: string) => {
  const updated = getSavedBookIds().filter((i) => i !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

/* ================= COMPONENT ================= */
const LikedBooks = () => {
  const queryClient = useQueryClient();

  /* Fetch fresh books from backend */
  const { data: allBooks = [], isLoading } = useQuery<Book[]>({
    queryKey: ["public-books"],
    queryFn: getPublicBooks,
  });

  /* Read saved IDs */
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    setSavedIds(getSavedBookIds());
  }, []);

  /* Filter liked books with fresh data */
  const books = useMemo(() => {
    return allBooks.filter((book) => savedIds.includes(book._id));
  }, [allBooks, savedIds]);

  const handleRemove = (id: string) => {
    const updated = removeSavedBookId(id);
    setSavedIds(updated);
    queryClient.invalidateQueries({ queryKey: ["public-books"] });
  };

  /* Extract categories */
  const categories = useMemo(() => {
    const set = new Set<string>();
    books.forEach((book) => {
      book.categories?.forEach((cat) => set.add(cat));
    });
    return Array.from(set).sort();
  }, [books]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-slate-900 dark:text-zinc-100">
      <Navbar />

      <main className="container mx-auto px-4 py-6 md:py-10">
        {/* HEADER */}
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500 fill-red-500 hidden md:block" />
                Favorites
              </h1>
              <p className="text-muted-foreground mt-2 font-medium">
                {books.length} items on your shelf
              </p>
            </div>

            <Button
              variant="outline"
              asChild
              className="rounded-2xl border-none shadow-sm bg-white dark:bg-zinc-900"
            >
              <Link to="/search">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Browse
              </Link>
            </Button>
          </div>

          <div className="border-b border-slate-200 dark:border-zinc-800 pb-2" />
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* SIDEBAR (DESKTOP ONLY) */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-24 h-fit space-y-8">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Genres
              </h3>
              <div className="flex flex-col gap-1">
                <Button
                  variant="secondary"
                  className="justify-start rounded-xl px-4 py-2 text-sm"
                >
                  All Favorites
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant="ghost"
                    className="justify-start rounded-xl capitalize px-4 py-2 text-sm"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-[2rem] bg-indigo-600 text-white shadow-xl shadow-indigo-500/20">
              <Library className="w-8 h-8 mb-4 opacity-80" />
              <h4 className="font-bold text-lg leading-tight">
                Private Shelf
              </h4>
              <p className="text-xs mt-2 leading-relaxed opacity-90">
                Synced with live library data.
              </p>
            </div>
          </aside>

          {/* RESULTS GRID */}
          <section className="flex-1">
            {isLoading ? null : books.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center bg-white dark:bg-zinc-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-zinc-800">
                <Sparkles className="w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-xl font-bold italic">
                  No favorites found
                </h3>
                <Button
                  asChild
                  className="mt-6 rounded-full px-8 shadow-lg"
                >
                  <Link to="/search">Discover Books</Link>
                </Button>
              </div>
            ) : (
              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-3
                  xl:grid-cols-4
                  gap-y-6
                  sm:gap-y-12
                  sm:gap-x-8
                "
              >
                {books.map((book) => (
                  <div key={book._id} className="relative group">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(book._id);
                      }}
                      className="absolute top-2 right-2 z-[50]
                                 bg-white/95 dark:bg-zinc-900
                                 p-2 rounded-full text-red-500
                                 shadow-xl border border-red-50 dark:border-red-900/20
                                 hover:bg-red-500 hover:text-white
                                 transition-all duration-200
                                 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default LikedBooks;
