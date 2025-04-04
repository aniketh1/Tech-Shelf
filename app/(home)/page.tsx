import Navbar from "@/components/ui/home/header/Navbar";
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Footer from "@/components/ui/Footer";

const HeroSection = dynamic(() => import("@/components/ui/home/HeroSection"), {
  loading: () => <div className="h-screen w-full bg-slate-300 animate-pulse"></div>
});

const TopArticles = dynamic(() => import("@/components/ui/home/TopArticles"), {
  loading: () => <div className="container mx-auto px-4 py-16 animate-pulse"></div>
});
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Shelf - Explore the Future of Technology",
  description: "Discover cutting-edge technology insights, expert articles, and the latest tech trends on Tech Shelf. Your premier destination for technology news and innovation.",
  openGraph: {
    title: "Tech Shelf - Explore the Future of Technology",
    description: "Discover cutting-edge technology insights, expert articles, and the latest tech trends on Tech Shelf.",
    type: "website",
    images: ["/images/tech-shelf-og.jpg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Shelf - Explore the Future of Technology",
    description: "Discover cutting-edge technology insights, expert articles, and the latest tech trends on Tech Shelf.",
    images: ["/images/tech-shelf-og.jpg"]
  }
};

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Articles</h2>
          <Link href="/articles">
            <Button variant="outline">View All Articles</Button>
          </Link>
        </div>
        <TopArticles />
      </section>
      <Footer/>
    </div>
  );
}
