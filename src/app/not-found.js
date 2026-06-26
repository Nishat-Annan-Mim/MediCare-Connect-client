import Link from "next/link";
import { FiHome, FiAlertCircle } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base-100 px-4 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
        <FiAlertCircle size={44} />
      </div>

      <h1 className="mt-6 text-5xl font-bold text-base-content">404</h1>
      <h2 className="mt-2 text-xl font-semibold text-base-content">
        Page Not Found
      </h2>
      <p className="mx-auto mt-2 max-w-md text-base-content/60">
        Sorry, we couldn't find the page you're looking for. It may have been
        moved, renamed, or doesn't exist.
      </p>

      <Link href="/" className="btn btn-primary mt-8 gap-2">
        <FiHome size={16} />
        Back to Home
      </Link>
    </div>
  );
}
