import Loader from '@/components/common/Loader'
import React from 'react'

const MessageLoading = () => {
    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
                <Loader />
                <p className="text-sm text-gray-400">Loading messages…</p>
            </div>
        </div>
    )
}

export default MessageLoading