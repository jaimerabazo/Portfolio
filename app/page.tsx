import Hero from "@/components/Hero";
import Departures from "@/components/Departures";
import Logbook from "@/components/Logbook";
import Route from "@/components/Route";
import Packing from "@/components/Packing";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Departures />
      <Logbook />
      <Route />
      <Packing />
      <Contact />
    </>
  );
}
