"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup" | "magic">("login");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!configured) return setMessage("本地尚未配置 Supabase，请复制 .env.example 为 .env.local。");
    setBusy(true);
    setMessage("");
    const supabase = createSupabaseBrowserClient();
    if (mode === "magic") {
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${location.origin}/auth/callback` } });
      setMessage(error?.message ?? "登录链接已发送，请检查邮箱。");
    } else if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}/auth/callback` } });
      setMessage(error?.message ?? "注册成功；如已开启邮箱验证，请先查收邮件。");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else { router.push("/dashboard"); router.refresh(); }
    }
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="paper rounded-3xl p-7">
      <div className="grid grid-cols-3 rounded-xl bg-[#f0f1eb] p-1 text-xs">
        {[["login", "密码登录"], ["signup", "注册"], ["magic", "Magic Link"]].map(([value, label]) => <button type="button" key={value} onClick={() => setMode(value as typeof mode)} className={`rounded-lg px-2 py-2 ${mode === value ? "bg-white font-medium shadow-sm" : "text-[#68756e]"}`}>{label}</button>)}
      </div>
      <label className="mt-6 block text-xs font-medium text-[#65736b]">邮箱</label>
      <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[#174c36]/40" />
      {mode !== "magic" && <><label className="mt-5 block text-xs font-medium text-[#65736b]">密码（至少 6 位）</label><input type="password" minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[#174c36]/40" /></>}
      <button disabled={busy} className="mt-6 w-full rounded-xl bg-[#174c36] px-4 py-3 font-medium text-white disabled:opacity-50">{busy ? "处理中…" : mode === "login" ? "登录" : mode === "signup" ? "创建账户" : "发送登录链接"}</button>
      {message && <p className="mt-4 rounded-xl bg-[#f4e3d5] p-3 text-xs leading-5 text-[#806654]">{message}</p>}
      <p className="mt-5 text-center text-xs leading-5 text-[#7b867f]">你的房屋、方案与原件受 Supabase RLS 隔离；公共 Wiki 不含私人方案数据。</p>
    </form>
  );
}
