import Featured from "@/components/Featured";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Image from "next/image";

export default function Home() {
  return (
   <div>
      <Hero></Hero>
      <Featured></Featured>
      <HowItWorks></HowItWorks>

   </div>
  );
}
