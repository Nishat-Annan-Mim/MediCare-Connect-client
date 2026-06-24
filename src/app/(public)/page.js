export default function HomePage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-base-content sm:text-4xl">
          Welcome to <span className="text-primary">MediCare Connect</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base-content/70">
          The full homepage (banner, featured doctors, specializations, and
          more) is coming in the next stage. Navbar and Footer are now live —
          try the theme toggle and mobile menu above.
        </p>
      </div>
    </div>
  );
}
