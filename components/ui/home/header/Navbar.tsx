'use client'
import Link from 'next/link'
import React from 'react'
import { MenuIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SearchInput from './Search-Input'
import ToggleMode from './ToggleMode'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
function Navbar() {

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };


  return (
    <div className='sticky shadow-md flex items-center justify-between top-0 z-50 backdrop-blur-sm bg-black/10 supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between'>
        {/* Left side */}
        <div className='flex items-center justify-between'>
          <Link href='/' className='flex items-center space-x-2'>
            <span className=' bg-gradient-to-r from-pink-500 via-violet-500 to-purple-500 bg-clip-text text-3xl font-extrabold text-transparent'>
              Tech
            </span>
            <span className='bg-gradient-to-r pt-1.5 from-purple-500 to-blue-500 bg-clip-text text-2xl font-bold text-transparent'>
              - Shelf
            </span>
          </Link>
        </div>

        {/* Desktop Navbar */}
        <div className='hidden md:flex p-2 rounded-md gap-2 justify-center items-center space-x-4'>
          <Link href={'/articles'} className='text-sm px-4 py-2 hover:bg-black hover:text-white font-medium text-foreground transition-colors '>
            Articles
          </Link>
          <Link
            href={'/aboutus'}
            className='text-sm px-4 py-2 hover:bg-black hover:text-white font-medium text-foreground transition-colors '
          >
            About us
          </Link>
          <Link
            href={'/dashboard'}
            className='text-sm px-4 py-2 hover:bg-black hover:text-white font-medium text-foreground transition-colors '
          >
            Dashboard
          </Link>
        </div>

        {/* Right side */}
        <div className='hidden lg:flex items-center space-x-4'>
          <SearchInput />

          <ToggleMode />
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <div className='flex items-center space-x-4'>
              <SignInButton>
                <Button variant='default'>
                  Login
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button variant='ghost'>
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>
        </div>

        {/* Navbar mobile */}
        
        <div className='md:hidden p-2 flex items-center'>
          <ToggleMode />
          {isMenuOpen && (
            <div className={`absolute top-14 left-0 w-full bg-background shadow-lg transition-transform duration-300 transform ${isMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'} origin-top`} style={{ transition: 'transform 0.3s ease, opacity 0.3s ease' }}>
              <Link href={'/articles'} className='block text-sm font-medium text-foreground p-2 transition-colors hover:bg-accent'>
                Articles
              </Link>
              <Link href={'/tutorials'} className='block text-sm font-medium text-foreground p-2 transition-colors hover:bg-accent'>
                Tutorials
              </Link>
              <Link href={'/dashboard'} className='block text-sm font-medium text-foreground p-2 transition-colors hover:bg-accent'>
                Dashboard
              </Link>
              <div className='p-2'>
                <SearchInput />
              </div>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <div className='p-2 flex flex-col gap-2'>
                  <SignInButton>
                    <Button variant='default' className='w-full'>
                      Login
                    </Button>
                  </SignInButton>
                  <SignUpButton>
                    <Button variant='ghost' className='w-full'>
                      Sign Up
                    </Button>
                  </SignUpButton>
                </div>
              </SignedOut>
              
          </div>
          )}
          <button onClick={toggleMenu} className="text-sm font-medium text-foreground p-2 rounded-md hover:bg-accent">
            {isMenuOpen ? (
              <X className="transform rotate-90 scale-100 transition-transform duration-300 ease-in-out" />
            ) : (
              <MenuIcon className="transform rotate-0 scale-100 transition-transform duration-300 ease-in-out" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar
