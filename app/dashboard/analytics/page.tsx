'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart as BarChartIcon, TrendingUp, Users, Eye } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAnalytics } from '@/hooks/useAnalytics'

export default function AnalyticsPage() {
  const { analyticsData } = useAnalytics()
  return (
    <main className='flex-1 p-4 md:p-8 pt-16 md:pt-8'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8'>
        <div className='w-full sm:flex-9'>
          <h1 className='font-bold text-2xl'>Analytics</h1>
          <p>Track your content performance and engagement</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='font-medium text-sm'>
              Total Views
            </CardTitle>
            <Eye className='h-4 w-4 text-muted-foreground'/>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{analyticsData.totalViews}</div>
            <p className='text-sm text-muted-foreground'>Real-time views</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='font-medium text-sm'>
              Engagement Rate
            </CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground'/>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{analyticsData.avgEngagementRate}%</div>
            <p className='text-sm text-muted-foreground'>Current engagement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='font-medium text-sm'>
              Active Readers
            </CardTitle>
            <Users className='h-4 w-4 text-muted-foreground'/>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{analyticsData.activeReaders}</div>
            <p className='text-sm text-muted-foreground'>Active readers</p>
          </CardContent>
        </Card>
      </div>

      {/* Views Chart */}
      <Card className='mb-8'>
        <CardHeader>
          <CardTitle>Views Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={analyticsData.monthlyViews}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='views' fill='#8884d8' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {analyticsData.topArticles.map((article, index) => (
              <div key={index} className='flex items-center justify-between p-4 border rounded-lg'>
                <div>
                  <p className='font-medium'>{article.title}</p>
                  <p className='text-sm text-muted-foreground'>{article.views} views</p>
                </div>
                <div className='text-sm font-medium'>
                  {article.engagement}
                  <span className='text-muted-foreground'> engagement</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}