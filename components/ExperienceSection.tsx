interface ExpItem {
    id: number;
    place: string;
    role: string;
    description: string;
    timeline: string;
    logo: string;
}

function ExperienceCard({ item }: { item: ExpItem }) {
    return (
        <div className="experience-card glass-card">
            <img className="experience-logo" src={item.logo} alt={item.place} />
            <div className="experience-content">
                <div className="experience-header">
                    <div>
                        <h3 className="experience-company">{item.place}</h3>
                        <p className="experience-role">{item.role}</p>
                    </div>
                    <span className="experience-timeline">{item.timeline}</span>
                </div>
                <p className="experience-description">{item.description}</p>
            </div>
        </div>
    );
}

export function ExperienceSection({
    experience,
    education,
}: {
    experience: ExpItem[];
    education: ExpItem[];
}) {
    return (
        <section className="experience-section" id="experience">
            <div className="container">
                {/* Experience */}
                {experience.length > 0 && (
                    <>
                        <div className="section-header">
                            <span className="section-label">Career</span>
                            <h2 className="section-title">Experience</h2>
                        </div>

                        <div className="experience-grid">
                            {experience.map((item) => (
                                <ExperienceCard key={`exp-${item.id}`} item={item} />
                            ))}
                        </div>
                    </>
                )}

                {/* Education */}
                {education.length > 0 && (
                    <>
                        <div className="section-header" style={{ marginTop: "3rem" }}>
                            <span className="section-label">Background</span>
                            <h2 className="section-title">Education</h2>
                        </div>

                        <div className="experience-grid">
                            {education.map((item) => (
                                <ExperienceCard key={`edu-${item.id}`} item={item} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
