import { HeroSection } from '@/components/HeroSection';
import { SkillsSection } from '@/components/SkillsSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import Portfolio from '@/data/Exp.json';

export default function HomePage() {
  const profile = Portfolio.profile[0];

  return (
    <div className="home-page">
      <HeroSection profile={profile} />
      <SkillsSection skills={Portfolio.skills} />
      <ExperienceSection experience={Portfolio.experience} education={Portfolio.education} />
    </div>
  );
}
