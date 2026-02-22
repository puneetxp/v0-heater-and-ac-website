import { redirect } from "next/navigation";
import { checkAdminAccess } from "@/lib/check-admin";

export default async function AdminProductRedirectPage(
    { params }: { params: Promise<{ id: string }> },
) {
    // Check admin access first
    await checkAdminAccess();

    const { id } = await params;

    // For now, redirect to the variants page which contains the edit form
    // This resolves the 404 on /admin/products/[id]
    redirect(`/admin/products/${id}/variants`);
}
