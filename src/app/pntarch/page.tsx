import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default async function PntarchEntry() {
  if (await isAuthed()) redirect("/pntarch/projects");
  return <LoginForm />;
}
