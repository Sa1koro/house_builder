import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return <main><span className="pill">你的私有空间</span><h1>登录或注册</h1><p className="muted">输入邮箱后，我们会发送一次性登录链接。</p><LoginForm /></main>;
}
