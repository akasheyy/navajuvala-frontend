import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { getBooks, deleteBook, borrowBook, returnBook } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, ArrowLeft, Search } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useQuery } from "@tanstack/react-query";

const ManageBooks = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: books = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-books'],
    queryFn: getBooks,
  });

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const filteredBooks = useMemo(() => {
    let filtered = books;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = books.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn?.toLowerCase().includes(q) ||
        b.categories?.some(cat => cat.toLowerCase().includes(q))
      );
    }

    return filtered;
  }, [books, searchQuery]);

  const handleDelete = async (id: string, title: string) => {
    try {
      await deleteBook(id);
      refetch();
      toast({
        title: "Book deleted",
        description: `"${title}" has been removed from the library`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete book",
        variant: "destructive",
      });
    }
  };

  const handleBorrow = async (id: string, title: string) => {
    try {
      await borrowBook(id);
      refetch();
      toast({
        title: "Borrowed",
        description: `"${title}" borrowed successfully`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to borrow book",
        variant: "destructive",
      });
    }
  };

  const handleReturn = async (id: string, title: string) => {
    try {
      await returnBook(id);
      refetch();
      toast({
        title: "Returned",
        description: `"${title}" returned successfully`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to return book",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/admin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Manage Books</h1>
              <p className="text-muted-foreground">View, edit, and delete books</p>
            </div>
          </div>

          <Button asChild className="shadow-hover">
            <Link to="/admin/books/new">
              <Plus className="w-4 h-4 mr-2" />
              Add New Book
            </Link>
          </Button>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle>All Books ({filteredBooks.length})</CardTitle>

              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, author, ISBN, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading books...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>ISBN</TableHead>
                      <TableHead className="text-center">Copies</TableHead>
                      <TableHead className="text-center">Available</TableHead>
                      <TableHead className="text-center">Borrowed</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredBooks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No books found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBooks.map((book) => (
                        <TableRow key={book._id}>
                          <TableCell className="font-medium">{book.title}</TableCell>
                          <TableCell>{book.author}</TableCell>

                          <TableCell>
                            {book.categories?.map((cat, index) => (
                              <Badge key={index} variant="secondary" className="mr-1">
                                {cat}
                              </Badge>
                            ))}
                          </TableCell>

                          <TableCell>{book.isbn}</TableCell>
                          <TableCell className="text-center">{book.qty}</TableCell>

                          {/* Available */}
                          <TableCell className="text-center">
                            <Badge variant={book.available > 0 ? "default" : "destructive"}>
                              {book.available}
                            </Badge>
                          </TableCell>

                          {/* Borrowed */}
                          <TableCell className="text-center">
                            <Badge variant="secondary">{book.borrowed}</Badge>
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">

                              {/* Borrow */}
                              <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    disabled={book.available === 0}
                                  >
                                    <Link to={`/admin/books/borrow/${book._id}`}>Borrow</Link>
                                  </Button>


                              

                              {/* Edit */}
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/admin/books/edit/${book._id}`}>
                                  <Edit className="w-4 h-4" />
                                </Link>
                              </Button>

                              {/* Delete */}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Book</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{book.title}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>

                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(book._id, book.title)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageBooks;
