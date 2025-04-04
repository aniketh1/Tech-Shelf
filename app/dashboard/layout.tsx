import LeftSidebar from '@/components/dashboard/LeftSidebar'
import React from 'react'
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation'

async function layout({children}:{children:React.ReactNode}) {
const user = await currentUser();
const userId = user?.id;
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className='min-h-screen w-full'>
        <div className='flex'>
            <LeftSidebar/>
            <div className='flex-1 md:ml-[250px]'>
                {children}
            </div>
        </div>
    </div>
  )
}

export default layout
