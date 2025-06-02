'use client'

import { Suspense } from 'react'
import { useAnalytics } from '@/hooks/useAnalytics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'

function AnalyticsContent() {
  const { data, isLoading, error } = useAnalytics()

  if (isLoading) {
    return <AnalyticsSkeleton />
  }

  if (error) {
    return (
      <div className='p-4 text-red-500'>
        Error loading analytics: {error.message}
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{data.totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Readers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{data.activeReaders.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Avg. Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{data.avgEngagementRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Top Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{data.topArticles.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card className='col-span-4'>
        <CardHeader>
          <CardTitle>Monthly Views</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={data.monthlyViews}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis />
                <Tooltip />
                <Line
                  type='monotone'
                  dataKey='views'
                  stroke='#8884d8'
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {data.topArticles.map((article, index) => (
              <div
                key={index}
                className='flex items-center justify-between border-b pb-2 last:border-0'
              >
                <div className='font-medium'>{article.title}</div>
                <div className='text-sm text-muted-foreground'>
                  {article.views.toLocaleString()} views • {article.engagement} engagement
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <Skeleton className='h-4 w-[100px]' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-8 w-[60px]' />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className='col-span-4'>
        <CardHeader>
          <Skeleton className='h-6 w-[150px]' />
        </CardHeader>
        <CardContent>
          <Skeleton className='h-[300px] w-full' />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-[200px]' />
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='flex items-center justify-between'>
                <Skeleton className='h-4 w-[200px]' />
                <Skeleton className='h-4 w-[100px]' />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <div className='container mx-auto py-6'>
      <h1 className='mb-6 text-3xl font-bold'>Analytics Dashboard</h1>
      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsContent />
      </Suspense>
    </div>
  )
}