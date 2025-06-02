'use client'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Github } from 'lucide-react'
import Link from 'next/link'

export default function AboutUsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">About Tech Shelf</h1>
        
        <div className="prose dark:prose-invert max-w-none mb-12">
          <p className="text-lg mb-6">
            Tech Shelf is a collaborative project developed by a team of passionate students from BMS College of Engineering, 
            Department of Information Science. Our platform aims to provide a comprehensive space for tech enthusiasts to share 
            their knowledge, experiences, and insights through well-crafted articles.
          </p>
          
          <p className="text-lg mb-6">
            Built with modern technologies like Next.js, TypeScript, and Tailwind CSS, Tech Shelf offers a seamless experience 
            for both writers and readers. Our platform features real-time analytics, interactive commenting, and a user-friendly 
            interface that makes content creation and consumption a pleasure.
          </p>
        </div>

        <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Aniket V Korwar</CardTitle>
              <CardDescription>Information Science, BMS College of Engineering</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Satvik K</CardTitle>
              <CardDescription>Information Science, BMS College of Engineering</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rohan R Navalyal</CardTitle>
              <CardDescription>Information Science, BMS College of Engineering</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg mb-8">
            Have questions or want to collaborate? Feel free to reach out to any of our team members.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/contact">
              <Button size="lg">Contact Us</Button>
            </Link>
            <Link href="https://github.com/aniketh1/Tech-Shelf" target="_blank">
              <Button variant="outline" size="lg">
                <Github className="h-5 w-5 mr-2" />
                View on GitHub
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
