import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User, Calendar, Hash, Heart } from "lucide-react";
import { Link } from "react-router-dom";

/* ... Types & Local Storage Functions remain the same ... */
interface Book { _id: string; title: string; author: string; isbn: string; year: string; available: number; description?: string; categories: string[]; cover?: string; }
interface BookCardProps { book: Book; }
const STORAGE_KEY = "savedBookIds";
const EVENT_NAME = "liked-books-updated";
const getSavedBookIds = (): string[] => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
const toggleSavedBookId = (id: string) => {
  const saved = getSavedBookIds();
  const updated = saved.includes(id) ? saved.filter((bid) => bid !== id) : [...saved, id];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event(EVENT_NAME));
  return updated;
};

export const BookCard = ({ book }: BookCardProps) => {
  const category = book.categories?.[0] || "General";
  const isAvailable = book.available > 0;

  // ✅ 1. Use state for instant UI updates
  const [isLiked, setIsLiked] = useState<boolean>(() =>
    getSavedBookIds().includes(book._id)
  );

  // ✅ 2. Use a Ref to track the "source" of the update to prevent double-rendering lag
  const skipNextSync = useRef(false);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Set flag so the useEffect knows WE triggered this change
    skipNextSync.current = true;
    
    // Instant UI Update
    setIsLiked((prev) => !prev);
    
    // Sync to Storage
    toggleSavedBookId(book._id);
  };

  useEffect(() => {
    const syncLikeState = () => {
      // If this event was triggered by THIS card, don't re-calculate
      if (skipNextSync.current) {
        skipNextSync.current = false;
        return;
      }
      setIsLiked(getSavedBookIds().includes(book._id));
    };

    window.addEventListener(EVENT_NAME, syncLikeState);
    return () => window.removeEventListener(EVENT_NAME, syncLikeState);
  }, [book._id]);

  return (
    <Link to={`/book/${book._id}`} className="group block h-full">
      <Card className="relative h-full border-none bg-transparent shadow-none transition-all duration-300">
        
        {/* ❤️ INSTANT LIKE BUTTON */}
        <button
          aria-label="Like book"
          onClick={handleLikeClick}
          className="absolute top-2 left-2 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-md border border-black/5 dark:border-white/10 transition-all active:scale-75 hover:scale-110"
        >
          <Heart
            className={`w-4 h-4 transition-all duration-200 ${
              isLiked 
                ? "fill-red-500 text-red-500 scale-110" 
                : "text-zinc-400 hover:text-zinc-600"
            }`}
          />
        </button>

        <div className="flex flex-row sm:flex-col gap-4 md:gap-5 items-stretch sm:items-start">
          {/* COVER */}
          <div className="relative w-28 sm:w-full shrink-0 aspect-[3/4] rounded-xl overflow-hidden shadow-lg dark:shadow-2xl transition-all duration-500 group-hover:-translate-y-1">
            {book.cover ? (
              <img src={book.cover} alt={book.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-muted-foreground/20" />
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="flex-1 min-w-0 py-1 flex flex-col justify-between sm:space-y-2">
            <div className="space-y-1.5">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[9px] px-1.5 py-0 uppercase font-bold tracking-wider">
                {category}
              </Badge>
              <h3 className="text-base md:text-lg font-bold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                {book.title}
              </h3>
              <div className="flex items-center gap-1.5 text-muted-foreground/80">
                <User className="w-3.5 h-3.5" />
                <p className="text-xs md:text-sm font-medium truncate italic">{book.author}</p>
              </div>
            </div>

            {/* FOOTER */}
            <div className="pt-3 border-t border-black/[0.05] dark:border-white/[0.05]">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-semibold">
                <div className="flex items-center gap-3 text-muted-foreground/60">
                  <div className="flex items-center gap-1"><Hash className="w-3 h-3" /><span>{book.isbn}</span></div>
                  <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /><span>{book.year}</span></div>
                </div>

                <div className={`flex items-center gap-1.5 ${isAvailable ? "text-emerald-600 dark:text-emerald-500" : "text-red-500 dark:text-red-400"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                  <span className="uppercase tracking-tighter">
                    {isAvailable ? `${book.available} In Stock` : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};