import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import InvoicingTable from '../Table/InvoicingTable'
import { InvoiceType } from '@/types'

interface InvoicingTabsProps {
    invoices: InvoiceType[];
}

const InvoicingTabs = ({ invoices }: InvoicingTabsProps) => {

    return (
        <Tabs defaultValue="all">
            <TabsList className='w-[60vw]'>
                <TabsTrigger value='all'>All</TabsTrigger>
                <TabsTrigger value='paid'>Paid</TabsTrigger>
                <TabsTrigger value='overdue'>Overdue</TabsTrigger>
            </TabsList>

            <TabsContent value='all'>
                <InvoicingTable invoices={invoices} />
            </TabsContent>

            <TabsContent value='paid'>
                <InvoicingTable invoices={invoices} />
            </TabsContent>

            <TabsContent value='overdue'>
                <InvoicingTable invoices={invoices} />
            </TabsContent>
        </Tabs>
    )
}

export default InvoicingTabs