"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const SLIDES = [
  {
    title: "Borrow, read,\nreturn. Repeat.",
    text: "Seven days for every book. Return it with one click when you are done.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Add a book,\nshare a story.",
    text: "Add new books to the shelf and help fellow readers discover their next read.",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Simple lending,\nanytime you read.",
    text: "Track your active borrows in one place and return titles effortlessly.",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80",
  },
];

export default function Hero() {
  return (
    <section className="bg-zinc-950 text-white">
      <Swiper
        className="hero-swiper"
        modules={[Autoplay, Navigation, Pagination]}
        loop
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
      >
        {SLIDES.map((s) => (
          <SwiperSlide key={s.title}>
            <div
              className="relative h-[430px] md:h-[470px] bg-cover bg-center"
              style={{ backgroundImage: `url(${s.image})` }}
            >
              <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/60 to-black/30" />
              <div className="relative h-full mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
                <div className="max-w-xl">
                  <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-zinc-300 uppercase">BookNook</p>
                  <h1 className="heading text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.08] whitespace-pre-line">
                    {s.title}
                  </h1>
                  <p className="mt-4 max-w-md text-sm md:text-base leading-relaxed text-zinc-200">{s.text}</p>
                  <Link href="/books" className="btn btn-primary mt-6 border border-white/40">
                    Browse Books
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
