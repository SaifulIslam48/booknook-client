import type { Category } from "@/types";

export const CATEGORIES: Category[] = ["Fiction", "Science", "History", "Kids", "Others"];

export const CATEGORY_COLORS: Record<Category, string> = {
  Fiction: "#1B4332",
  Science: "#2563EB",
  History: "#B45309",
  Kids: "#D97706",
  Others: "#7C3AED",
};

export const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
