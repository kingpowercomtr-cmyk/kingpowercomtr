import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/admin-auth";

/** Giriş yapılmışsa panele yönlendir; sidebar asla render edilmez */
export default async function GirisLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("kp_admin_token")?.value;
  if (token && verifyAdminToken(token)) {
    redirect("/admin");
  }
  return <>{children}</>;
}
