import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getBooks, deleteBook } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Edit, Trash2, Search, Book,
  Hash, MoreHorizontal, LayoutGrid, List, AlertCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Progress } from "@/components/ui/progress";

const ManageBooks = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
    const q = searchQuery.toLowerCase();
    return books.filter((b: any) =>
      b.title?.toLowerCase().includes(q) ||
      b.author?.toLowerCase().includes(q) ||
      b.isbn?.toLowerCase().includes(q)
    );
  }, [books, searchQuery]);

  const stats = useMemo(() => ({
    total: books.length,
    lowStock: books.filter((b: any) => b.available > 0 && b.available < 3).length,
    outOfStock: books.filter((b: any) => b.available === 0).length,
  }), [books]);

  const handleDelete = async (id: string, title: string) => {
    try {
      await deleteBook(id);
      refetch();
      toast({ title: "Book deleted", description: `"${title}" removed.` });
    } catch {
      toast({ title: "Error", description: "Failed to delete book", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inventory Management</h1>
            <p className="text-slate-500">Monitor and manage your library titles.</p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link to="/admin/books/new">
              <Plus className="w-4 h-4 mr-2" /> Add Book
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard title="Total Titles" value={stats.total} icon={<Book className="text-blue-500" />} />
          <StatCard title="Low Stock" value={stats.lowStock} icon={<AlertCircle className="text-amber-500" />} />
          <StatCard title="Out of Stock" value={stats.outOfStock} icon={<Trash2 className="text-red-500" />} />
        </div>

        {/* Main Table Card */}
        <Card className="border-none shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="bg-white p-4 border-b">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-50 border-none"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="py-20 text-center text-slate-500">Loading inventory...</div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Book Details</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBooks.map((book: any) => (
                    <TableRow key={book._id}>
                      <TableCell className="py-4">
                        <div className="font-bold text-slate-900">{book.title}</div>
                        <div className="text-sm text-slate-500">{book.author}</div>
                      </TableCell>

                      <TableCell>
                        <div className="w-32 space-y-1">
                          <div className="flex justify-between text-[10px] font-bold uppercase">
                            <span className={book.available === 0 ? "text-red-500" : "text-slate-600"}>
                              {book.available} Left
                            </span>
                            <span className="text-slate-400">{book.qty} Total</span>
                          </div>
                          <Progress value={(book.available / book.qty) * 100} className="h-1" />
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-2">
                          {/* BUTTON FIX: Truly disables if stock is 0 */}
                          {book.available > 0 ? (
                            <Button size="sm" variant="outline" asChild className="h-8">
                              <Link to={`/admin/books/borrow/${book._id}`}>Borrow</Link>
                            </Button>
                          ) : (
                            <Button size="sm" variant="ghost" disabled className="h-8 bg-slate-100">
                              Out of Stock
                            </Button>
                          )}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/admin/books/edit/${book._id}`}>Edit</Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button className="w-full text-left px-2 py-1.5 text-sm text-red-600 hover:bg-red-50">Delete</button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete {book.title}?</AlertDialogTitle>
                                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(book._id, book.title)} className="bg-red-600">Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

// Simple StatCard component inside the same file
const StatCard = ({ title, value, icon }: any) => (
  <Card className="border-none shadow-sm">
    <CardContent className="p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
    </CardContent>
  </Card>
);

export default ManageBooks;
