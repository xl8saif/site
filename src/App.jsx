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
  ["العربية", "Arabic", "ara", "ar", "Native", "Arabic", "/site/images/01-1519817650390-64a93db511aa.jpg"],
  ["اردو", "Urdu", "urd", "ur", "Native / Expert", "اردو", "/site/images/02-1594736797933-d0501ba2fe65.jpg"],
  ["انڈس کوہستانی", "Indus-Kohistani", "mvy", "—", "Native fluency", "انڈس کوہستانی", "/site/images/03-1500534623283-312aade485b7.jpg"],
  ["English", "English", "eng", "en", "Fluent", "English", "/site/images/04-1521587760476-6c12a4b040da.jpg"],
  ["فارسی", "Persian", "fas", "fa", "Advanced", "فارسی", "/site/images/05-1564399579883-451a5d44ec08.jpg"],
  ["شینا", "Shina", "scl", "—", "Advanced", "شینا", "/site/images/06-1519681393784-d120267933ba.jpg"],
  ["پښتو", "Pashto", "pus", "ps", "Professional", "پښتو", "/site/images/07-1518005020951-eccb494ad742.jpg"],
  ["ਪੰਜਾਬੀ", "Punjabi", "pan", "pa", "Professional", "ਪੰਜਾਬੀ", "/site/images/08-1532012197267-da84d127e765.jpg"],
  ["گوجری", "Gujri", "gju", "—", "Working", "گوجری", "/site/images/09-1519682337058-a94d519337bc.jpg"],
  ["Türkçe", "Turkish", "tur", "tr", "Working", "Türkçe", "/site/images/10-1524231757912-21f4fe3a7200.jpg"],
];

