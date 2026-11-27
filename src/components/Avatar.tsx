"use client";
import { useState } from "react";

export default function Avatar({
  name,
  image,
  className = "",
}: {
  name: string;
  image?: string | null;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (image && !failed) {
    return (
      <img
        src={image}
        alt={name}
        onError={() => setFailed(true)}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }
  return (
    <span
      aria-label={name}
      className={`rounded-full bg-primary text-primary-content font-bold inline-flex items-center justify-center ${className}`}
    >
      {(name || "?").trim().charAt(0).toUpperCase()}
    </span>
  );
}
