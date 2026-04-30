import { useGetAllClientsQuery } from '@/apis/usersApi'
import CustomHeader from '@/components/common/Header/CustomHeader'
import InvoiceForm from '@/components/Invoicing/Form/InvoiceForm'
import AlarmPricingModal from '@/components/Invoicing/New/Modal/AlarmPricingModal'
import EditServicePricingModal from '@/components/Invoicing/New/Modal/EditServicePricingModal'
import ServicePricingSection from '@/components/Invoicing/New/ServicePricingSection'
import { InvoiceFormValues } from '@/schemas'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'


const GenerateInvoicePage = () => {
  const { data, isLoading } = useGetAllClientsQuery();
  const clients = data?.data ?? [];
  const navigate = useNavigate();

  const handleSubmit = (data: InvoiceFormValues) => {
    console.log("Invoice Data", data);
    try {
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
          <div className='flex gap-2 items-center'>
            <AlarmPricingModal />
            <EditServicePricingModal />
          </div>
        }
      />
      <InvoiceForm
        isLoading={false}
        onSubmit={handleSubmit}
        clients={clients}
      />
    </div>
  )
}

export default GenerateInvoicePage