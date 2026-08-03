import { notFound } from "next/navigation";
import { adminGetProject, adminCountProjects } from "@/lib/admin-data";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Trước đây gọi adminGetProjects() chỉ để lấy .length, tức là kéo cả bảng
  // projects kèm join ảnh về hai lần cho mỗi lần mở trang.
  const [project, count] = await Promise.all([adminGetProject(id), adminCountProjects()]);
  if (!project) notFound();
  return <ProjectForm project={project} nextOrder={count} />;
}
