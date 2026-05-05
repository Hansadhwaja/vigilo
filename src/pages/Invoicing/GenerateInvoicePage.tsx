import { useGenerateInvoiceMutation } from '@/apis/invoiceApis'
import { RootState } from '@/apis/store'
import { useGetAllClientsQuery } from '@/apis/usersApi'
import CustomHeader from '@/components/common/Header/CustomHeader'
import InvoiceForm from '@/components/Invoicing/Form/InvoiceForm'
import AlarmPricingModal from '@/components/Invoicing/New/Modal/AlarmPricingModal'
import EditServicePricingModal from '@/components/Invoicing/New/Modal/EditServicePricingModal'
import { calculateGrandTotal } from '@/lib/utils'
import { InvoiceFormValues } from '@/schemas'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'


const GenerateInvoicePage = () => {
  const [generateInvoice, { isLoading: isGeneratingInvoice }] = useGenerateInvoiceMutation();

  const { data, isLoading } = useGetAllClientsQuery();
  const clients = data?.data ?? [];
  const navigate = useNavigate();


  const serviceData = useSelector((state: RootState) => state.servicePricing.data);

  const handleSubmit = async (data: InvoiceFormValues) => {
    console.log("Invoice Data", data);

    const grandTotal = calculateGrandTotal({
      orders: data.orders,
      alarms: data.alarms,
      services: data.services,
      serviceData
    })

    try {
      await generateInvoice({
        ...data,
        orders: data.orders.map(o => ({
          ...o,
          dailyPrice: Number(serviceData[o.title].dailyPrice),
          hourlyPrice: Number(serviceData[o.title].hourlyPrice),
          renewalDate: serviceData[o.title].renewalDate
        })),
        subTotal: grandTotal,
        tax: 0,
        totalAmount: grandTotal
      }).unwrap();
      navigate("/invoicing")
      toast.success("Invoice Created Successfully");
    } catch (error) {
      toast.error("Error while Creating Invoice");
    }
  }

  return (
    <div className='flex flex-col h-full gap-4'>
      <CustomHeader
        title="Generate Client Invoice"
        description="Create new invoice with flexible service pricing"
        previousLink='/invoicing'
        others={
          <div className='flex gap-2 items-center justify-end'>
            <AlarmPricingModal />
            <EditServicePricingModal />
          </div>
        }
      />
      <InvoiceForm
        isLoading={isGeneratingInvoice}
        onSubmit={handleSubmit}
        clients={clients}
      />
    </div>
  )
}

export default GenerateInvoicePage