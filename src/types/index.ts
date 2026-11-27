export type Category = "Fiction" | "Science" | "History" | "Kids" | "Others";

export interface Book {
  _id: string;
  title: string;
  author: string;
  category: Category;
  description: string;
  image: string;
  totalCopies: number;
  copies: number;
  addedByName: string;
  addedByEmail: string;
  createdAt: string;
}

export interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  userName: string;
  borrowDate: string;
  returnDate: string;
}
