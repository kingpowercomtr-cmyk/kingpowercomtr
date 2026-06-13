"use client";
import AdminOrdersTable from "@/components/admin/AdminOrdersTable";

export default function AdminSiparisler() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Siparişler</h1>
        <p className="text-gray-500 text-sm mt-1">Tüm siparişleri yönetin ve dışa aktarın</p>
      </div>
      <AdminOrdersTable showExport limit={500} />
    </div>
  );
}
