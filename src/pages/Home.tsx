import Portfolio from "../json/Exp.json";
import { HeroSection } from "../components/HeroSection";
import { SkillsSection } from "../components/SkillsSection";
import { ExperienceSection } from "../components/ExperienceSection";

export default function HomePage() {
  const profile = Portfolio.profile[0];

  return (
    <div className="home-page">
      <HeroSection profile={profile} />
      <SkillsSection skills={Portfolio.skills} />
      <ExperienceSection
        experience={Portfolio.experience}
        education={Portfolio.education}
      />
    </div>
  );
}
