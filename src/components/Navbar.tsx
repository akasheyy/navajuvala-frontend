import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, LayoutDashboard, LogOut, Menu, X } from "lucide-react";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdminLoggedIn = !!localStorage.getItem("adminToken");
  const isAdminPage = location.pathname.startsWith("/admin");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">

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

            {/* Desktop Buttons */}
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

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded hover:bg-muted"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

          </div>
        </div>
      </nav>

      {/* Slide-in Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-[100] transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button className="p-2" onClick={() => setMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col p-4 space-y-4">
          {!isAdminPage && (
            <>
              <Button variant="outline" asChild onClick={() => setMenuOpen(false)}>
                <Link to="/about">About</Link>
              </Button>

              <Button variant="outline" asChild onClick={() => setMenuOpen(false)}>
                <Link to="/admin/login">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Admin Login
                </Link>
              </Button>
            </>
          )}

          {isAdminPage && isAdminLoggedIn && (
            <>
              <Button variant="outline" asChild onClick={() => setMenuOpen(false)}>
                <Link to="/admin">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </Button>

              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          )}
        </div>
      </div>

      {/* BACKDROP when menu open */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/40 z-[90] md:hidden"
        />
      )}
    </>
  );
};
