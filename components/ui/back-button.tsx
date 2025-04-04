'use client'

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export function BackButton() {
    const router = useRouter()

    return (
        <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 md:left-[270px] z-40"
            onClick={() => router.back()}
        >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Go back</span>
        </Button>
    )
}