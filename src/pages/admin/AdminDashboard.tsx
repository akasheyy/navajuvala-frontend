import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getBooks } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Plus, BookMarked, Package, 
  TrendingUp, Settings, Users, ArrowRight 
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdminLoggedIn = () => !!localStorage.getItem("adminToken");

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate("/admin/login");
      return;
    }

    getBooks()
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch(() => {
        setBooks([]);
        setLoading(false);
      });
  }, [navigate]);

  const stats = [
    { title: "Total Titles", value: books.length, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Total Volume", value: books.reduce((sum, b) => sum + (b.qty || 0), 0), icon: Package, color: "text-orange-600", bg: "bg-orange-100" },
    { title: "Available", value: books.reduce((sum, b) => sum + (b.available || 0), 0), icon: BookMarked, color: "text-green-600", bg: "bg-green-100" },
    { title: "Borrowed", value: books.reduce((sum, b) => sum + (b.borrowed || 0), 0), icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100", link: "/admin/borrow-records" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />

      <main className="container mx-auto px-4 py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <Badge variant="outline" className="mb-2 px-3 py-1 text-xs uppercase tracking-wider">
              Management Portal
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Library Overview</h1>
            <p className="text-slate-500 mt-1">Real-time analytics and collection management.</p>
          </div>
          
          <div className="flex gap-3">
             <Button asChild className="bg-primary hover:bg-primary/90 shadow-lg">
                <Link to="/admin/books">
                  <Plus className="w-4 h-4 mr-2" /> Manage Books
                </Link>
             </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => (
            <Card 
              key={stat.title} 
              className={`border-none shadow-sm transition-all duration-200 ${stat.link ? 'cursor-pointer hover:ring-2 hover:ring-primary/20' : ''}`}
              onClick={() => stat.link && navigate(stat.link)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  {stat.link && <ArrowRight className="w-4 h-4 text-slate-300" />}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900">{loading ? "..." : stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Collection Table Preview */}
          <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-white border-b">
              <div>
                <CardTitle className="text-lg">Recent Collection</CardTitle>
                <CardDescription>A snapshot of your library titles.</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-primary">
                <Link to="/admin/books">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Title</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Inventory</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {books.slice(0, 5).map((book) => (
                      <tr key={book.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{book.title}</td>
                        <td className="px-6 py-4">
                          <Badge variant={book.available > 0 ? "secondary" : "destructive"} className="font-normal">
                            {book.available > 0 ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right text-slate-500">
                          {book.available} / {book.qty}
                        </td>
                      </tr>
                    ))}
                    {books.length === 0 && (
                        <tr>
                            <td colSpan={3} className="px-6 py-10 text-center text-slate-400">No books found in collection.</td>
                        </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions / Activity Sidebar */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-slate-900 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Button variant="secondary" className="w-full justify-start font-normal" asChild>
                    <Link to="/admin/borrow-records"><Users className="w-4 h-4 mr-2" /> Manage Borrowers</Link>
                </Button>
                <Button variant="secondary" className="w-full justify-start font-normal" asChild>
                    <Link to="/admin/books/new"><Plus className="w-4 h-4 mr-2" /> Add Inventory</Link>
                </Button>
                <Button variant="secondary" className="w-full justify-start font-normal" onClick={() => window.print()}>
                    <BookMarked className="w-4 h-4 mr-2" /> Export Reports
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">System Health</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm text-slate-600">Database Connected</span>
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;