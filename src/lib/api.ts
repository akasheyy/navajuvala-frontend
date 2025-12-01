// src/lib/api.ts
// replace: const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = import.meta.env.VITE_API_URL;


interface LoginData {
  email: string;
  password: string;
}

interface BookData {
  title: string;
  author: string;
  isbn: string;
  year: string;
  qty: number;
  description?: string;
  categories: string[];
  cover?: File;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  year: string;
  qty: number;
  description?: string;
  categories: string[];
  cover?: string;
  createdAt: string;
  updatedAt: string;
}

interface LoginResponse {
  token: string;
  admin: {
    id: string;
    username: string;
    role: string;
  };
}

interface DashboardStats {
  totalBooks: number;
  totalUsers: number;
  borrowedBooks: number;
  availableBooks: number;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('adminToken');
};

// Helper function to make authenticated requests
const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken();
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...options.headers,
  });

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });
};

// Admin login
export const loginAdmin = async (data: LoginData): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const result = await response.json();
  localStorage.setItem('adminToken', result.token);
  return result;
};

// Get all books (admin)
export const getBooks = async (): Promise<Book[]> => {
  const response = await authFetch('/admin/books');

  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }

  return response.json();
};

// Get single book by ID (admin)
export const getBookById = async (id: string): Promise<Book> => {
  const response = await authFetch(`/admin/books/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch book');
  }

  return response.json();
};

// Create book (admin)
export const createBook = async (data: BookData): Promise<Book> => {
  const form = new FormData();

  form.append("title", data.title);
  form.append("author", data.author);
  form.append("isbn", data.isbn);
  form.append("year", data.year);
  form.append("qty", String(data.qty));
  form.append("description", data.description || "");

  // Convert array → JSON string
  form.append("categories", JSON.stringify(data.categories));

  // Append image FILE (NOT base64)
  if (data.cover instanceof File) {
    form.append("cover", data.cover);
  }

  const token = localStorage.getItem("adminToken");

  const response = await fetch(`${API_BASE_URL}/admin/books`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // DO NOT set content-type here
    },
    body: form,
  });

  if (!response.ok) throw new Error("Failed to create book");

  return response.json();
};

// Update book (admin)
export const updateBook = async (id: string, data: Partial<BookData>): Promise<Book> => {
  const form = new FormData();

  if (data.title) form.append("title", data.title);
  if (data.author) form.append("author", data.author);
  if (data.isbn) form.append("isbn", data.isbn);
  if (data.year) form.append("year", data.year);
  if (data.qty !== undefined) form.append("qty", String(data.qty));
  if (data.description) form.append("description", data.description);

  if (data.categories) {
    form.append("categories", JSON.stringify(data.categories));
  }

  if (data.cover instanceof File) {
    form.append("cover", data.cover);
  }

  const token = localStorage.getItem("adminToken");

  const response = await fetch(`${API_BASE_URL}/admin/books/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  if (!response.ok) throw new Error("Failed to update book");

  return response.json();
};


// Delete book (admin)
export const deleteBook = async (id: string): Promise<void> => {
  const response = await authFetch(`/admin/books/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete book');
  }
};

// Get dashboard stats (admin)
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await authFetch('/admin/stats');

  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }

  return response.json();
};

// Public API functions (if needed for public pages)
export const getPublicBooks = async (): Promise<Book[]> => {
  const response = await fetch(`${API_BASE_URL}/books`);

  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }

  return response.json();
};

export const getPublicBookById = async (id: string): Promise<Book> => {
  const response = await fetch(`${API_BASE_URL}/books/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch book');
  }

  return response.json();
};

export const borrowBook = async (id: string) => {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(`${API_BASE_URL}/admin/books/${id}/borrow`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to borrow book");
  return response.json();
};

export const returnBook = async (id: string) => {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(`${API_BASE_URL}/admin/books/${id}/return`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to return book");
  return response.json();
};

// Create borrow record (with borrower details)
// Create borrow record
export const createBorrowRecord = async (
  bookId: string,
  payload: {
    borrowerName: string;
    phone: string;
    address?: string;
    borrowDate?: string;
    returnDate: string;
    notes?: string;
  }
) => {
  const token = localStorage.getItem("adminToken");

  const res = await fetch(`${API_BASE_URL}/admin/books/${bookId}/borrow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create borrow record");
  return res.json();
};

// Get ALL borrow records
export const getBorrowRecords = async () => {
  const token = localStorage.getItem("adminToken");

  const res = await fetch(`${API_BASE_URL}/admin/borrow-records`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch borrow records");
  return res.json();
};

// Get single borrow record
export const getBorrowRecord = async (id: string) => {
  const token = localStorage.getItem("adminToken");

  const res = await fetch(`${API_BASE_URL}/admin/borrow-records/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch borrow record");
  return res.json(); // contains { record, book }
};

// Mark borrow record as returned
export const returnBorrowRecord = async (id: string) => {
  const token = localStorage.getItem("adminToken");

  const res = await fetch(`${API_BASE_URL}/admin/borrow-records/${id}/return`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to mark as returned");
  return res.json();
};

// Delete borrow record
export const deleteBorrowRecord = async (id: string) => {
  const token = localStorage.getItem("adminToken");

  const res = await fetch(`${API_BASE_URL}/admin/borrow-records/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to delete borrow record");
  return res.json();
};
