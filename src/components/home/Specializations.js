import { FiHeart, FiActivity, FiEye } from "react-icons/fi";
import { MdPsychology, MdChildCare } from "react-icons/md";
import { GiBoneKnife } from "react-icons/gi";

const SPECIALIZATIONS = [
  { name: "Cardiology", icon: FiHeart, description: "Heart & vascular care" },
  {
    name: "Neurology",
    icon: MdPsychology,
    description: "Brain & nervous system",
  },
  { name: "Orthopedics", icon: GiBoneKnife, description: "Bones & joints" },
  { name: "Pediatrics", icon: MdChildCare, description: "Child healthcare" },
  { name: "Dermatology", icon: FiActivity, description: "Skin & hair care" },
  { name: "Ophthalmology", icon: FiEye, description: "Eye care & vision" },
];

export default function Specializations() {
  return (
    <section className="bg-base-200/50 py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-base-content sm:text-3xl">
            Browse by Specialization
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-base-content/60">
            Find the right specialist for your specific healthcare needs
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {SPECIALIZATIONS.map(({ name, icon: Icon, description }) => (
            <a
              key={name}
              href={`/doctors?specialization=${encodeURIComponent(name)}`}
              className="group flex flex-col items-center rounded-box border border-base-200 bg-base-100 p-5 text-center transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-content">
                <Icon size={22} />
              </div>
              <p className="mt-3 text-sm font-semibold text-base-content">
                {name}
              </p>
              <p className="mt-0.5 text-xs text-base-content/50">
                {description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
