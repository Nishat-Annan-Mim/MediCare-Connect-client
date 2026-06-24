import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-base-content/50">Loading...</div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
