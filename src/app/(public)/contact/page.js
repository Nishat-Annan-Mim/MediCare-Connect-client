import { FiMapPin, FiMail, FiPhone } from "react-icons/fi";
import ContactForm from "@/components/contact/ContactForm";

export const metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-base-content sm:text-4xl">
          Get in <span className="text-primary">Touch</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base-content/70">
          Have a question, suggestion, or need help with your account? Send us a
          message and our team will respond as soon as possible.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-box border border-base-200 bg-base-100 p-6 sm:p-8">
          <ContactForm />
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-box border border-base-200 bg-base-100 p-5">
            <FiMapPin size={20} className="text-primary" />
            <h3 className="mt-2 font-semibold text-base-content">Our Office</h3>
            <p className="mt-1 text-sm text-base-content/60">
              House 12, Road 5, Dhanmondi, Dhaka, Bangladesh
            </p>
          </div>
          <div className="rounded-box border border-base-200 bg-base-100 p-5">
            <FiMail size={20} className="text-primary" />
            <h3 className="mt-2 font-semibold text-base-content">Email Us</h3>
            <p className="mt-1 text-sm text-base-content/60">
              support@medicareconnect.com
            </p>
          </div>
          <div className="rounded-box border border-base-200 bg-base-100 p-5">
            <FiPhone size={20} className="text-primary" />
            <h3 className="mt-2 font-semibold text-base-content">Call Us</h3>
            <p className="mt-1 text-sm text-base-content/60">
              +880 1234-567890
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
