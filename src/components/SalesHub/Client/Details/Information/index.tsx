import AccountInformationCard from "./AccountInformationCard";
import { Client } from "@/store/apis/usersApi";
import ContactInformationCard from "./ContactInformationCard";

interface Props {
  client: Client;
}

const InformationSection = ({ client }: Props) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <ContactInformationCard client={client} />
      <AccountInformationCard client={client} />
    </div>
  );
};

export default InformationSection;
