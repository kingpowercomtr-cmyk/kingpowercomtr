"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGiris() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Giriş başarısız.");
      } else {
        router.push("/admin");
      }
    } catch {
      setError("Sunucu hatası. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-3xl font-black text-white mb-2">KINGPOWER</div>
          <p className="text-gray-400 text-sm">Admin Paneli</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-[#111] border border-white/10 rounded-2xl p-8 space-y-5"
        >
          <h1 className="text-xl font-bold text-white text-center mb-2">Yönetici Girişi</h1>
          {error && (
            <div className="bg-red-900/40 border border-red-700/40 text-red-400 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Kullanıcı Adı</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-bold text-black bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg hover:from-yellow-300 hover:to-yellow-500 transition-all disabled:opacity-60"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}
