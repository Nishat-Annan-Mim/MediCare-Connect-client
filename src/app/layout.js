import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "MediCare Connect | Hospital Appointment & Healthcare Management",
    template: "%s | MediCare Connect",
  },
  description:
    "Book appointments with verified doctors, manage prescriptions, and access healthcare services seamlessly with MediCare Connect.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem("medicare-theme") || "medicareLight";
                  document.documentElement.setAttribute("data-theme", theme);
                } catch (e) {
                  document.documentElement.setAttribute("data-theme", "medicareLight");
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
