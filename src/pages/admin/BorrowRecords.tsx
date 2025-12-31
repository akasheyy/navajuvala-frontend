import { useQuery } from "@tanstack/react-query";
import { getBorrowRecords, returnBorrowRecord } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Calendar, Phone, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useMemo } from "react";

const BorrowRecords = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const { data: records = [], isLoading, refetch } = useQuery({
    queryKey: ["borrow-records"],
    queryFn: getBorrowRecords,
  });

  const filteredRecords = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return records.filter((rec) => {
      const matchesSearch = 
        rec.borrowerName.toLowerCase().includes(q) ||
        rec.phone.toLowerCase().includes(q) ||
        rec.bookTitle.toLowerCase().includes(q);

      const overdue = !rec.returned && new Date(rec.returnDate) < new Date();
      
      if (activeTab === "active") return matchesSearch && !rec.returned && !overdue;
      if (activeTab === "overdue") return matchesSearch && overdue;
      if (activeTab === "returned") return matchesSearch && rec.returned;
      return matchesSearch;
    });
  }, [records, searchQuery, activeTab]);

  const handleReturn = async (recordId: string) => {
    try {
      await returnBorrowRecord(recordId);
      toast({ title: "Success", description: "Book marked as returned." });
      refetch();
    } catch {
      toast({ title: "Error", description: "Update failed.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-8">
          <Button variant="ghost" asChild className="w-fit -ml-2 text-slate-500 hover:text-slate-900">
            <Link to="/admin">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Borrowing History</h1>
              <p className="text-slate-500">Track and manage library distributions.</p>
            </div>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search borrower or book..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Filters & Content */}
        <Tabs defaultValue="all" className="space-y-6" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
            <TabsList className="bg-transparent border-none">
              <TabsTrigger value="all" className="data-[state=active]:bg-slate-100">All Records</TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Active</TabsTrigger>
              <TabsTrigger value="overdue" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700">Overdue</TabsTrigger>
              <TabsTrigger value="returned" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">Returned</TabsTrigger>
            </TabsList>
          </div>

          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="py-20 text-center flex flex-col items-center gap-3">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500">Fetching records...</p>
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="py-20 text-center">
                  <Clock className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">No records found matching your criteria.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow>
                        <TableHead className="w-[300px]">Book & Borrower</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record) => {
                        const overdue = !record.returned && new Date(record.returnDate) < new Date();
                        
                        return (
                          <TableRow key={record._id} className="group hover:bg-slate-50/50 transition-colors">
                            <TableCell className="py-4">
                              <div className="flex flex-col">
                                <span className="font-semibold text-slate-900 leading-none mb-1">
                                  {record.bookTitle}
                                </span>
                                <Link 
                                  to={`/admin/borrow/${record._id}`} 
                                  className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                                >
                                  {record.borrowerName}
                                </Link>
                                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                    <Phone className="w-3 h-3" /> {record.phone}
                                </div>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex flex-col gap-1 text-sm">
                                <div className="flex items-center text-slate-600">
                                  <Calendar className="w-3.5 h-3.5 mr-2 text-slate-400" />
                                  Out: {new Date(record.borrowDate).toLocaleDateString()}
                                </div>
                                <div className={`flex items-center ${overdue ? "text-red-600 font-medium" : "text-slate-500"}`}>
                                  <Clock className="w-3.5 h-3.5 mr-2 text-slate-400" />
                                  Due: {new Date(record.returnDate).toLocaleDateString()}
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>
                              {record.returned ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1 px-2">
                                  <CheckCircle2 className="w-3 h-3" /> Returned
                                </Badge>
                              ) : overdue ? (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1 px-2">
                                  <AlertCircle className="w-3 h-3" /> Overdue
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1 px-2">
                                  <Clock className="w-3 h-3" /> In Use
                                </Badge>
                              )}
                            </TableCell>

                            <TableCell className="text-right">
                              {!record.returned && (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleReturn(record._id)}
                                  className="bg-white text-slate-900 border-slate-200 hover:bg-slate-50 shadow-sm"
                                  variant="outline"
                                >
                                  Mark Returned
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
};

export default BorrowRecords;