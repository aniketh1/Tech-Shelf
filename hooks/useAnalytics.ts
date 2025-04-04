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
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalViews: 0,
    avgEngagementRate: 0,
    activeReaders: 0,
    topArticles: [],
    monthlyViews: []
  })

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000', {
      path: '/api/socket',
      transports: ['websocket', 'polling']
    })
    setSocket(socketInstance)

    socketInstance.on('analyticsUpdate', (data: ArticleAnalytics) => {
      setAnalyticsData(prev => ({
        ...prev,
        totalViews: prev.totalViews + 1,
        avgEngagementRate: data.engagementRate,
        activeReaders: data.uniqueVisitors
      }))
    })

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
    analyticsData,
    trackArticleView
  }
}