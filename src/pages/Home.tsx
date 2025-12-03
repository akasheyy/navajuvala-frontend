import { useState, useMemo } from "react";
import { getPublicBooks } from "@/lib/api";
import { BookCard } from "@/components/BookCard";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: books = [], isLoading } = useQuery({
    queryKey: ['public-books'],
    queryFn: getPublicBooks,
  });

  // ⭐ Extract categories from books (from array field)
  const categories = useMemo(() => {
    const set = new Set<string>();

    books.forEach(book => {
      if (Array.isArray(book.categories)) {
        book.categories.forEach(cat => set.add(cat));
      }
    });

    return Array.from(set);
  }, [books]);

  // ⭐ Filter books
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.includes(searchQuery);

      const matchesCategory =
        categoryFilter === "all" ||
        (Array.isArray(book.categories) && book.categories.includes(categoryFilter));

      return matchesSearch && matchesCategory;
    });
  }, [books, searchQuery, categoryFilter]);


  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-hero-gradient py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-library-gradient mb-4">
              <BookOpen className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-4xl font-bold">Welcome to നവജ്വാല വായനശാല</h2>
            <p className="text-lg text-muted-foreground">
              Discover, explore and enjoy our extensive collection of books
            </p>
          </div>
        </div>
      </section>

      {/* Search + Filter */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, author, or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4 animate-pulse" />
              <h3 className="text-2xl font-semibold mb-2">Loading books...</h3>
              <p className="text-muted-foreground">Please wait while we fetch the latest collection</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No books found</h3>
              <p className="text-muted-foreground">
                {books.length === 0
                  ? "The library collection is currently empty. Check back later!"
                  : "Try adjusting your search or filters"}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-2xl font-semibold">
                  {searchQuery || categoryFilter !== "all"
                    ? `Found ${filteredBooks.length} book${filteredBooks.length !== 1 ? "s" : ""}`
                    : "All Books"}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
