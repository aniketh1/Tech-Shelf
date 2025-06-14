'use client';

import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { FileText, MessageCircle, PlusCircle, Ratio } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import ToggleMode from '../ui/home/header/ToggleMode'
import RecentArticles from './RecentArticles'
import { useStats } from '@/hooks/useStats'

export default function BlogDashboard() {
  const stats = useStats();

  return (
    <main className='flex-1 p-4 md:p-8 pt-16 md:pt-8'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8'>
            <div className='w-full sm:flex-9'>
                <h1 className='font-bold text-2xl'>Blog Dashboard</h1>
                <p>Manage your content and Analytics</p>
            </div>
            <div className='flex items-center gap-4 w-full sm:w-auto'>
                <Link href={'/dashboard/articles/create'} className='flex-grow sm:flex-grow-0'>
                    <Button className='w-full sm:w-auto'>
                        <PlusCircle className='mr-2'/>
                        Create New Post
                    </Button>
                </Link>
                <div className='flex-shrink-0'>
                    <ToggleMode/> 
                </div>
            </div>
        </div>

        {/* Statistics */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='font-medium text-sm'>
                        Total Posts
                    </CardTitle>
                    <FileText/>
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>{stats.totalArticles}</div>
                    <p className='text-sm text-muted-foreground'>Published articles</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='font-medium text-sm'>
                        Comments
                    </CardTitle>
                    <MessageCircle/>
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>{stats.totalReaders}</div>
                    <p className='text-sm text-muted-foreground'>Total readers</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='font-medium text-sm'>
                        Total Views
                    </CardTitle>
                    <Ratio/>
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>{stats.totalViews}</div>
                    <p className='text-sm text-muted-foreground'>Article views</p>
                </CardContent>
            </Card>
        </div>

        <RecentArticles/>
    </main>
  )
}
