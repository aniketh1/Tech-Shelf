'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function AboutPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto py-12 px-6 space-y-10 backdrop-blur-sm bg-white/10 supports-[backdrop-filter]:bg-background/60 rounded-lg shadow-xl">
      {/* Theme Toggle */}
      {mounted && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <SunIcon className="h-5 w-5 text-yellow-500" />
            ) : (
              <MoonIcon className="h-5 w-5 text-blue-600" />
            )}
          </button>
        </div>
      )}

      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">About Tech-Shelf</h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          Your one-stop destination for the latest in tech trends, gadgets, and insightful blogs.
        </p>
      </div>
      
      {/* Mission Section */}
      <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300">
            At <strong>Tech-Shelf</strong>, I aim to bring you curated insights, expert reviews, and 
            the latest innovations from the tech world. Whether you're a developer, enthusiast, or 
            just someone who loves technology, my platform is built to keep you informed and inspired.
          </p>
        </CardContent>
      </Card>
      
      {/* About Me Section */}
      <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">Who Am I?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300">
            Hey! I'm <strong>Aniket Korwar</strong>, a passionate tech enthusiast, web developer, and creative thinker. 
            Currently pursuing Computer Science Engineering at BMS College of Engineering, I have a deep interest in 
            building scalable web applications, exploring new technologies, and sharing knowledge through Tech-Shelf.
          </p>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            With expertise in **React.js, Node.js, Java, C++, and Python**, I enjoy crafting innovative solutions 
            and working on projects that blend technology with creativity. I have also interned at **Athreya Technologies**, 
            where I worked on a web-based IP spoofing project.
          </p>
        </CardContent>
      </Card>
      
      {/* Call to Action */}
      <div className="text-center mt-10">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">Want to collaborate with me?</h2>
        <p className="text-gray-700 dark:text-gray-300">Let's build something amazing together. Feel free to reach out!</p>
        <Button 
          className="mt-4 bg-gradient-to-r from-pink-500 via-violet-500 to-purple-500 hover:opacity-90 text-white"
          onClick={() => window.location.href = 'mailto:aniketkorwa@gmail.com'}
        >
          Contact Me
        </Button>
        {/* Consider adding a link to the contact page if you have one */}
        {/* <Link href="/contact" className="inline-block ml-4">
          <Button variant="outline" className="bg-transparent border-blue-600 text-blue-600 hover:bg-blue-100 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-800">
            Our Contact Page
          </Button>
        </Link> */}
      </div>
    </div>
  );
}
