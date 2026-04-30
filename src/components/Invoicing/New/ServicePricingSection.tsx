import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import AlarmPricingModal from './Modal/AlarmPricingModal'
import EditServicePricingModal from './Modal/EditServicePricingModal'

const ServicePricingSection = () => {
    return (
        <Card className='p-0'>
            <CardContent className='p-4 space-y-4 bg-gray-100'>
                <div className='flex justify-between'>
                    <div>
                        <CardHeader className='sub-heading px-0'>Service Pricing Configuration</CardHeader>
                        <CardDescription className='description'>Manage pricing configurations for services and alarms</CardDescription>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <AlarmPricingModal />
                        <EditServicePricingModal />
                    </div>
                </div>
                <Separator />
                <CardFooter className='flex gap-2 items-center'>
                    <p className='font-semibold'>2 services configured · </p>
                    <p>Last updated 1/15/2026 · </p>
                    <p>Renewal due 12/31/2026</p>
                </CardFooter>
            </CardContent>
        </Card>
    )
}

export default ServicePricingSection