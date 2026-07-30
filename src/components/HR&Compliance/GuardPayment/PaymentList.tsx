import PaymentCard from "./PaymentCard";

const PaymentList = ({ guardPayments }: { guardPayments: any[] }) => {
  if (guardPayments.length == 0)
    return <div className="text-center">No guard payments found</div>;
  return (
    <div className="space-y-4">
      {guardPayments.map((p) => (
        <PaymentCard key={p.id} payment={p} />
      ))}
    </div>
  );
};

export default PaymentList;
