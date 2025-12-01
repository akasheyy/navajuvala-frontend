import { useQuery } from "@tanstack/react-query";
import { getBorrowRecords, returnBorrowRecord } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";

const BorrowRecords = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: records = [], isLoading, refetch } = useQuery({
    queryKey: ["borrow-records"],
    queryFn: getBorrowRecords,
  });

  // 🔍 FILTER LOGIC
  const filteredRecords = useMemo(() => {
    const q = searchQuery.toLowerCase();

    return records.filter((rec) =>
      rec.borrowerName.toLowerCase().includes(q) ||
      rec.phone.toLowerCase().includes(q) ||
      rec.bookTitle.toLowerCase().includes(q) ||
      rec.borrowDate.includes(q) ||
      rec.returnDate.includes(q)
    );
  }, [records, searchQuery]);

  const handleReturn = async (recordId: string) => {
    try {
      await returnBorrowRecord(recordId);
      toast({
        title: "Book returned",
        description: "The book has been marked as returned.",
      });
      refetch();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update return status.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/admin">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
          {/* 🔍 SEARCH BAR */}
          <div className="mb-6 w-full sm:w-80 relative px-6">
            <Search className="absolute left-9 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search borrower, phone, book..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Borrow Records ({filteredRecords.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center">Loading...</div>
            ) : filteredRecords.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">No matching records.</div>
            ) : (
              <Table>
                {/* TABLE HEADER */}
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead>Borrower</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Borrowed</TableHead>
                    <TableHead>Return Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                {/* TABLE ROWS */}
                <TableBody>
                  {filteredRecords.map((record) => {
                    const overdue =
                      !record.returned &&
                      new Date(record.returnDate) < new Date();

                    return (
                      <TableRow key={record._id}>
                        <TableCell>{record.bookTitle}</TableCell>
                        <Link to={`/admin/borrow/${record._id}`} className="text-blue-600 hover:underline" >
                        <TableCell>{record.borrowerName}</TableCell>
                        </Link>
                        <TableCell>{record.phone}</TableCell>

                        <TableCell>
                          {new Date(record.borrowDate).toLocaleDateString()}
                        </TableCell>

                        <TableCell>
                          <span className={overdue ? "text-red-500 font-semibold" : ""}>
                            {new Date(record.returnDate).toLocaleDateString()}
                          </span>
                        </TableCell>

                        <TableCell>
                          {record.returned ? (
                            <Badge variant="default">Returned</Badge>
                          ) : overdue ? (
                            <Badge variant="destructive">Overdue</Badge>
                          ) : (
                            <Badge variant="secondary">Borrowed</Badge>
                          )}
                        </TableCell>

                        <TableCell className="text-right">
                          {!record.returned && (
                            <Button size="sm" variant="outline" onClick={() => handleReturn(record._id)}>
                              Mark Returned
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BorrowRecords;
