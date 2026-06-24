import { Suspense } from "react";
import FindDoctorsClient from "@/components/doctors/FindDoctorsClient";

export const metadata = { title: "Find Doctors" };

export default function FindDoctorsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-base-content/50">Loading...</div>
      }
    >
      <FindDoctorsClient />
    </Suspense>
  );
}
