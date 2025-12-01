import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getBookById, createBorrowRecord } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const BorrowForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: book, isLoading } = useQuery({
    queryKey: ["admin-book", id],
    queryFn: () => getBookById(id!),
    enabled: !!id,
  });

  const [form, setForm] = useState({
    borrowerName: "",
    phone: "",
    address: "",
    borrowDate: new Date().toISOString().slice(0, 10),
    returnDate: "",
    notes: "",
  });

  useEffect(() => {
    if (book && !form.returnDate) {
      // default return date 14 days from today
      const dt = new Date();
      dt.setDate(dt.getDate() + 14);
      setForm((f) => ({ ...f, returnDate: dt.toISOString().slice(0, 10) }));
    }
  }, [book]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await createBorrowRecord(id, {
        borrowerName: form.borrowerName,
        phone: form.phone,
        address: form.address,
        borrowDate: form.borrowDate,
        returnDate: form.returnDate,
        notes: form.notes,
      });
      toast({
        title: "Borrow recorded",
        description: `Borrower ${form.borrowerName} recorded for "${book?.title}"`,
      });
      navigate("/admin/books");
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save borrow record",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/admin/books">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Manage Books
          </Link>
        </Button>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Borrow — {book?.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="borrowerName">Borrower Name</Label>
                <Input id="borrowerName" name="borrowerName" value={form.borrowerName} onChange={handleChange} required />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" value={form.phone} onChange={handleChange} required />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" value={form.address} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="borrowDate">Borrow Date</Label>
                  <Input type="date" id="borrowDate" name="borrowDate" value={form.borrowDate} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="returnDate">Return Date</Label>
                  <Input type="date" id="returnDate" name="returnDate" value={form.returnDate} onChange={handleChange} required />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" value={form.notes} onChange={handleChange} rows={4} />
              </div>

              <div className="flex gap-3">
                <Button type="submit">Confirm Borrow</Button>
                <Button variant="outline" asChild>
                  <Link to="/admin/books">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BorrowForm;
