interface Skill {
    name: string;
    icon: string;
    url: string;
}

interface SkillsData {
    languages: Skill[];
    libraries: Skill[];
}

function SkillCard({ skill }: { skill: Skill }) {
    return (
        <a
            href={skill.url}
            target="_blank"
            rel="noopener noreferrer"
            className="skill-item glass-card"
        >
            <img className="skill-icon" src={skill.icon} alt={skill.name} />
            <span className="skill-name">{skill.name}</span>
        </a>
    );
}

export function SkillsSection({ skills }: { skills: SkillsData }) {
    return (
        <section className="skills-section">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">Skills</span>
                    <h2 className="section-title">Tech Stack</h2>
                </div>

                {/* Languages */}
                <div className="skills-category">
                    <h3 className="skills-category-title">Languages</h3>
                    <div className="skills-grid">
                        {skills.languages.map((skill) => (
                            <SkillCard key={skill.name} skill={skill} />
                        ))}
                    </div>
                </div>

                {/* Libraries & Tools */}
                <div className="skills-category">
                    <h3 className="skills-category-title">Libraries &amp; Tools</h3>
                    <div className="skills-grid">
                        {skills.libraries.map((skill) => (
                            <SkillCard key={skill.name} skill={skill} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
