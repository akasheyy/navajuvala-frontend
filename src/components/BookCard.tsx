import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  year: string;
  qty: number;
  description?: string;
  categories: string[];
  cover?: string;
}

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
  const coverUrl = book.cover;
  const category = book.categories?.[0] || "General";

  return (
    <Link to={`/book/${book._id}`}>
      <Card className="h-full transition-all duration-300 hover:shadow-hover cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {book.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">by {book.author}</p>
            </div>

            <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-secondary flex items-center justify-center">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt="cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <BookOpen className="w-6 h-6 text-primary" />
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">{category}</Badge>
            <Badge
  variant={book.available > 0 ? "default" : "destructive"}
  className="font-medium"
>
  {book.available > 0 ? `${book.available} Available` : "Not Available"}
</Badge>

          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {book.description}
          </p>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>ISBN: {book.isbn}</span>
            <span>{book.year}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
