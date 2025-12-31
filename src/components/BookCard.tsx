import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  User,
  Calendar,
  Hash,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";

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

interface BookCardProps {
  book: Book;
}

/* ================= LOCAL STORAGE ================= */
const STORAGE_KEY = "savedBookIds";
const EVENT_NAME = "liked-books-updated";

const getSavedBookIds = (): string[] =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const toggleSavedBookId = (id: string) => {
  const saved = getSavedBookIds();

  const updated = saved.includes(id)
    ? saved.filter((bid) => bid !== id)
    : [...saved, id];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // 🔔 Notify same-tab listeners (Navbar, cards, etc.)
  window.dispatchEvent(new Event(EVENT_NAME));

  return updated;
};

/* ================= COMPONENT ================= */
export const BookCard = ({ book }: BookCardProps) => {
  const category = book.categories?.[0] || "General";

  /* ✅ React state (THIS IS THE FIX) */
  const [isLiked, setIsLiked] = useState<boolean>(() =>
    getSavedBookIds().includes(book._id)
  );

  /* 🔄 Sync when likes change anywhere */
  useEffect(() => {
    const syncLikeState = () => {
      setIsLiked(getSavedBookIds().includes(book._id));
    };

    window.addEventListener(EVENT_NAME, syncLikeState);
    return () => window.removeEventListener(EVENT_NAME, syncLikeState);
  }, [book._id]);

  return (
    <Link to={`/book/${book._id}`} className="block h-full">
      <Card className="relative h-full border-none shadow-none bg-transparent hover:bg-white dark:hover:bg-zinc-900 transition-all duration-300 group">
        
        {/* ❤️ LIKE BUTTON */}
        <button
          aria-label="Like book"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSavedBookId(book._id);
            setIsLiked((prev) => !prev); // instant UI response
          }}
          className="absolute top-3 left-3 z-20
                     bg-white/90 dark:bg-zinc-900/90
                     backdrop-blur-md
                     p-2 rounded-full shadow-lg
                     border border-slate-200 dark:border-zinc-800
                     transition-all
                     hover:scale-110 active:scale-95"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isLiked
                ? "fill-red-500 text-red-500"
                : "text-muted-foreground"
            }`}
          />
        </button>

        {/* CARD CONTENT */}
        <div className="flex flex-row sm:flex-col gap-4 md:gap-5 items-start">
          
          {/* COVER */}
          <div className="relative w-28 sm:w-full shrink-0 aspect-[3/4] rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-500">
            {book.cover ? (
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-secondary flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-muted-foreground/40" />
              </div>
            )}

            {/* AVAILABILITY BADGE */}
            <div className="absolute top-2 right-2 hidden sm:block">
              <Badge
                className={`${
                  book.available > 0
                    ? "bg-emerald-500/90"
                    : "bg-destructive/90"
                } border-none backdrop-blur-md`}
              >
                {book.available}
              </Badge>
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex-1 min-w-0 py-1 sm:px-1 space-y-2 md:space-y-3">
            <div className="space-y-1">
              <Badge
                variant="outline"
                className="text-[10px] uppercase tracking-widest h-5 px-1.5 border-primary/20 text-primary"
              >
                {category}
              </Badge>

              <h3 className="text-base md:text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                {book.title}
              </h3>

              <div className="flex items-center gap-1.5 text-muted-foreground">
                <User className="w-3.5 h-3.5" />
                <p className="text-xs md:text-sm truncate font-medium">
                  {book.author}
                </p>
              </div>
            </div>

            {book.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 hidden sm:block">
                {book.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground pt-2 border-t border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
                <span>{book.isbn}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{book.year}</span>
              </div>

              <div
                className={`sm:hidden font-bold ${
                  book.available > 0
                    ? "text-emerald-600"
                    : "text-destructive"
                }`}
              >
                {book.available > 0 ? "In Stock" : "Out of Stock"}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
