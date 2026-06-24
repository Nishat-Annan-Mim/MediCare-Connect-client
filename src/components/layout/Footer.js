import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";
import Logo from "@/components/shared/Logo";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Find Doctors", href: "/doctors" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const SOCIAL_LINKS = [
  { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
  { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FaLinkedinIn, href: "https://linkedin.com", label: "LinkedIn" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-base-200 bg-base-200/50">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-base-content/70">
              Connecting patients with trusted doctors for faster, simpler
              healthcare — book appointments, manage records, and pay securely,
              all in one place.
            </p>
            <div className="mt-4 flex gap-2">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="btn btn-circle btn-sm btn-ghost"
                >
                  <Icon size={14} />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="footer-title text-sm font-semibold text-base-content">
              Quick Links
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-base-content/70 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="footer-title text-sm font-semibold text-base-content">
              Contact Information
            </h3>
            <ul className="mt-3 flex flex-col gap-3 text-sm text-base-content/70">
              <li className="flex items-start gap-2">
                <FaMapMarkerAlt
                  className="mt-0.5 shrink-0 text-primary"
                  size={14}
                />
                <span>House 12, Road 5, Dhanmondi, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="shrink-0 text-primary" size={14} />
                <span>support@medicareconnect.com</span>
              </li>
              <li className="flex items-center gap-2">
                <FaPhoneAlt className="shrink-0 text-primary" size={14} />
                <span>+880 1234-567890</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="footer-title text-sm font-semibold text-base-content">
              Emergency Hotline
            </h3>
            <div className="mt-3 rounded-box border border-accent/30 bg-accent/10 p-4">
              <p className="text-xs text-base-content/60">
                Available 24/7 for urgent care
              </p>
              <a
                href="tel:999"
                className="mt-1 block text-2xl font-bold text-accent"
              >
                999
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-base-300 pt-6 text-xs text-base-content/60 sm:flex-row">
          <p>© {year} MediCare Connect. All rights reserved.</p>
          <p>Built for better healthcare access, everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
