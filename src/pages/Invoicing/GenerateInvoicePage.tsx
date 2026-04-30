import { useGetAllClientsQuery } from '@/apis/usersApi'
import CustomHeader from '@/components/common/Header/CustomHeader'
import InvoiceForm from '@/components/Invoicing/Form/InvoiceForm'
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