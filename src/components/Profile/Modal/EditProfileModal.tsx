import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useEditProfileMutation } from "@/store/apis/profileApi";
import ProfileForm from "../Form/ProfileForm";
import type { ProfileFormValues } from "@/schemas/profile/profile.schema";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: ProfileFormValues;
}

export default function EditProfileModal({
  open,
  onOpenChange,
  profile,
}: Props) {
  const [editProfile, { isLoading }] = useEditProfileMutation();

  const handleSubmit = async (data: ProfileFormValues) => {
    try {
      const res = await editProfile(data).unwrap();

      toast.success(res.message || "Profile updated successfully!");
      onOpenChange(false);
    } catch (error: any) {
      const message =
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.error ||
        "Failed to update profile";

      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information</DialogDescription>
        </DialogHeader>

        <ProfileForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          initialData={profile}
        />
      </DialogContent>
    </Dialog>
  );
}
