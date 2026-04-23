
import { useSocket } from '@/lib/hooks/useSocket';
import BroadCastMessageForm from './Form/BroadCastMessageForm'
import { BroadCastFormValues } from '@/schemas'
import { toast } from 'sonner'

const BroadcastTab = () => {
  const socketRef = useSocket();

  const handleSubmit = async (data: BroadCastFormValues) => {
    console.log("Broadcast data", data);
    try {
      socketRef.current?.emit("broadcastMessage", {
        message: data.message,
      });
      toast.success("Broadcast message sent")
    } catch (error) {
      toast.success("Error while sending Broadcast message")
    }
  }

  return (
    <div>
      <div>
        <h2 className='text-lg font-semibold'>Broadcast Message</h2>
        <p>Send announcements to multiple guards</p>
      </div>
      <BroadCastMessageForm onSubmit={handleSubmit} />
    </div>
  )
}

export default BroadcastTab