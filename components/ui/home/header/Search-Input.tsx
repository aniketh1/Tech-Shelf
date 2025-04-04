'use client'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

function SearchInput() {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Redirect to search results page with the query
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className='relative'>
                <Input 
                    type='text' 
                    className='pl-10 bg-white/10 backdrop-blur-sm border-none' 
                    placeholder='Search...' 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    required
                />
                <Button type='submit' className='absolute right-0 top-0 rounded-l-none'>
                    <SearchIcon className='w-4 h-4' />
                </Button>
            </div>
        </form>
    )
}

export default SearchInput;
