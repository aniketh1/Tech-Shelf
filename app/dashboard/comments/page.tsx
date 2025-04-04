import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, TrendingUp, Users, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

async function CommentsAnalytics() {
  const user = await currentUser();
  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
    include: {
      articles: {
        include: {
          comments: true
        }
      }
    }
  });

  if (!dbUser) return null;

  // Calculate total comments across all articles
  const totalComments = dbUser.articles.reduce((sum, article) => sum + (article.comments?.length || 0), 0);
  
  // Calculate average comments per article
  const avgCommentsPerArticle = dbUser.articles.length > 0 
    ? (totalComments / dbUser.articles.length).toFixed(1)
    : 0;

  // Get recent comments
  const recentComments = dbUser.articles
    .flatMap(article => article.comments || [])
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <main className='flex-1 p-4 md:p-8 pt-16 md:pt-8'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8'>
        <div className='w-full sm:flex-9'>
          <h1 className='font-bold text-2xl'>Comments Analytics</h1>
          <p>Track and manage your article engagement</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='font-medium text-sm'>Total Comments</CardTitle>
            <MessageCircle className='h-4 w-4 text-muted-foreground'/>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalComments}</div>
            <p className='text-sm text-muted-foreground'>Across all articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='font-medium text-sm'>Avg. Comments</CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground'/>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{avgCommentsPerArticle}</div>
            <p className='text-sm text-muted-foreground'>Per article</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='font-medium text-sm'>Active Users</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground'/>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{recentComments.length}</div>
            <p className='text-sm text-muted-foreground'>Recent commenters</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='font-medium text-sm'>Response Time</CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground'/>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>2.5h</div>
            <p className='text-sm text-muted-foreground'>Average response</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Comments Table */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Recent Comments</CardTitle>
            <Button variant='outline' size='sm'>View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Commenter</TableHead>
                <TableHead>Article</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentComments.map((comment, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Avatar className='h-8 w-8'>
                        <AvatarImage src={comment.user?.imageUrl} />
                        <AvatarFallback>UC</AvatarFallback>
                      </Avatar>
                      <span>{comment.user?.name || 'Anonymous'}</span>
                    </div>
                  </TableCell>
                  <TableCell className='max-w-[200px] truncate'>
                    {comment.article?.title}
                  </TableCell>
                  <TableCell className='max-w-[300px] truncate'>
                    {comment.content}
                  </TableCell>
                  <TableCell>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant='outline' className='bg-green-400/10 text-green-500'>
                      Approved
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

export default CommentsAnalytics;