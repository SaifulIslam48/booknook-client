# BookNook

**Live site:** add your deployed client URL here
**Server repository:** ['booknook-server'](https://github.com/SaifulIslam48/booknook-server)
**Live API:** https://booknook-server-lznd.onrender.com

BookNook is a small online library. **Add a book, borrow a book, return a book.**

## Features

- Home page with a Swiper slider, the 6 newest books loaded from MongoDB, and sections on how borrowing works and top categories
- Browse every book in an equal-size card grid, with search by title or author and a category filter
- Register and log in with email and password (with password rules) or with Google, using BetterAuth and the MongoDB adapter
- Private pages (Add Book, Book Details, My Books, My Borrows) that survive a page reload and send guests to Login, then back to the page they wanted
- Add books with a cover image uploaded to imgbb, then edit them or delete them from a confirmation modal
- Borrow a book for 7 days, track it in My Borrows, and return it. Copy counts update automatically, a book with no copies shows "Not Available", and the same book cannot be borrowed twice at once
- Light and dark theme, custom toast messages and modals (no browser alerts), loading spinners, a custom 404 page, and a page title on every route
- Responsive layout for mobile, tablet and desktop

## Tech stack

Next.js (App Router), TypeScript, Tailwind CSS, daisyUI, Swiper, BetterAuth (MongoDB adapter and JWT plugin), and an Express + MongoDB server.

## Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL of the BookNook server |
| `BETTER_AUTH_SECRET` | Long random string used by BetterAuth |
| `BETTER_AUTH_URL` | URL of this site (`http://localhost:3000` locally) |
| `MONGODB_URI`, `DB_NAME` | MongoDB Atlas connection for BetterAuth |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google login |
| `NEXT_PUBLIC_IMGBB_KEY` | imgbb API key for book cover uploads |

Never commit `.env.local`.
