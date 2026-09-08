import Loader from "@/components/common/Loader";
import {
  useEditCmsPageMutation,
  useGetCmsPageQuery,
} from "@/store/apis/cmsApi";
import CMSCard from "../CMSCard";
import { CMSFormValue } from "../Form/CMSForm";
import { toast } from "sonner";

const PrivacyPolicyEditor = () => {
  const { data, isLoading } = useGetCmsPageQuery("privacy_policy");
  const content = data?.data ?? "";
  const [editCmsPage, { isLoading: isEditing }] = useEditCmsPageMutation();

  const handleSubmit = async (data: CMSFormValue) => {
    try {
      await editCmsPage({
        name: "privacy_policy",
        content: data.content,
      }).unwrap();
      toast.success("Content Edited Successfully");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error?.message : "Error while editing content";

      toast.error(message);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <CMSCard
      isLoading={isEditing}
      onChange={handleSubmit}
      value={content}
      label="Privacy Policy"
    />
  );
};

export default PrivacyPolicyEditor;
