import HeroBanner from "@/components/home/HeroBanner";
import FeaturedDoctors from "@/components/home/FeaturedDoctors";
import Specializations from "@/components/home/Specializations";
import PlatformStats from "@/components/home/PlatformStats";
import SuccessStories from "@/components/home/SuccessStories";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <FeaturedDoctors />
      <Specializations />
      <PlatformStats />
      <SuccessStories />
      <WhyChooseUs />
    </>
  );
}
