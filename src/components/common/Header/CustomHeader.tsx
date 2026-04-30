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
        <div className='flex justify-between items-center'>
            <div className='flex gap-2 items-center'>
                {previousLink && (
                    <Button variant="ghost" asChild>
                        <Link to={previousLink}>
                            <ArrowLeft />
                            Back
                        </Link>
                    </Button>
                )}
                <div>
                    <h2 className='heading'>{title}</h2>
                    <p className='description text-gray-600'>{description}</p>
                </div>
            </div>
            {others}
        </div>
    )
}

export default CustomHeader