const linkedinPosts = [
  {
    date: "1 week ago",
    title: "Open to New Localization Opportunities",
    excerpt: "Open to new opportunities in Game Localization, Arabic Localization, LQA, Translation, MTPE and multilingual localization, with experience across Arabic, Urdu, Persian, English, Indus Kohistani and Shina.",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7485726150388985856/"
  },
  {
    date: "1 month ago",
    title: "Preserving Indus Kohistani",
    excerpt: "A long-term language-preservation project focused on documentation, multilingual resources, open datasets and creating a written future for an endangered language.",
    link: "https://www.linkedin.com/in/xl8saif/"
  },
  {
    date: "4 months ago",
    title: "Linguistic Validation — Why Translation Alone Isn't Enough",
    excerpt: "A practical look at linguistic validation in healthcare and life sciences, including forward translation, back translation, expert review, cognitive debriefing and harmonization.",
    link: "https://www.linkedin.com/in/xl8saif/"
  }
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
                <img src="/site/icons/whatsapp.svg" alt="" aria-hidden="true" />
                <span><small>WHATSAPP</small><strong>Message me ↗</strong></span>
              </a>
              <a className="social-link" href="https://www.linkedin.com/in/xl8saif/" target="_blank" rel="noreferrer" aria-label="LinkedIn — xl8-saif">
                <img src="/site/icons/linkedin.svg" alt="" aria-hidden="true" />
                <span><small>LINKEDIN</small><strong>xl8-saif ↗</strong></span>
              </a>
              <a className="social-link" href="https://www.upwork.com/freelancers/~011ed3711aa3cf98f4" target="_blank" rel="noreferrer" aria-label="Upwork — Freelance profile">
                <img src="/site/icons/upwork.svg" alt="" aria-hidden="true" />
                <span><small>UPWORK</small><strong>Freelance profile ↗</strong></span>
              </a>
              <a className="social-link" href="https://www.facebook.com/share/p/1DZCDTed6U/" target="_blank" rel="noreferrer" aria-label="Facebook — Latest post">
                <img src="/site/icons/facebook.svg" alt="" aria-hidden="true" />
                <span><small>FACEBOOK</small><strong>Latest post ↗</strong></span>
              </a>
              <a className="social-link" href="https://www.proz.com/profile/3150554" target="_blank" rel="noreferrer" aria-label="ProZ.com — Translator profile">
                <span className="proz-icon" aria-hidden="true">P</span>
                <span><small>PROZ.COM</small><strong>Translator profile ↗</strong></span>
              </a>
            </div>
          </div>
        </section>

        <section className="linkedin-posts-section" aria-labelledby="linkedin-posts-heading">
          <div className="container">
            <div className="linkedin-posts-heading">
              <div>
                <p className="section-label">LATEST LINKEDIN ACTIVITY</p>
                <h2 id="linkedin-posts-heading">Recent posts & professional updates.</h2>
              </div>
              <a className="linkedin-all-link" href="https://www.linkedin.com/in/xl8saif/" target="_blank" rel="noreferrer">View LinkedIn ↗</a>
            </div>
            <div className="linkedin-engagement">
              <a className="engagement-button" href="https://www.linkedin.com/feed/update/urn:li:activity:7485726150388985856/" target="_blank" rel="noreferrer"><span aria-hidden="true">♥</span>Like on LinkedIn</a>
              <a className="engagement-button" href="https://www.linkedin.com/in/xl8saif/" target="_blank" rel="noreferrer"><span aria-hidden="true">＋</span>Follow on LinkedIn</a>
              <button className="engagement-button" onClick={async () => { const shareData = { title: "Saif Ullah — Translator & Localization Expert", text: "Saif Ullah — Translator & Localization Expert", url: "https://xl8saif.github.io/site/" }; try { if (navigator.share) await navigator.share(shareData); else { await navigator.clipboard.writeText(shareData.url); alert("Website link copied to clipboard."); } } catch {} }}><span aria-hidden="true">↗</span>Share</button>
            </div>
            <div className="linkedin-posts-grid">
              {linkedinPosts.map((post) => (
                <article className="linkedin-post-card" key={post.title}>
                  <div className="linkedin-post-top"><img src="/site/icons/linkedin.svg" alt="" aria-hidden="true" /><span>{post.date}</span></div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <a href={post.link} target="_blank" rel="noreferrer">Open post ↗</a>
                </article>
              ))}
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
            <div className="section-heading"><h2>What I do</h2><p>Language services, localization, language technology and AI-assisted digital product development.</p></div>
            <div className="expertise-grid">{[
  ["Translation", "/site/images/11-1455390582262-044cdead277a.jpg"],
  ["Interpretation", "/site/images/12-1589254065878-42c9da997008.jpg"],
  ["Localization", "/site/images/13-1499750310107-5fef28a66643.jpg"],
  ["Game Localization", "/site/images/14-1542751371-adc38448a05e.jpg"],
  ["LQA & Linguistic Testing", "/site/images/15-1553484771-047a44eee27b.jpg"],
  ["MTPE", "/site/images/16-1551288049-bebda4e38f71.jpg"],
  ["Subtitling", "/site/images/17-1485846234645-a62644f84728.jpg"],
  ["Language Documentation", "/site/images/18-1457369804613-52c61a468e7d.jpg"],
  ["Digital Preservation", "/site/images/19-1524995997946-a1c2e315a42f.jpg"],
  ["Language Technology", "/site/images/20-1516321318423-f06f85e504b3.jpg"],
  ["AI & NLP", "/site/images/21-1677442136019-21780ecad995.jpg"],
  ["Multilingual Content", "/site/images/13-1499750310107-5fef28a66643.jpg"],
  ["AI-Assisted App Development", "/site/images/22-1551650975-87deedd944c3.jpg"],
  ["Web & App UI Design", "/site/images/23-1559028012-481c04fa702d.jpg"],
  ["Software Prototyping", "/site/images/24-1461749280684-dccba630e2f6.jpg"]
].map(([item, image],index)=><article className="expertise-card" key={item}><img src={image} alt="" aria-hidden="true" loading="lazy" /><div className="expertise-card-content"><span>{String(index+1).padStart(2,"0")}</span><h3>{item}</h3></div></article>)}</div>
          </div>
        </section>

        <section id="experience" className="content-section experience-section">
          <div className="container">
            <p className="section-label">03 — EXPERIENCE</p>
            <div className="section-heading">
              <h2>Work across institutions, technology and <em>heritage.</em></h2>
              <p>A professional journey spanning entrepreneurship, language technology and community-led cultural preservation.</p>
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
              <article className="project-card project-featured"><img className="project-image" src="/site/images/25-1455390582262-044cdead277a.jpg" alt="Indus Kohistani digital documentation and research workspace" loading="lazy" /><span className="project-number">01</span><p>INDUS-KOHISTANI · FIKR&CD</p><h3>Indus Kohistani Digital Preservation</h3><span className="project-line"/><p>FiKR&CD — Forum for Indus-Kohistani Research & Culture Development — is a community-led initiative focused on documenting, preserving and digitally developing Indus-Kohistani language and cultural heritage.</p><p>Its web portal brings together language resources, research, digital preservation work and cultural documentation in one public-facing platform.</p><a className="project-link" href="https://fikrcd.org/" target="_blank" rel="noreferrer">Visit the FiKR&CD Web Portal ↗</a></article>
              <article className="project-card"><img className="project-image" src="/site/images/26-1499750310107-5fef28a66643.jpg" alt="Digital work and localization workspace" loading="lazy" /><span className="project-number">02</span><p>LOCALIZATION</p><h3>Saudi Ministry of Hajj & Umrah</h3><span className="project-line"/><p>Large-scale English and Arabic to Urdu and Persian translation and localization.</p></article>
              <article className="project-card"><img className="project-image" src="/site/images/27-1542751371-adc38448a05e.jpg" alt="Gaming and interactive media" loading="lazy" /><span className="project-number">03</span><p>GAME LOCALIZATION</p><h3>PUBG MOBILE / World of Wonder</h3><span className="project-line"/><p>Urdu localization, terminology, LQA and structured game content handling.</p></article>
              <article className="project-card"><img className="project-image" src="/site/images/28-1516321318423-f06f85e504b3.jpg" alt="Digital language documentation and research" loading="lazy" /><span className="project-number">04</span><p>LANGUAGE DOCUMENTATION</p><h3>Shina Language Documentation</h3><span className="project-line"/><p>Verification and linguistic documentation of Shina-language media and community content.</p></article>
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
              {languages.map(([native, english, iso3, iso1, level, typographicalName, image]) => (
                <article className="language-item" key={english}>
                  <img className="language-image" src={image} alt="" aria-hidden="true" loading="lazy" />
                  <div className="language-overlay" />
                  <div className="language-item-content">
                    <div className="language-name">
                      <h3 className={/[\u0600-\u06FF\u0750-\u077F\u0900-\u097F\u0A00-\u0A7F]/.test(native) ? "native-script" : ""}>{native}</h3>
                      <small>{english}</small>
                    </div>
                    <div className="language-meta">
                      <span className="language-level">{level}</span>
                      <span className="language-codes">ISO 639-3 <b>{iso3}</b> · ISO 639-1 <b>{iso1}</b></span>
                      <span className="language-typography">{typographicalName}</span>
                    </div>
                  </div>
                </article>
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
