import { adminGetGallery } from "@/lib/admin-data";
import { GalleryManager } from "@/components/admin/GalleryManager";

export const dynamic = "force-dynamic";

export default async function GalleryAdmin() {
  const images = await adminGetGallery();
  return <GalleryManager images={images} />;
}
