"use client";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useState, useTransition } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup" | "magic">("login");
  const [message, setMessage] = useState("");
  const [pending, start] = useTransition();

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-md space-y-3">
        <h1 className="display text-3xl font-semibold">登录</h1>
        <p className="text-sm text-[var(--muted)]">
          尚未配置 <code>NEXT_PUBLIC_SUPABASE_*</code>。复制根目录{" "}
          <code>.env.example</code> 为 <code>apps/web/.env.local</code> 后重启。
        </p>
        <p className="text-sm text-[var(--muted)]">
          未登录也可浏览 Demo 对比、Wiki 与品牌库（本地种子数据）。
        </p>
      </div>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    start(async () => {
      const supabase = createClient();
      if (!supabase) return;
      if (mode === "magic") {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        setMessage(error ? error.message : "魔法链接已发送，请查收邮箱。");
        return;
      }
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        setMessage(error ? error.message : "注册成功，请查收确认邮件或直接登录。");
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else window.location.href = "/houses";
    });
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="display text-3xl font-semibold">登录 / 注册</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Supabase Auth · Email / Magic Link</p>
      </div>
      <div className="flex gap-2 text-sm">
        {(
          [
            ["login", "登录"],
            ["signup", "注册"],
            ["magic", "魔法链接"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setMode(k)}
            className={`rounded-md px-3 py-1.5 ${
              mode === k
                ? "bg-[var(--sage)] text-white"
                : "border border-[var(--line)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="邮箱"
          className="w-full rounded-md border border-[var(--line)] px-3 py-2 text-sm"
        />
        {mode !== "magic" ? (
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密码"
            className="w-full rounded-md border border-[var(--line)] px-3 py-2 text-sm"
          />
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-[var(--sage)] py-2 text-sm text-white disabled:opacity-60"
        >
          {pending ? "提交中…" : "继续"}
        </button>
      </form>
      {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
    </div>
  );
}
