import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { Features } from "./Features";
import { HowItWorks } from "./HowItWorks";
import { UseCases } from "./UseCases";
import { TrustSecurity } from "./TrustSecurity";
import { FinalCTA } from "./FinalCTA";
import { Footer } from "./Footer";

export function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#07080f", color: "#e8e6e1" }}>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <UseCases />
      <TrustSecurity />
      <FinalCTA />
      <Footer />
    </div>
  );
}
