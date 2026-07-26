import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import PropertyGallery from "@/components/site/PropertyGallery";
import Narrative from "@/components/site/Narrative";
import Services from "@/components/site/Services";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";

export default function Home() {
  return (
    <div className="bg-background">
      <Navbar />
      <main>
        <Hero />
        <PropertyGallery />
        <Narrative />
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}