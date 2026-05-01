import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

interface CustomHeaderProps {
    title: string;
    description: string;
    previousLink?: string;
    others?: React.ReactNode;
}

const CustomHeader = ({ title, description, previousLink, others }: CustomHeaderProps) => {
    return (
        <div>
            {previousLink && (
                <Button variant="ghost" asChild>
                    <Link to={previousLink}>
                        <ArrowLeft />
                        Back
                    </Link>
                </Button>
            )}
            <div className='flex justify-between sm:items-center max-sm:flex-col gap-2'>
                <div className='flex gap-2 sm:items-center max-sm:flex-col'>
                    <div>
                        <h2 className='heading'>{title}</h2>
                        <p className='description text-gray-600'>{description}</p>
                    </div>
                </div>
                {others}
            </div>
        </div>
    )
}

export default CustomHeader