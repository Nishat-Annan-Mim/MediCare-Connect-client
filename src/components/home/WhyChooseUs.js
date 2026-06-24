import { FiShield, FiClock, FiHeart, FiTrendingUp } from "react-icons/fi";

const REASONS = [
  {
    icon: FiShield,
    title: "Verified Doctors Only",
    description:
      "Every doctor on our platform is manually reviewed and verified by our admin team before they can accept patients.",
  },
  {
    icon: FiClock,
    title: "Save Your Time",
    description:
      "Skip the waiting room. Book a slot that works for you and get confirmed appointments within minutes.",
  },
  {
    icon: FiHeart,
    title: "Complete Health Records",
    description:
      "Your appointment history, prescriptions, and payments are all stored securely in one place, accessible anytime.",
  },
  {
    icon: FiTrendingUp,
    title: "Transparent Pricing",
    description:
      "See consultation fees upfront before booking — no hidden charges, no surprises at the clinic.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-base-200/50 py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-base-content sm:text-3xl">
            Why Choose MediCare Connect
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-base-content/60">
            Built to make healthcare simpler, faster, and more transparent
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-box bg-base-100 p-6 text-center shadow-sm"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon size={24} />
              </div>
              <h3 className="mt-4 font-semibold text-base-content">{title}</h3>
              <p className="mt-2 text-sm text-base-content/60">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}