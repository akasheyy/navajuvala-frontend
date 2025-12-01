import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, LayoutDashboard, LogOut, Menu, X } from "lucide-react";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminLoggedIn = !!localStorage.getItem("adminToken");
  const isAdminPage = location.pathname.startsWith("/admin");

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-library-gradient flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold group-hover:text-primary transition-colors">
              Navajuvala Vayanashala
            </h1>
            <p className="text-xs text-muted-foreground">Your Community Library</p>
          </div>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-3">

          {!isAdminPage && (
            <>
              <Button variant="outline" asChild>
                <Link to="/about">About</Link>
              </Button>

              <Button variant="outline" asChild>
                <Link to="/admin/login">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Admin
                </Link>
              </Button>
            </>
          )}

          {isAdminPage && isAdminLoggedIn && (
            <>
              <Button variant="outline" asChild>
                <Link to="/admin">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-background/90 backdrop-blur-sm px-4 py-4 space-y-3">

          {!isAdminPage && (
            <>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
              </Button>

              <Button variant="outline" className="w-full" asChild>
                <Link to="/admin/login" onClick={() => setMenuOpen(false)}>
                  Admin Login
                </Link>
              </Button>
            </>
          )}

          {isAdminPage && isAdminLoggedIn && (
            <>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/admin" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
              </Button>

              <Button variant="outline" className="w-full" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
