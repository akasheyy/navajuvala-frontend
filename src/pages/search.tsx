import { useState, useMemo, useEffect } from "react";
import { getPublicBooks } from "@/lib/api";
import { BookCard } from "@/components/BookCard";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search as SearchIcon, 
  Filter, 
  Library,
  Ghost,
  SlidersHorizontal,
  LayoutGrid
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "react-router-dom";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";

/* ================= TYPES (Matched to your Backend) ================= */
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

interface CategoryListProps {
  onItemClick?: () => void;
  currentCategory: string;
  categories: string[];
  setCategory: (cat: string) => void;
}

/* ================= SUB-COMPONENTS ================= */

const CategoryList = ({ onItemClick, currentCategory, categories, setCategory }: CategoryListProps) => (
  <div className="flex flex-col gap-1">
    <Button 
      variant={currentCategory === "all" ? "secondary" : "ghost"}
      className="justify-start rounded-xl px-4 py-6 sm:py-2 text-base sm:text-sm"
      onClick={() => {
        setCategory("all");
        if (onItemClick) onItemClick();
      }}
    >
      All Collections
    </Button>
    {categories.map((cat) => (
      <Button
        key={cat}
        variant={currentCategory === cat ? "secondary" : "ghost"}
        className="justify-start rounded-xl capitalize px-4 py-6 sm:py-2 text-base sm:text-sm"
        onClick={() => {
          setCategory(cat);
          if (onItemClick) onItemClick();
        }}
      >
        {cat}
      </Button>
    ))}
  </div>
);

/* ================= MAIN COMPONENT ================= */

const Search: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>(params.get("q") ?? "");
  const [categoryFilter, setCategoryFilter] = useState<string>(params.get("cat") ?? "all");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { data = [], isLoading, isError } = useQuery<Book[]>({
    queryKey: ["public-books"],
    queryFn: getPublicBooks,
  });

  // Sync state to URL
  useEffect(() => {
    const next: Record<string, string> = {};
    if (searchQuery) next.q = searchQuery;
    if (categoryFilter !== "all") next.cat = categoryFilter;
    setParams(next, { replace: true });
  }, [searchQuery, categoryFilter, setParams]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    data.forEach((book) => {
      if (book.categories) {
        book.categories.forEach((cat) => set.add(cat));
      }
    });
    return Array.from(set).sort();
  }, [data]);

  const filteredBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return data.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.isbn.includes(q);
      const matchesCategory =
        categoryFilter === "all" ||
        book.categories?.includes(categoryFilter);
      return matchesSearch && matchesCategory;
    });
  }, [data, searchQuery, categoryFilter]);

  if (isError) return <div className="p-10 text-center">Error loading books. Please check your API connection.</div>;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-slate-900 dark:text-zinc-100">
      <Navbar />

      <main className="container mx-auto px-4 py-6 md:py-10">
        
        {/* SEARCH BAR AREA */}
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-2xl">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search titles, authors, or ISBN..."
                className="h-12 md:h-14 pl-12 rounded-2xl border-none shadow-sm bg-white dark:bg-zinc-900 focus-visible:ring-2 focus-visible:ring-primary transition-all"
              />
            </div>
            
            {/* MOBILE FILTER TRIGGER */}
            <div className="lg:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl bg-white dark:bg-zinc-900 border-none shadow-sm">
                    <SlidersHorizontal className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px]">
                  <SheetHeader className="mb-6 border-b pb-4 text-left">
                    <SheetTitle className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-primary" /> Genres
                    </SheetTitle>
                  </SheetHeader>
                  <CategoryList 
                    categories={categories} 
                    currentCategory={categoryFilter} 
                    setCategory={setCategoryFilter} 
                    onItemClick={() => setIsSheetOpen(false)} 
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="flex items-end justify-between border-b border-slate-200 dark:border-zinc-800 pb-6">
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight flex items-center gap-3">
                <LayoutGrid className="w-8 h-8 text-primary hidden md:block" />
                {categoryFilter === "all" ? "Our Collection" : <span className="capitalize">{categoryFilter}</span>}
              </h1>
              <p className="text-muted-foreground mt-1 font-medium">{filteredBooks.length} titles available</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-24 h-fit space-y-8">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Discover By Genre</h3>
              <CategoryList 
                categories={categories} 
                currentCategory={categoryFilter} 
                setCategory={setCategoryFilter} 
              />
            </div>
            
            <div className="p-6 rounded-[2rem] bg-indigo-600 text-white shadow-xl shadow-indigo-500/20">
              <Library className="w-8 h-8 mb-4 opacity-80" />
              <h4 className="font-bold text-lg leading-tight">Library Access</h4>
              <p className="text-xs text-indigo-100 mt-2 leading-relaxed opacity-90">Browse our full physical archive digitally.</p>
            </div>
          </aside>

          {/* RESULTS GRID */}
          <section className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex flex-row sm:flex-col gap-4">
                    <Skeleton className="w-28 sm:w-full aspect-[3/4] rounded-2xl" />
                    <div className="flex-1 space-y-3 py-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center bg-white dark:bg-zinc-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-zinc-800">
                <Ghost className="w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-xl font-bold italic">No matches found</h3>
                <p className="text-muted-foreground mt-2 mb-6">Try a different title or genre.</p>
                <Button onClick={() => {setSearchQuery(""); setCategoryFilter("all")}} className="rounded-full px-8">Reset Search</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-6 sm:gap-y-12 sm:gap-x-8">
                {filteredBooks.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Search;