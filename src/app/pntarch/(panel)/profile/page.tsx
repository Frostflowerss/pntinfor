import { adminGetProfile } from "@/lib/admin-data";
import { ProfileForm } from "@/components/admin/ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfileAdmin() {
  const profile = await adminGetProfile();
  return <ProfileForm profile={profile} />;
}
