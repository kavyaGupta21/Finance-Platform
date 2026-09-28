"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

const HeroSection = () => {
  const imageRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleScroll = () => {
      const element = imageRef.current;
      if (!element) return;
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;
      if (scrollPosition > scrollThreshold) {
        element.classList.add("scrolled");
      } else {
        element.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="hero-section relative z-10 pb-20 px-4 text-white">
      <div className="container relative z-10 mx-auto text-center">
        <h1 className="text-6xl md:text-8xl lg:text-[105px] pb-6 gradient-title">
          Welcome To AI Finance Platform{" "}
        </h1>
        <p className="text-xl text-purple-400 mb-8 max-w-2xl mx-auto ">
          An AI-powered financial platform for smarter work that helps you
          track, analyze, and optimize your spending with real-time insights.
        </p>
        <div className="flex justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="px-8 mt-4">
              Get Started
            </Button>
          </Link>
        </div>
        <div className="hero-sec-wrapper ">
          {/* <div ref={imageRef} className="hero-image">
            <Image
              src="/image1.png"
              width={1800}
              height={50}
              alt="Finance Handling"
              className="  mx-auto rounded-lg shadow-2xl border"
              priority
            ></Image>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
