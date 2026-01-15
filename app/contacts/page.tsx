export default function ContactsPage() {
    return (
        <div className="contacts-page">
            <div className="container">
                <div className="contacts-header">
                    <h1 className="contacts-title">
                        Get In <span className="gradient-text">Touch</span>
                    </h1>
                    <p className="contacts-subtitle">
                        Have a project in mind or want to collaborate? I&apos;d love to hear
                        from you. Let&apos;s create something amazing together.
                    </p>
                </div>

                <div className="contacts-grid">
                    {/* Contact Form - Formspree */}
                    <div className="contact-form-section glass-card">
                        <form
                            className="contact-form"
                            action="https://formspree.io/f/mqeealrp"
                            method="POST"
                        >
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-input"
                                    placeholder="Your name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-input"
                                    placeholder="your.email@example.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message" className="form-label">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    className="form-textarea"
                                    placeholder="Tell me about your project..."
                                    required
                                />
                            </div>

                            <button type="submit" className="submit-btn">
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="contact-info-section glass-card">
                        <h3 className="contact-info-title">Contact Information</h3>

                        <div className="contact-info-list">
                            <div className="contact-info-item">
                                <img
                                    className="contact-icon-img"
                                    src="https://cdn.simpleicons.org/gmail/white"
                                    alt="Email"
                                />
                                <div className="contact-details">
                                    <h4>Email</h4>
                                    <a href="mailto:briankihara@example.com">
                                        briankihara@example.com
                                    </a>
                                </div>
                            </div>

                            <div className="contact-info-item">
                                <img
                                    className="contact-icon-img"
                                    src="https://cdn.simpleicons.org/googlemaps/white"
                                    alt="Location"
                                />
                                <div className="contact-details">
                                    <h4>Location</h4>
                                    <p>Eldoret, Kenya</p>
                                </div>
                            </div>

                            <div className="contact-info-item">
                                <img
                                    className="contact-icon-img"
                                    src="https://cdn.simpleicons.org/academia/white"
                                    alt="University"
                                />
                                <div className="contact-details">
                                    <h4>University</h4>
                                    <p>University of Eldoret</p>
                                </div>
                            </div>
                        </div>

                        <h4 className="social-links-title">Follow Me</h4>
                        <div className="social-links">
                            <a
                                href="https://github.com/Brian-Yobra"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link"
                                title="GitHub"
                            >
                                <img
                                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                                    alt="GitHub"
                                />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link"
                                title="LinkedIn"
                            >
                                <img
                                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
                                    alt="LinkedIn"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
