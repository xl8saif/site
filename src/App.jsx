import { useState } from "react";

const navigation = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Expertise", id: "expertise" },
  { label: "Experience", id: "experience" },
  { label: "Projects", id: "projects" },
  { label: "Languages", id: "languages" },
  { label: "Contact", id: "contact" },
];

const languages = [
  ["العربية", "Arabic", "Native", true],
  ["اردو", "Urdu", "Native / Expert", true],
  ["انڈس کوہستانی", "Indus-Kohistani", "Native fluency", true],
  ["English", "English", "Fluent", false],
  ["فارسی", "Persian", "Advanced", true],
  ["شینا", "Shina", "Advanced", true],
  ["پښتو", "Pashto", "Professional", true],
  ["ਪੰਜਾਬੀ", "Punjabi", "Professional", true],
  ["گوجری", "Gujri", "Working", true],
  ["Türkçe", "Turkish", "Working", false],
];

const clients = [
  ["LEVEL INFINITE", "Game Localization"],
  ["iFLYTEK", "AI & Language Technology"],
  ["PRODUCTIVE PLAYHOUSE", "Language Data & Verification"],
  ["MINISTRY OF HAJJ & UMRAH", "Government Localization"],
  ["MULTI LANGUAGES", "Certified Translation"],
  ["AL WASEEM", "Translation Services"],
  ["TAGHRID ENTERPRISES", "Translation & Language Services"],
  ["FLI PAKISTAN", "Translation & Localization"],
  ["RWS", "Language & Localization Technology"],
  ["WARAQ ENTERPRISES", "Language Services · Founder / CEO"],
  ["CLOUDTRANS", "Language Services · Founder"],
  ["FiKR&CD", "Language Preservation · Co-Founder"],
  ["PUBG MOBILE", "Game Localization · Urdu"],
  ["WORLD OF WONDER", "Game Localization · Urdu"],
  ["INDUS-KOHISTANI DIGITAL PRESERVATION", "Language Preservation Project"],
  ["SHINA LANGUAGE DOCUMENTATION", "Language Documentation Project"],
];

const clientMark = (name) => {
  const marks = {
    "LEVEL INFINITE": "∞",
    "iFLYTEK": "iF",
    "PRODUCTIVE PLAYHOUSE": "P",
    "MINISTRY OF HAJJ & UMRAH": "م",
    "MULTI LANGUAGES": "ML",
    "AL WASEEM": "AW",
    "TAGHRID ENTERPRISES": "TE",
    "FLI PAKISTAN": "FLI",
    "RWS": "RWS",
    "WARAQ ENTERPRISES": "W",
    "CLOUDTRANS": "CT",
    "FiKR&CD": "FiK",
    "PUBG MOBILE": "P",
    "WORLD OF WONDER": "WOW",
    "INDUS-KOHISTANI DIGITAL PRESERVATION": "IK",
    "SHINA LANGUAGE DOCUMENTATION": "ش",
  };
  return marks[name] || name.slice(0, 2);
};

