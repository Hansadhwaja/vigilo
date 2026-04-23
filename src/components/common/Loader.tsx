import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const Loader = ({ className = "" }: { className?: string }) => {
    return (
        <div className='flex justify-center items-center w-full'>
            <div className={cn('size-4 ',
                className
            )}>
                <Loader2 size={12} className='animate-spin' />
            </div>
        </div>
    )
}

export default Loader