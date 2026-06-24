import { FiTarget, FiEye, FiHeart, FiGlobe } from "react-icons/fi";

export const metadata = { title: "About Us" };

const VALUES = [
  {
    icon: FiTarget,
    title: "Our Mission",
    description:
      "To make quality healthcare accessible to every patient in Bangladesh by removing the friction of booking, paperwork, and payment from the patient journey.",
  },
  {
    icon: FiEye,
    title: "Our Vision",
    description:
      "A future where finding and consulting a trusted doctor takes minutes, not days — for patients in cities and rural areas alike.",
  },
  {
    icon: FiHeart,
    title: "Our Values",
    description:
      "Transparency in pricing, verified medical professionals, and patient data privacy are non-negotiable parts of how we operate.",
  },
  {
    icon: FiGlobe,
    title: "Our Impact",
    description:
      "By digitizing appointment booking and records, we reduce wasted clinic hours and help doctors serve more patients, more efficiently.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-base-content sm:text-4xl">
          About <span className="text-primary">MediCare Connect</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base-content/70">
          MediCare Connect is a modern healthcare management platform built to
          connect patients with verified doctors and hospitals through a single,
          simple online system — replacing long waiting times and manual
          paperwork with fast, transparent digital care.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {VALUES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-box border border-base-200 bg-base-100 p-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon size={22} />
            </div>
            <h3 className="mt-4 font-semibold text-base-content">{title}</h3>
            <p className="mt-2 text-sm text-base-content/60">{description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-box bg-primary/5 p-8 text-center">
        <h2 className="text-xl font-bold text-base-content">
          Why we built this platform
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-base-content/70">
          Traditional appointment systems in many clinics still rely on phone
          calls, walk-ins, and paper records — leading to long waits and poor
          communication between patients and providers. MediCare Connect
          digitizes the entire flow: search, book, pay, consult, and follow up,
          all from one account.
        </p>
      </div>
    </div>
  );
}
