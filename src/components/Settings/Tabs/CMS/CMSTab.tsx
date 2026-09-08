import PrivacyPolicyEditor from "./PrivacyPolicy";
import TermsAndConditionsEditor from "./TermsAndConditions";

const CMSTab = () => {
  return (
    <div className="space-y-6">
      <PrivacyPolicyEditor />
      <TermsAndConditionsEditor />
    </div>
  );
};

export default CMSTab;
