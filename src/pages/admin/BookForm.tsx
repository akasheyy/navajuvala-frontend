import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createBook, updateBook, getBookById } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    year: "",
    qty: 1,
    description: "",
    categories: [] as string[],
    cover: "" as any,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: book } = useQuery({
    queryKey: ["book", id],
    queryFn: () => getBookById(id!),
    enabled: isEdit && !!id,
  });

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      navigate("/admin/login");
      return;
    }

    if (isEdit && book) {
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        year: book.year,
        qty: book.qty,
        description: book.description || "",
        categories: book.categories || [],
        cover: book.cover || "",
      });

      if (book.cover) {
        setPreviewUrl(book.cover);
      }
    }
  }, [book, isEdit, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    const bookData = {
      ...formData,
      cover: selectedFile || undefined,
    };

    try {
      if (isEdit && id) {
        await updateBook(id, bookData);
        toast({ title: "Book updated", description: `"${formData.title}" updated successfully` });
      } else {
        await createBook(bookData);
        toast({ title: "Book added", description: `"${formData.title}" added successfully` });
      }

      navigate("/admin/books");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "qty" ? parseInt(value) || 0 : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // validate type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // validate size
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 2MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setFormData((prev) => ({
      ...prev,
      cover: file, // raw file (required by multer + cloudinary)
    }));

    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/admin/books">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Books
          </Link>
        </Button>

        <Card className="max-w-3xl mx-auto shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl">
              {isEdit ? "Edit Book" : "Add New Book"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input name="title" value={formData.title} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label>Author *</Label>
                  <Input name="author" value={formData.author} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label>ISBN *</Label>
                  <Input name="isbn" value={formData.isbn} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label>Year *</Label>
                  <Input name="year" value={formData.year} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label>Quantity *</Label>
                  <Input
                    name="qty"
                    type="number"
                    min={1}
                    value={formData.qty}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Categories *</Label>
                  <Input
                    name="categories"
                    value={formData.categories.join(", ")}
                    onChange={(e) => {
                      const categories = e.target.value
                        .split(",")
                        .map((cat) => cat.trim())
                        .filter((cat) => cat);
                      setFormData((p) => ({ ...p, categories }));
                    }}
                    placeholder="e.g., Fiction, Mystery"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cover Image</Label>
                <Input type="file" accept="image/*" onChange={handleFileChange} />

                {previewUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">Preview:</p>
                    <img src={previewUrl} className="w-24 h-32 object-cover rounded border" />
                  </div>
                )}

                {!previewUrl && formData.cover && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">Current image:</p>
                    <img
                      src={formData.cover as any}
                      className="w-24 h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={isUploading}>
                  <Save className="w-4 h-4 mr-2" />
                  {isUploading ? "Uploading..." : isEdit ? "Update Book" : "Add Book"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/books")}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookForm;
