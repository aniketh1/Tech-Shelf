import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

type Article = {
  id: string
  title: string
  content: string
  createdAt: Date
  comments?: Array<any>
}

export const useArticleSocket = (initialArticles: Article[] = []) => {
  const [articles, setArticles] = useState<Article[]>(initialArticles)

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000', {
      path: '/api/socket',
      transports: ['websocket', 'polling']
    })

    socketInstance.on('articleUpdate', (data) => {
      if (data.deleted) {
        setArticles(prevArticles => prevArticles.filter(article => article.id !== data.id))
      } else {
        setArticles(prevArticles => {
          const index = prevArticles.findIndex(article => article.id === data.id)
          if (index !== -1) {
            const updatedArticles = [...prevArticles]
            updatedArticles[index] = data
            return updatedArticles
          } else {
            return [data, ...prevArticles]
          }
        })
      }
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return { articles, setArticles }
}