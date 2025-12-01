# TODO: Connect navajuvala-backend to navajuvala-library-hub-main frontend

## Steps to Complete

- [x] Create API utility file (navajuvala-library-hub-main/src/lib/api.ts) to handle API calls to the backend
- [x] Update AdminLogin.tsx to use API for login instead of localStorage
- [x] Update ManageBooks.tsx to fetch books from backend API
- [x] Update BookForm.tsx for create/update books via API
- [x] Start backend server (node server.js in navajuvala-backend)
- [x] Start frontend (npm run dev in navajuvala-library-hub-main)
- [x] Test login and book management functionality

## Notes
- Backend runs on port 5000 by default
- Frontend needs to proxy API calls to http://localhost:5000
- Ensure CORS is enabled in backend (already is)
- JWT token handling for authenticated requests
- Admin credentials: admin@example.com / admin123
