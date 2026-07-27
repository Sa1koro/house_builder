"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const { error } = await createClient().auth.signInWithOtp({ email, options: { emailRedirectTo: `${location.origin}/auth/callback` } });
    setMessage(error ? error.message : "登录链接已发送，请检查邮箱。");
  }
  return <form className="card" onSubmit={submit} style={{ maxWidth: 460 }}><label>邮箱<input required type="email" value={email} onChange={e => setEmail(e.target.value)} /></label><p><button>发送 Magic Link</button></p>{message && <p role="status">{message}</p>}</form>;
}
