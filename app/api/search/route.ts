import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 10
    const offset = (page - 1) * limit

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    // Search articles based on title, content, or category with pagination
    const where = {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } }
      ]
    }

    const [articles, totalCount] = await Promise.all([
      prisma.articles.findMany({
        where,
        include: {
          author: {
            select: {
              name: true,
              imageUrl: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        skip: offset
      }),
      prisma.articles.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      articles,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount
      }
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Failed to perform search' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
