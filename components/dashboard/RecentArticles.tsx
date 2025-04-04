'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Ghost } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Link from 'next/link'
import { DeleteButton } from './DeleteButton'
import { Socket } from 'socket.io-client'
import { useArticleSocket } from '@/hooks/useArticleSocket'

interface User {
  id: string;
  name: string;
  imageUrl: string;
}

const RecentArticles = () => {
  const [user, setUser] = useState<User | null>(null)
  const { articles, setArticles } = useArticleSocket()

  useEffect(() => {
    // Fetch initial data
    fetch('/api/user/articles')
      .then(res => res.json())
      .then(data => {
        setArticles(data.articles)
        setUser(data.user)
      })
  }, [setArticles])

  if (!user) return null

  return (
    <Card className='mb-8'>
        <CardHeader>
            <div className='flex items-center justify-between'>
                <CardTitle>Recent Articles</CardTitle>
                <Link href="/dashboard/articles">
                    <Button className='text-muted-foreground text-sm cursor-pointer' variant="ghost">View All →</Button>
                </Link>
            </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead className="hidden md:table-cell">Status</TableHead>
                        <TableHead className="hidden md:table-cell">Comments</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className='hidden md:table-cell'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {articles.map((article) => (
                        <TableRow key={article.id}>
                            <TableCell>
                                <div className='flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-2'>
                                    <div className='flex items-center gap-2 w-full md:w-auto'>
                                        <div className='w-fit h-fit rounded-full bg-gray-400'>
                                            <Avatar>
                                                <AvatarImage src={user.imageUrl} />
                                                <AvatarFallback>
                                                    <Ghost />
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className='flex-1'>
                                            <p className='text-sm font-semibold'>{article.title}</p>
                                            <p className='text-xs text-muted-foreground'>by {user.name}</p>
                                            <div className='flex items-center gap-2 mt-2 md:hidden'>
                                                <Link href={`/dashboard/articles/edit/${article.id}`}>
                                                    <Button variant={'outline'} size={'sm'}>
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <DeleteButton articleId={article.id} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                <Badge variant={'outline'} className='bg-green-400 text-green-800 font-semibold'>Published</Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {article.comments?.length || 0}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {new Date(article.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                <div className='flex gap-2'>
                                    <Link href={`/dashboard/articles/edit/${article.id}`}>
                                        <Button variant={'outline'} size={'sm'}>
                                            Edit
                                        </Button>
                                    </Link>
                                    <DeleteButton articleId={article.id} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  )
}

export default RecentArticles