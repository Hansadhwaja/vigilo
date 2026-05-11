import React from 'react'
import PaymentCard from './PaymentCard'
import { payments } from '@/constants';

const PaymentList = () => {
    const payment = {
        src: "",
        name: "user",
        post: "Senior Security Guard",
        id: "PAY-2026-001",
        period: "Apr 1 – 15, 2026",
        hours: 80,
        ot: 4,
        hourlyPrice: 45,
        otPrice: 67,
        status: "approved"
    };
    return (
        <div className='space-y-4'>
            {payments.map(p => (
                <PaymentCard
                    key={p.id}
                    payment={p}
                />
            ))}
        </div>
    )
}

export default PaymentList