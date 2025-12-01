import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getBooks } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Plus, BookMarked, Package, TrendingUp, LogOut } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);

  // New login check (JWT)
  const isAdminLoggedIn = () => !!localStorage.getItem("adminToken");

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate("/admin/login");
      return;
    }

    // Load books from backend, not localStorage
    getBooks()
      .then((data) => setBooks(data))
      .catch(() => setBooks([]));
  }, [navigate]);

  const totalBooks = books.length;
  const totalCopies = books.reduce((sum, b) => sum + (b.qty || 0), 0);
 const borrowedBooks = books.reduce((sum, b) => sum + (b.borrowed || 0), 0);
const availableCopies = books.reduce((sum, b) => sum + (b.available || 0), 0);

  const stats = [
    {
      title: "Total Books",
      value: totalBooks,
      icon: BookOpen,
      description: "Unique titles",
      filter: "all",
    },
    {
      title: "Total Copies",
      value: totalCopies,
      icon: Package,
      description: "All copies",
      filter: "all",
    },
    {
      title: "Available",
      value: availableCopies,
      icon: BookMarked,
      description: "Ready to borrow",
      filter: "available",
    },
    {
      title: "Borrowed",
      value: borrowedBooks,
      icon: TrendingUp,
      description: "Currently out",
      filter: "borrowed",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your library collection</p>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild className="shadow-hover">
              <Link to="/admin/books/new">
                <Plus className="w-4 h-4 mr-2" />
                Add New Book
              </Link>
            </Button>
          </div>
        </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card
                key={stat.title}
                className="shadow-card cursor-pointer hover:shadow-hover transition-shadow"
                onClick={() => {
                  if (stat.title === "Borrowed") {
                    navigate("/admin/borrow-records");
                  }
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className="w-10 h-10 rounded-lg bg-library-gradient flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>


        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>All Books</CardTitle>
            <Button asChild variant="outline">
              <Link to="/admin/books">Manage Books</Link>
            </Button>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
