import { Suspense } from "react";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-base-content/50">Loading...</div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