const experience = [
  {
    period: "2021 — PRESENT",
    role: "Lower Division Clerk (BPS-11)",
    organization: "Secretariat of Tourism, Sports, Culture, Archaeology & Museums",
    location: "Government of Gilgit-Baltistan",
    description: "Serving in the Government of Gilgit-Baltistan while continuing professional work in multilingual communication, documentation and language-focused projects.",
  },
  {
    period: "28 DEC 2020 — 25 FEB 2021",
    role: "Naib Qasid (BPS-01)",
    organization: "Government of Gilgit-Baltistan",
    location: "Gilgit-Baltistan, Pakistan",
    description: "Early government service experience within the Gilgit-Baltistan administration, contributing to institutional operations and public-sector work.",
  },
  {
    period: "15 NOV 2017 — PRESENT",
    role: "CEO & Language Services Professional",
    organization: "Waraq Enterprises",
    location: "Pakistan · Remote",
    description: "Leading a professional language-services enterprise, delivering translation, interpretation, localization and multilingual communication services for local and international clients.",
  },
  {
    period: "2021 — PRESENT",
    role: "Founder",
    organization: "CloudTrans",
    location: "Remote",
    description: "Building a language-services and localization practice focused on translation, MTPE, LQA, multilingual content and technology-enabled workflows.",
  },
  {
    period: "2024 — PRESENT",
    role: "Co-Founder",
    organization: "FiKR&CD — Forum for Indus-Kohistani Research & Culture Development",
    location: "Gilgit-Baltistan, Pakistan",
    description: "Working on the documentation, preservation and digital development of Indus-Kohistani language and cultural heritage through community-led research and language technology.",
  },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <header className="site-header">
        <div className="container nav-container">
          <button className="brand" onClick={() => scrollToSection("home")}>
            <span className="brand-mark">SU</span>
            <span className="brand-name">Saif Ullah</span>
          </button>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
            <span /><span /><span />
          </button>
          <nav className={`navigation ${menuOpen ? "navigation-open" : ""}`}>
            {navigation.map((item) => <button key={item.id} onClick={() => scrollToSection(item.id)}>{item.label}</button>)}
          </nav>
          <button className="nav-contact" onClick={() => scrollToSection("contact")}>Contact</button>
        </div>
      </header>

      <main>
        <section className="social-links-section" aria-labelledby="social-links-heading">
          <div className="container social-links-container">
            <p className="section-label">CONNECT WITH ME</p>
            <h2 id="social-links-heading">Professional & Social Links</h2>
            <div className="social-links-row">
              <a className="social-link" href="https://wa.me/923100989830" target="_blank" rel="noreferrer" aria-label="WhatsApp — Message me">
                <img src="https://cdn.simpleicons.org/whatsapp/25D366" alt="" aria-hidden="true" />
                <span><small>WHATSAPP</small><strong>Message me ↗</strong></span>
              </a>
              <a className="social-link" href="https://www.linkedin.com/in/xl8saif/" target="_blank" rel="noreferrer" aria-label="LinkedIn — xl8-saif">
                <img src="https://cdn.simpleicons.org/linkedin/0A66C2" alt="" aria-hidden="true" />
                <span><small>LINKEDIN</small><strong>xl8-saif ↗</strong></span>
              </a>
              <a className="social-link" href="https://www.upwork.com/freelancers/~011ed3711aa3cf98f4" target="_blank" rel="noreferrer" aria-label="Upwork — Freelance profile">
                <img src="https://cdn.simpleicons.org/upwork/14A800" alt="" aria-hidden="true" />
                <span><small>UPWORK</small><strong>Freelance profile ↗</strong></span>
              </a>
              <a className="social-link" href="https://www.facebook.com/khalid.tasmim" target="_blank" rel="noreferrer" aria-label="Facebook — Professional profile">
                <img src="https://cdn.simpleicons.org/facebook/1877F2" alt="" aria-hidden="true" />
                <span><small>FACEBOOK</small><strong>Professional profile ↗</strong></span>
              </a>
              <a className="social-link" href="https://www.proz.com/profile/3150554" target="_blank" rel="noreferrer" aria-label="ProZ.com — Translator profile">
                <span className="proz-icon" aria-hidden="true">P</span>
                <span><small>PROZ.COM</small><strong>Translator profile ↗</strong></span>
              </a>
            </div>
          </div>
        </section>

        <section className="clients-section" aria-labelledby="clients-heading">
          <div className="container">
            <p className="section-label">SELECTED CLIENTS & COLLABORATIONS</p>
            <h2 id="clients-heading">Trusted across language, technology, media and public-sector work.</h2>
          </div>
          <div className="clients-marquee" aria-label="Selected clients and collaborations">
            <div className="clients-track">
              {[...clients, ...clients].map(([name, type], i) => (
                <div className="client-logo" key={name + i}>
                  <span className="client-mark">{clientMark(name)}</span>
                  <span><strong>{name}</strong><small>{type}</small></span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="home" className="hero-section">
          <div className="container hero-grid">
            <div className="hero-content glass-panel">
              <p className="eyebrow">TRANSLATOR · LOCALIZATION · LANGUAGE TECHNOLOGY</p>
              <h1>Language connects<span>people, cultures and ideas.</span></h1>
              <p className="hero-description">Saif Ullah is a multilingual translator and localization expert working across Arabic, Urdu, Persian, English, Indus Kohistani and Shina, with a focus on language technology and digital preservation.</p>
              <div className="hero-actions">
                <button className="button button-primary" onClick={() => scrollToSection("projects")}>Explore my work</button>
                <button className="button button-secondary" onClick={() => scrollToSection("contact")}>Get in touch</button>
              </div>
            </div>
            <div className="hero-profile">
              <div className="profile-frame glass-panel">
                <img className="profile-image" src={`${import.meta.env.BASE_URL}images/saif-ullah.jpg`} alt="Saif Ullah" loading="eager" />
              </div>
              <div className="profile-caption glass-panel"><strong>Saif Ullah</strong><span>Translator & Localization Expert</span></div>
            </div>
          </div>
        </section>

        <section id="about" className="content-section">
          <div className="container">
            <p className="section-label">01 — ABOUT</p>
            <div className="section-heading"><h2>Professional language expertise with a cultural mission.</h2><p>I work at the intersection of translation, localization, multilingual communication and language preservation.</p></div>
            <div className="about-grid">
              <div><h3>12+ Years</h3><p>Professional experience across translation, interpretation, localization, LQA and multilingual communication.</p></div>
              <div><h3>6 Core Languages</h3><p>Arabic, Urdu, Persian, English, Indus Kohistani and Shina.</p></div>
              <div><h3>Language Preservation</h3><p>Dedicated to documenting and digitally preserving under-resourced and endangered languages.</p></div>
            </div>
          </div>
        </section>

        <section id="expertise" className="content-section section-muted">
          <div className="container">
            <p className="section-label">02 — EXPERTISE</p>
            <div className="section-heading"><h2>What I do</h2></div>
            <div className="expertise-grid">{["Translation","Interpretation","Localization","Game Localization","LQA & Linguistic Testing","MTPE","Subtitling","Language Documentation","Digital Preservation","Language Technology","AI & NLP","Multilingual Content"].map((item,index)=><article className="expertise-card" key={item}><span>{String(index+1).padStart(2,"0")}</span><h3>{item}</h3></article>)}</div>
          </div>
        </section>

        <section id="experience" className="content-section experience-section">
          <div className="container">
            <p className="section-label">03 — EXPERIENCE</p>
            <div className="section-heading">
              <h2>Work across institutions, technology and <em>heritage.</em></h2>
              <p>A professional journey spanning public service, entrepreneurship, language technology and community-led cultural preservation.</p>
            </div>
            <div className="experience-list">
              {experience.map((item, index) => (
                <article className="experience-item" key={`${item.organization}-${item.period}`}>
                  <div className="experience-index">{String(index + 1).padStart(2, "0")}</div>
                  <div className="experience-period">{item.period}</div>
                  <div className="experience-content">
                    <h3>{item.role}</h3>
                    <h4>{item.organization}</h4>
                    <span>{item.location}</span>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="content-section">
          <div className="container">
            <p className="section-label">04 — SELECTED WORK</p>
            <div className="section-heading"><h2>Projects that define my work.</h2></div>
            <div className="projects-grid">
              <article className="project-card project-featured"><img className="project-image" src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=82" alt="Writing and translation workspace" loading="lazy" /><span className="project-number">01</span><p>LANGUAGE PRESERVATION</p><h3>Indus Kohistani Digital Preservation</h3><span className="project-line"/><p>Digital documentation, Unicode language data, multilingual resources and AI-assisted preservation for Indus Kohistani.</p></article>
              <article className="project-card"><img className="project-image" src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=82" alt="Digital work and localization workspace" loading="lazy" /><span className="project-number">02</span><p>LOCALIZATION</p><h3>Saudi Ministry of Hajj & Umrah</h3><span className="project-line"/><p>Large-scale English and Arabic to Urdu and Persian translation and localization.</p></article>
              <article className="project-card"><img className="project-image" src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=82" alt="Gaming and interactive media" loading="lazy" /><span className="project-number">03</span><p>GAME LOCALIZATION</p><h3>PUBG MOBILE / World of Wonder</h3><span className="project-line"/><p>Urdu localization, terminology, LQA and structured game content handling.</p></article>
              <article className="project-card"><img className="project-image" src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=82" alt="Digital language documentation and research" loading="lazy" /><span className="project-number">04</span><p>LANGUAGE DOCUMENTATION</p><h3>Shina Language Documentation</h3><span className="project-line"/><p>Verification and linguistic documentation of Shina-language media and community content.</p></article>
            </div>
          </div>
        </section>

        <section id="languages" className="content-section section-dark language-section">
          <div className="container">
            <p className="section-label">05 / LANGUAGES</p>
            <div className="language-heading">
              <div>
                <h2>Fluency is more than knowing <em>words.</em></h2>
                <p>It is knowing what they mean to the people who use them.</p>
              </div>
            </div>
            <div className="languages-grid">
              {languages.map(([native, english, level, nativeScript]) => (
                <div className="language-item" key={english}>
                  <div className="language-name">
                    <h3 className={nativeScript ? "native-script" : ""}>{native}</h3>
                    <small>{english}</small>
                  </div>
                  <span>{level}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="container contact-content">
            <p className="section-label">06 — CONTACT</p>
            <h2>Let's build better communication across languages.</h2>
            <a className="email-link" href="mailto:xl8.saif@gmail.com">xl8.saif@gmail.com</a>
            <div className="contact-links">
              <a href="https://www.linkedin.com/in/xl8saif/" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="https://www.proz.com/profile/3150554" target="_blank" rel="noreferrer">ProZ</a>
              <a href="https://www.upwork.com/freelancers/~011ed3711aa3cf98f4" target="_blank" rel="noreferrer">Upwork</a>
              <a href="https://wa.me/923100989830" target="_blank" rel="noreferrer">WhatsApp</a>
              <a href="https://www.facebook.com/khalid.tasmim" target="_blank" rel="noreferrer">Facebook</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer"><div className="container"><span>© {new Date().getFullYear()} Saif Ullah</span><span>Translation · Localization · Language Technology</span></div></footer>
    </div>
  );
}

export default App;
