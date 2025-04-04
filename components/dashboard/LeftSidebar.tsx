'use client'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { BarChart, FileText, LayoutDashboard, MessageCircle, Settings } from "lucide-react"
import { useEffect, useState } from "react"

// Separate the Dashboard sidebar content to a client component
const DashboardSidebar = () => {
    return(
        <div className="h-full px-4 py-6">
            <div className="flex items-center gap-2 mb-8 px-2">
                <Link href={'/'}>
                    <span className="bg-gradient-to-r from-pink-500 via-violet-500 to-purple-500 bg-clip-text text-3xl font-extrabold text-transparent">Tech</span>
                    <span className="bg-gradient-to-r pt-1.5 from-purple-500 to-blue-500 bg-clip-text text-2xl font-bold text-transparent">- Shelf</span>
                </Link>
            </div>
            <nav className="flex flex-col gap-3">
                <Link href="/dashboard">
                    <Button className="w-full justify-start">
                        <LayoutDashboard className="h-5 w-5 mr-2"/>
                        Overview
                    </Button>
                </Link>
                <Link href="/dashboard/articles/create">
                    <Button className="w-full justify-start">
                        <FileText className="h-5 w-5 mr-2"/>
                        Articles
                    </Button>
                </Link>
                <Link href="/dashboard/comments">
                    <Button className="w-full justify-start">
                        <MessageCircle className="h-5 w-5 mr-2"/>
                        Comments
                    </Button>
                </Link>
                <Link href="/dashboard/analytics">
                    <Button className="w-full justify-start">
                        <BarChart className="h-5 w-5 mr-2"/>
                        Analytics
                    </Button>
                </Link>
                <Link href="/dashboard/settings">
                    <Button className="w-full justify-start">
                        <Settings className="h-5 w-5 mr-2"/>
                        Settings
                    </Button>
                </Link>
            </nav>
        </div>
    )
}

// Mobile sidebar button - initially render nothing, then a button after hydration
const MobileButton = ({ onClick }) => {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);
    
    if (!mounted) return null;
    
    return (
        <Button className="md:hidden m-4" variant="outline" size="icon" onClick={onClick}>
            <LayoutDashboard className="h-5 w-5"/>
        </Button>
    );
};

export function LeftSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    
    // Completely separate mobile and desktop layouts
    return (
        <div className="fixed top-0 left-0 h-screen z-50">
            {/* Mobile sidebar trigger - show only after hydration */}
            <div className="block md:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <MobileButton onClick={() => setIsOpen(true)} />
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[250px] p-0">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Dashboard Navigation</SheetTitle>
                        </SheetHeader>
                        <DashboardSidebar />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop sidebar - always visible */}
            <div className="hidden md:block h-screen w-[250px] border-r bg-background shadow-lg">
                <DashboardSidebar />
            </div>
        </div>
    );
}

export default LeftSidebar;