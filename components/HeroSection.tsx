import Link from "next/link";

interface ProfileData {
    name: string;
    title: string;
    institution: string;
    image: string;
    Description: string;
}

export function HeroSection({ profile }: { profile: ProfileData }) {
    return (
        <section className="hero">
            <div className="container">
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="dot"></span>
                        Available for opportunities
                    </div>

                    <h1 className="hero-title">
                        Hi, I&apos;m {profile.name}
                    </h1>

                    <p className="hero-subtitle">
                        {profile.title} at {profile.institution}. {profile.Description}.
                        Passionate about building beautiful and functional web experiences.
                    </p>

                    <div className="hero-buttons">
                        <a href="#experience" className="btn btn-primary">
                            View My Work
                        </a>
                        <Link href="/contacts" className="btn btn-secondary">
                            Get In Touch
                        </Link>
                    </div>

                    {}
                </div>
            </div>
        </section>
    );
}
