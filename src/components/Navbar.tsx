import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, LayoutDashboard, LogOut } from "lucide-react";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminLoggedIn = !!localStorage.getItem("adminToken");
  const isAdminPage = location.pathname.startsWith("/admin");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
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

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
  <Link to="/about">
    About
  </Link>
</Button>


            {/* PUBLIC PAGES → Only show Admin Login */}
            {!isAdminPage && (
              <Button variant="outline" asChild>
                <Link to="/admin/login">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Admin Login
                </Link>
              </Button>
            )}

            {/* ADMIN PAGES → Show Dashboard + Logout */}
            {isAdminPage && isAdminLoggedIn && (
              <>
                <Button variant="secondary" asChild>
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
      </div>
    </nav>
  );
};
