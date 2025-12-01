import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BookDetail from "./pages/BookDetail";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageBooks from "./pages/admin/ManageBooks";
import BookForm from "./pages/admin/BookForm";
import NotFound from "./pages/NotFound";
import BorrowForm from "./pages/admin/BorrowForm";
import BorrowRecords from "./pages/admin/BorrowRecords";
import BorrowerDetail from "@/pages/admin/BorrowerDetail";
import About from "@/pages/About";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/books" element={<ManageBooks />} />
          <Route path="/admin/books/new" element={<BookForm />} />
          <Route path="/admin/books/edit/:id" element={<BookForm />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/admin/books/borrow/:id" element={<BorrowForm />} />
          <Route path="/admin/borrow-records" element={<BorrowRecords />} />
          <Route path="/admin/borrow/:id" element={<BorrowerDetail />} />
          <Route path="/about" element={<About />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
