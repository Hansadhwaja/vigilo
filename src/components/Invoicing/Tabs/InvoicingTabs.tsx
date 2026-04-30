import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import React from 'react'
import InvoicingTable from '../Table/InvoicingTable'
import { dummyInvoices } from '@/constants'

const InvoicingTabs = () => {

    const paidInvoices = dummyInvoices.filter(inv => inv.status.toLowerCase() === "paid")
    const overdueInvoices = dummyInvoices.filter(inv => inv.status.toLowerCase() === "overdue")

    return (
        <Tabs defaultValue="all">
            <TabsList className='w-[60vw]'>
                <TabsTrigger value='all'>All</TabsTrigger>
                <TabsTrigger value='paid'>Paid</TabsTrigger>
                <TabsTrigger value='overdue'>Overdue</TabsTrigger>
            </TabsList>

            <TabsContent value='all'>
                <InvoicingTable invoices={dummyInvoices} />
            </TabsContent>

            <TabsContent value='paid'>
                <InvoicingTable invoices={paidInvoices} />
            </TabsContent>

            <TabsContent value='overdue'>
                <InvoicingTable invoices={overdueInvoices} />
            </TabsContent>
        </Tabs>
    )
}

export default InvoicingTabs