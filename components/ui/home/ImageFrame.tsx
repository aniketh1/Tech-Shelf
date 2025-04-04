
import React from 'react'
import {cn} from '@/lib/utils'
import Image from 'next/image'


function ImageFrame() {
  return (
    <div>
       <div className="w-64 mx-auto">
          <div
            className={cn(
              'relative rounded-2xl h-40 overflow-hidden',
              'bg-gradient-to-br from-white/5 to-transparent',
              'border border-primary/20 backdrop-blur-lg',
              'shadow-2xl shadow-blue-600/10'
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 z-10"></div>
            <Image
              src="/images/pexels-pixabay-261662.jpg"
              alt="Hero image showing a workspace"
              fill
              className="object-cover z-0"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        </div>
    </div>
  )
}

export default ImageFrame
