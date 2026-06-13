import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/admin-auth";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("kp_admin_token")?.value;

  if (!token || !verifyAdminToken(token)) {
    redirect("/admin/giris");
  }

  return <AdminShell>{children}</AdminShell>;
}
