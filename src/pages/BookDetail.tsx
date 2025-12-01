import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPublicBookById } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, User, Hash, Calendar, BookMarked, Package } from "lucide-react";

const BookDetail = () => {
  const { id } = useParams();

  const { data: book, isLoading, isError } = useQuery({
    queryKey: ["public-book", id],
    queryFn: () => getPublicBookById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4 animate-pulse" />
          <h2 className="text-2xl font-semibold mb-2">Loading book...</h2>
        </div>
      </div>
    );
  }

  if (!book || isError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Book not found</h2>
          <p className="text-muted-foreground mb-6">The book you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Library
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // ✅ FIX: Define availability state
  const isAvailable = book.available > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Link>
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* LEFT: IMAGE + STATUS */}
          <div className="md:col-span-1">
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="aspect-[3/4] bg-secondary rounded-lg flex items-center justify-center overflow-hidden mb-4">
                  {book.cover ? (
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="w-24 h-24 text-muted-foreground" />
                  )}
                </div>

                <div className="space-y-3">
                  {/* 🟥 Red if not available */}
                  <Badge
                    variant={isAvailable ? "default" : "destructive"}
                    className="w-full justify-center text-sm py-2"
                  >
                    {isAvailable
                      ? `${book.available} of ${book.qty} Available`
                      : "Out of Stock"}
                  </Badge>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-2">
                    {book.categories?.map((cat, i) => (
                      <Badge key={i} variant="secondary" className="py-1 px-3">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: DETAILS */}
          <div className="md:col-span-2 space-y-6">

            <div>
              <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
              <p className="text-xl text-muted-foreground">by {book.author}</p>
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{book.description}</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Book Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">

                  <DetailItem icon={User} label="Author" value={book.author} />
                  <DetailItem icon={Hash} label="ISBN" value={book.isbn} />
                  <DetailItem icon={Calendar} label="Year" value={book.year} />
                  <DetailItem
                    icon={BookMarked}
                    label="Categories"
                    value={book.categories.join(", ")}
                  />
                  <DetailItem icon={Package} label="Total Copies" value={String(book.qty)} />

                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;

// Reusable detail component
const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
      <Icon className="w-5 h-5 text-secondary-foreground" />
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);
