import { adminGetProjects } from "@/lib/admin-data";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default async function NewProject() {
  const projects = await adminGetProjects();
  return <ProjectForm nextOrder={projects.length} />;
}
