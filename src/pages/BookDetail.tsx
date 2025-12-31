import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPublicBookById } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BookOpen,
  Hash,
  Calendar,
  BookMarked,
  Package,
  Share2,
  Heart,
  Info,
  LucideIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

/* ===================== TYPES ===================== */

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  year: string;
  available: number;
  qty: number;
  description?: string;
  categories: string[];
  cover?: string;
}

/* ===================== LOCAL STORAGE HELPERS ===================== */

const STORAGE_KEY = "savedBooks";

const getSavedBooks = (): Book[] =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const isBookSaved = (id: string) =>
  getSavedBooks().some((b) => b._id === id);

const toggleSaveBook = (book: Book) => {
  const saved = getSavedBooks();

  if (saved.some((b) => b._id === book._id)) {
    const updated = saved.filter((b) => b._id !== book._id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return false;
  } else {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...saved, book])
    );
    return true;
  }
};

/* ===================== COMPONENT ===================== */

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [saved, setSaved] = useState(false);

  const { data: book, isLoading, isError } = useQuery<Book>({
    queryKey: ["public-book", id],
    queryFn: () => getPublicBookById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (book?._id) {
      setSaved(isBookSaved(book._id));
    }
  }, [book]);

  if (isLoading) return <LoadingState />;
  if (!book || isError) return <ErrorState />;

  const isAvailable = book.available > 0;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950">
      <Navbar />

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            asChild
            className="rounded-full hover:bg-white dark:hover:bg-zinc-900 shadow-sm"
          >
            <Link to="/search">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Collection
            </Link>
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full shadow-sm">
              <Share2 className="w-4 h-4" />
            </Button>

            {/* ❤️ SAVE BUTTON */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSaved(toggleSaveBook(book))}
              className={`rounded-full shadow-sm transition ${
                saved ? "text-red-500 border-red-200" : ""
              }`}
            >
              <Heart
                className="w-4 h-4"
                fill={saved ? "currentColor" : "none"}
              />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-b from-primary/20 to-purple-500/20 rounded-[2rem] blur-xl opacity-50"></div>
              <div className="relative aspect-[3/4.5] bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl overflow-hidden border">
                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-secondary">
                    <BookOpen className="w-20 h-20 mb-4 opacity-20" />
                    <span>No cover available</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <Badge
                variant={isAvailable ? "default" : "destructive"}
                className="w-full justify-center py-3 rounded-2xl"
              >
                {isAvailable
                  ? `${book.available} Copies Available`
                  : "Currently Out of Stock"}
              </Badge>
              <p className="text-center text-xs text-muted-foreground">
                Internal Library ID: {book._id}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-8 space-y-10">
            <section className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {book.categories.map((cat, i) => (
                  <Badge key={i} variant="secondary" className="rounded-full">
                    {cat}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl md:text-6xl font-black">
                {book.title}
              </h1>
              <p className="text-xl italic text-muted-foreground">
                by {book.author}
              </p>
            </section>

            <section className="grid grid-cols-2 md:grid-cols-4 gap-px bg-muted rounded-3xl overflow-hidden">
              <StatBox icon={Hash} label="ISBN" value={book.isbn} />
              <StatBox icon={Calendar} label="Release" value={book.year} />
              <StatBox icon={Package} label="Total Volume" value={String(book.qty)} />
              <StatBox icon={BookMarked} label="Format" value="Physical" />
            </section>

            <section className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-primary" />
                Synopsis
              </h3>
              <p className="text-lg text-muted-foreground">
                {book.description || "No description provided."}
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

/* ===================== SUB COMPONENTS ===================== */

interface StatBoxProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

const StatBox = ({ icon: Icon, label, value }: StatBoxProps) => (
  <div className="bg-white dark:bg-zinc-950 p-6 text-center">
    <Icon className="w-5 h-5 mx-auto mb-1 text-primary opacity-60" />
    <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
    <p className="font-bold text-sm truncate">{value}</p>
  </div>
);

/* ===================== STATES ===================== */

const LoadingState = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
      <Skeleton className="lg:col-span-4 aspect-[3/4.5] rounded-[2rem]" />
      <Skeleton className="lg:col-span-8 h-40 rounded-[2rem]" />
    </div>
  </div>
);

const ErrorState = () => (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <Navbar />
    <BookOpen className="w-16 h-16 text-red-500 mb-4" />
    <h2 className="text-3xl font-bold mb-2">Book Not Found</h2>
    <Button asChild>
      <Link to="/">
        <ArrowLeft className="mr-2 h-4 w-4" /> Go Home
      </Link>
    </Button>
  </div>
);

export default BookDetail;
