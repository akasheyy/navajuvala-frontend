import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBorrowRecord, returnBorrowRecord, deleteBorrowRecord } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User, BookOpen, Calendar, Trash2, Check } from "lucide-react";

const BorrowerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["borrow-record", id],
    queryFn: () => getBorrowRecord(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: "Failed to load record",
        variant: "destructive",
      });
    }
  }, [isError]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4 animate-pulse" />
          <h2 className="text-2xl font-semibold mb-2">Loading record...</h2>
        </div>
      </div>
    );
  }

  const record = data?.record;
  const book = data?.book;

  if (!record) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Record not found</h2>
          <Button asChild>
            <Link to="/admin/borrow-records">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const isOverdue = !record.returned && new Date(record.returnDate) < new Date();
  const statusLabel = record.returned ? "Returned" : isOverdue ? "Overdue" : "Borrowed";

  const handleMarkReturned = async () => {
    try {
      await returnBorrowRecord(record._id);
      toast({ title: "Returned", description: "Marked returned" });
      refetch();
    } catch (err) {
      toast({ title: "Error", description: "Failed to mark returned", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this borrow record? This action cannot be undone.")) return;
    try {
      await deleteBorrowRecord(record._id);
      toast({ title: "Deleted", description: "Borrow record deleted" });
      navigate("/admin/borrow-records");
    } catch {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/admin/borrow-records">Back to records</Link>
            </Button>
            
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Book card */}
          <div className="md:col-span-1">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">{book?.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-secondary mb-4 flex items-center justify-center">
                  {book?.cover ? (
                    <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="w-24 h-24 text-muted-foreground" />
                  )}
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Author</p>
                    <div className="font-medium">{book?.author}</div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ISBN</p>
                    <div className="font-medium">{book?.isbn}</div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <div className="font-medium">{book?.categories?.join(", ")}</div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total copies</p>
                    <div className="font-medium">{book?.qty}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Borrower details */}
          <div className="md:col-span-2 space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Borrower Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <User className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <div className="font-medium">{record.borrowerName}</div>
                      <p className="text-xs text-muted-foreground mt-1">{record.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <div className="font-medium">{record.phone}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Borrow Date</p>
                      <div className="font-medium">{new Date(record.borrowDate).toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Return Date</p>
                      <div className="font-medium">
                        <span className={isOverdue ? "text-red-600 font-semibold" : ""}>
                          {new Date(record.returnDate).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <div className="font-medium">{record.notes || "—"}</div>
                  </div>

                  <div className="col-span-full mt-2">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="mt-2">
                      <Badge variant={record.returned ? "default" : isOverdue ? "destructive" : "secondary"}>
                        {statusLabel}
                      </Badge>
                      {record.returned && record.returnedAt && (
                        <div className="text-xs text-muted-foreground mt-2">Returned at: {new Date(record.returnedAt).toLocaleString()}</div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admin actions / timeline */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-muted mt-2" />
                    <div>
                      <div className="text-sm text-muted-foreground">Borrowed on</div>
                      <div className="font-medium">{new Date(record.borrowDate).toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full ${record.returned ? "bg-green-500" : isOverdue ? "bg-red-500" : "bg-yellow-400"} mt-2`} />
                    <div>
                      <div className="text-sm text-muted-foreground">Return due</div>
                      <div className="font-medium">{new Date(record.returnDate).toLocaleString()}</div>
                    </div>
                  </div>

                  {record.returned && record.returnedAt && (
  <div className="flex items-start gap-3">
    <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
    <div>
      <div className="text-sm text-muted-foreground">Returned at</div>
      <div className="font-medium">
        {new Date(record.returnedAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour12: true,
        })}
      </div>
    </div>
  </div>
)}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
      </div>

      <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/admin/borrow-records"></Link>
            </Button>
            {!record.returned && (
              <Button onClick={handleMarkReturned} className="flex items-center gap-2" variant="secondary">
                <Check className="w-4 h-4" /> Mark Returned
              </Button>
            )}
            <Button onClick={handleDelete} variant="destructive" className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
          </div>
        </div>
    </div>
  );
};

export default BorrowerDetail;
