import React from 'react'
import PaymentCard from './PaymentCard'
import { payments } from '@/constants';

const PaymentList = ({ guardPayments }: { guardPayments: any[] }) => {
    return (
        <div className='space-y-4'>
            {guardPayments.map(p => (
                <PaymentCard
                    key={p.id}
                    payment={p}
                />
            ))}
        </div>
    )
}

export default PaymentList