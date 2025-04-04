import { Server as NetServer } from 'net'
import { Server as SocketIOServer } from 'socket.io'
import { NextApiResponse } from 'next'
import { prisma } from './prisma'

export type NextApiResponseServerIO = NextApiResponse & {
  socket: any & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

export const initSocketServer = (res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      transports: ['websocket', 'polling']
    })
    res.socket.server.io = io

    io.on('connection', socket => {
      console.log('Client connected')

      socket.on('viewArticle', async ({ articleId }) => {
        try {
          const analytics = await prisma.articleAnalytics.upsert({
            where: { articleId },
            update: { views: { increment: 1 } },
            create: {
              articleId,
              views: 1,
              uniqueVisitors: 1,
              engagementRate: 0
            }
          })

          // Broadcast updated analytics to all clients
          io.emit('analyticsUpdate', analytics)
        } catch (error) {
          console.error('Error updating analytics:', error)
        }
      })

      socket.on('articleCreated', async (article) => {
        try {
          io.emit('articleUpdate', article)
        } catch (error) {
          console.error('Error broadcasting article creation:', error)
        }
      })

      socket.on('articleDeleted', async (articleId) => {
        try {
          io.emit('articleUpdate', { id: articleId, deleted: true })
        } catch (error) {
          console.error('Error broadcasting article deletion:', error)
        }
      })

      socket.on('articleEdited', async (article) => {
        try {
          io.emit('articleUpdate', article)
        } catch (error) {
          console.error('Error broadcasting article edit:', error)
        }
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected')
      })
    })
  }
  return res.socket.server.io
}