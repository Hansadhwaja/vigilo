import Loader from "@/components/common/Loader";
import {
  useEditCmsPageMutation,
  useGetCmsPageQuery,
} from "@/store/apis/cmsApi";
import CMSCard from "../CMSCard";
import { CMSFormValue } from "../Form/CMSForm";
import { toast } from "sonner";

interface Props {
  type: string;
}

const PrivacyPolicyEditor = ({ type }: Props) => {
  const { data, isLoading } = useGetCmsPageQuery({
    name: "privacy_policy",
    type,
  });
  const content = data?.data ?? "";
  const [editCmsPage, { isLoading: isEditing }] = useEditCmsPageMutation();

  const handleSubmit = async (data: CMSFormValue) => {
    try {
      await editCmsPage({
        name: "privacy_policy",
        content: data.content,
        type,
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
