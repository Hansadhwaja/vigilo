import { MessageCircle } from 'lucide-react'
import React from 'react'

const EmptyMessage = ({ name }: { name: string }) => {
    return (
        <div className="flex items-center justify-center flex-1">
            <div className="flex flex-col items-center gap-2 text-center">
                <div className="h-14 w-14 rounded-2xl bg-white shadow-md flex items-center justify-center">
                    <MessageCircle className="h-7 w-7 text-emerald-400" />
                </div>
                <p className="text-sm font-medium text-gray-600 mt-2">No messages yet</p>
                <p className="text-xs text-gray-400">Say hello to {name} 👋</p>
            </div>
        </div>
    )
}

export default EmptyMessage