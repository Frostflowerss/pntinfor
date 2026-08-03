import { adminCountProjects } from "@/lib/admin-data";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default async function NewProject() {
  // Chỉ cần số lượng để đặt sort_order mặc định — không cần kéo cả bảng về.
  const count = await adminCountProjects();
  return <ProjectForm nextOrder={count} />;
}
