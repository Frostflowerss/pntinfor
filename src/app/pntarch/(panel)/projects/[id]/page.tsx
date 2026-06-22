import { notFound } from "next/navigation";
import { adminGetProject, adminGetProjects } from "@/lib/admin-data";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project, all] = await Promise.all([adminGetProject(id), adminGetProjects()]);
  if (!project) notFound();
  return <ProjectForm project={project} nextOrder={all.length} />;
}
