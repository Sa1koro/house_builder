"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      setMessage(error ? error.message : "注册成功，请查收确认邮件（如已开启）");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMessage(error.message);
      } else {
        router.push("/houses");
        router.refresh();
      }
    }
    setLoading(false);
  }

  async function handleMagicLink() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setMessage(error ? error.message : "魔法链接已发送到邮箱");
    setLoading(false);
  }

  return (
    <div className="max-w-md mx-auto card space-y-6">
      <h1 className="text-2xl font-bold text-[var(--primary)]">
        {mode === "login" ? "登录" : "注册"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">邮箱</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">密码</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2"
            minLength={6}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "处理中…" : mode === "login" ? "登录" : "注册"}
        </button>
      </form>
      <button
        type="button"
        onClick={handleMagicLink}
        disabled={loading || !email}
        className="btn btn-secondary w-full text-sm"
      >
        发送 Magic Link
      </button>
      <p className="text-sm text-center">
        <button
          type="button"
          className="text-[var(--primary)] underline"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login" ? "没有账号？注册" : "已有账号？登录"}
        </button>
      </p>
      {message && (
        <p className="text-sm text-center text-[var(--muted)]">{message}</p>
      )}
    </div>
  );
}
