import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

type ArticleAnalytics = {
  id: string
  articleId: string
  views: number
  uniqueVisitors: number
  engagementRate: number
  createdAt: Date
  updatedAt: Date
}

type AnalyticsData = {
  totalViews: number
  avgEngagementRate: number
  activeReaders: number
  topArticles: Array<{
    title: string
    views: number
    engagement: string
  }>
  monthlyViews: Array<{
    month: string
    views: number
  }>
}

export const useAnalytics = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000', {
      path: '/api/socket',
      transports: ['websocket', 'polling']
    })
    setSocket(socketInstance)

    socketInstance.on('analyticsUpdate', (data: ArticleAnalytics) => {
      setData(prev => {
        if (!prev) return null
        
        const newTotalViews = prev.totalViews + 1
        
        const newAvgEngagementRate = ((prev.avgEngagementRate * prev.topArticles.length) + data.engagementRate) / 
          (prev.topArticles.length + 1)

        const updatedTopArticles = [...prev.topArticles]
        const articleIndex = updatedTopArticles.findIndex(a => a.title === data.articleId)
        
        if (articleIndex !== -1) {
          updatedTopArticles[articleIndex] = {
            ...updatedTopArticles[articleIndex],
            views: data.views,
            engagement: `${data.engagementRate.toFixed(1)}%`
          }
        }

        updatedTopArticles.sort((a, b) => b.views - a.views)

        const currentMonth = new Date().toLocaleString('default', { month: 'short' })
        const updatedMonthlyViews = [...prev.monthlyViews]
        const monthIndex = updatedMonthlyViews.findIndex(m => m.month === currentMonth)
        
        if (monthIndex !== -1) {
          updatedMonthlyViews[monthIndex].views += 1
        } else {
          updatedMonthlyViews.push({ month: currentMonth, views: 1 })
        }

        return {
          ...prev,
          totalViews: newTotalViews,
          avgEngagementRate: newAvgEngagementRate,
          activeReaders: data.uniqueVisitors,
          topArticles: updatedTopArticles.slice(0, 5),
          monthlyViews: updatedMonthlyViews
        }
      })
    })

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/analytics')
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data')
        }
        const analyticsData = await response.json()
        setData(analyticsData)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  const trackArticleView = (articleId: string) => {
    if (socket) {
      socket.emit('viewArticle', { articleId })
    }
  }

  return {
    data,
    isLoading,
    error,
    trackArticleView
  }
}