import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CMSForm, { CMSFormValue } from "./Form/CMSForm";

interface Props {
  value: CMSFormValue;
  onChange: (v: CMSFormValue) => void;
  isLoading: boolean;
  label:string
}

const CMSCard = ({ value, onChange, isLoading,label }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <CMSForm
          initialData={value}
          isLoading={isLoading}
          onSubmit={onChange}
        />
      </CardContent>
    </Card>
  );
};

export default CMSCard;
