import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Search,
  Heart,
  Library,
  Plus,
  ClipboardList,
  ShieldCheck,
  Home,
  ChevronRight
} from "lucide-react";

/* ================= CONSTANTS ================= */
const STORAGE_KEY = "savedBookIds";
const EVENT_NAME = "liked-books-updated";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [likedCount, setLikedCount] = useState(0);

  const isAdminLoggedIn = Boolean(localStorage.getItem("adminToken"));
  const isAdminPage = location.pathname.startsWith("/admin");

  const updateLikedCount = () => {
    const saved: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setLikedCount(saved.length);
  };

  useEffect(() => {
    updateLikedCount();
    const handler = () => updateLikedCount();
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    updateLikedCount();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
    setMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-library-gradient flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold group-hover:text-primary transition-colors">
                Navajvaala Vayanashala
              </h1>
              <p className="text-xs text-muted-foreground">
                Your Community Library
              </p>
            </div>
          </Link>

          {/* ================= DESKTOP MENU ================= */}
          <div className="hidden md:flex items-center gap-1">
            {!isAdminPage ? (
              <>
                <NavButton to="/" icon={<Home className="w-4 h-4" />} label="Home" active={isActive("/")} />
                <NavButton to="/search" icon={<Search className="w-4 h-4" />} label="Search" active={isActive("/search")} />
                <NavButton
                  to="/liked"
                  icon={<Heart className={`w-4 h-4 ${likedCount > 0 ? "fill-red-500 text-red-500" : ""}`} />}
                  label="Liked"
                  active={isActive("/liked")}
                  badge={likedCount > 0 ? likedCount : undefined}
                />
                <Separator orientation="vertical" className="h-6 mx-2" />
                <NavButton to="/admin/login" icon={<ShieldCheck className="w-4 h-4" />} label="Admin" active={isActive("/admin/login")} variant="secondary" />
              </>
            ) : isAdminLoggedIn && (
              <>
                <NavButton to="/admin" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" active={isActive("/admin")} />
                <NavButton to="/admin/books" icon={<Library className="w-4 h-4" />} label="Books" active={isActive("/admin/books")} />
                <NavButton to="/admin/books/new" icon={<Plus className="w-4 h-4" />} label="Add" active={isActive("/admin/books/new")} />
                <NavButton to="/admin/borrow-records" icon={<ClipboardList className="w-4 h-4" />} label="Records" active={isActive("/admin/borrow-records")} />
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg ml-2">
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <Button variant="ghost" size="icon" className="md:hidden rounded-xl border" onClick={() => setMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </nav>

      {/* ================= MOBILE SIDEBAR ================= */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-slate-950 shadow-2xl z-[100] transform transition-transform duration-500 ease-in-out border-l ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 flex justify-between items-center border-b">
          <div>
            <h2 className="text-xl font-black">Menu</h2>
            <p className="text-xs text-muted-foreground">{isAdminPage ? "Staff Administration" : "Reader Access"}</p>
          </div>
          <Button variant="outline" size="icon" className="rounded-full h-10 w-10" onClick={() => setMenuOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col p-4 space-y-1.5 h-[calc(100%-100px)] overflow-y-auto">
          {!isAdminPage ? (
            <>
              <MobileNavLink to="/" icon={<Home />} label="Home" active={isActive("/")} />
              <MobileNavLink to="/search" icon={<Search />} label="Search Library" active={isActive("/search")} />
              <MobileNavLink to="/liked" icon={<Heart className={likedCount > 0 ? "text-red-500 fill-red-500" : ""} />} label="My Favorites" active={isActive("/liked")} badge={likedCount} />
              <div className="py-4"><Separator /></div>
              <MobileNavLink to="/admin/login" icon={<ShieldCheck />} label="Admin Login" active={isActive("/admin/login")} variant="secondary" />
            </>
          ) : isAdminLoggedIn && (
            <>
              <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Management</p>
              <MobileNavLink to="/admin" icon={<LayoutDashboard />} label="Admin Dashboard" active={isActive("/admin")} />
              <MobileNavLink to="/admin/books" icon={<Library />} label="Inventory" active={isActive("/admin/books")} />
              <MobileNavLink to="/admin/books/new" icon={<Plus />} label="Add New Title" active={isActive("/admin/books/new")} />
              <MobileNavLink to="/admin/borrow-records" icon={<ClipboardList />} label="Borrow Records" active={isActive("/admin/borrow-records")} />

              <div className="mt-auto pt-10">
                <Button
                  variant="destructive"
                  className="w-full justify-start h-12 rounded-xl px-4 shadow-lg shadow-red-200 dark:shadow-none"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5 mr-3" /> Logout
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[90] md:hidden transition-opacity"
        />
      )}
    </>
  );
};

/* ================= HELPER COMPONENTS ================= */

const NavButton = ({ to, icon, label, active, badge, variant = "ghost" }: any) => (
  <Button
    variant={active ? "default" : variant}
    asChild
    className={`h-10 px-4 rounded-xl transition-all duration-200 ${!active ? "hover:bg-slate-100 dark:hover:bg-slate-800" : "shadow-md shadow-primary/20"}`}
  >
    <Link to={to} className="flex items-center gap-2">
      {icon}
      <span className="font-semibold text-sm">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${active ? "bg-white text-primary" : "bg-primary text-white"}`}>
          {badge}
        </span>
      )}
    </Link>
  </Button>
);

const MobileNavLink = ({ to, icon, label, active, badge, variant = "ghost" }: any) => (
  <Link
    to={to}
    className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
      active
        ? "bg-primary text-white shadow-lg shadow-primary/20"
        : variant === "secondary"
          ? "bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white"
          : "hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400"
    }`}
  >
    <div className="flex items-center gap-4">
      <span className={active ? "text-white" : "text-primary"}>
        {React.isValidElement(icon)
          ? React.cloneElement(icon, { className: "w-5 h-5" })
          : icon}
      </span>
      <span className="font-bold tracking-tight">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {badge > 0 && !active && (
        <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      <ChevronRight className={`w-4 h-4 opacity-50 ${active ? "text-white" : ""}`} />
    </div>
  </Link>
);
