import { useState } from "react";

const localImageFiles = {
  "1519817650390-64a93db511aa": "01-1519817650390-64a93db511aa.jpg",
  "1594736797933-d0501ba2fe65": "02-1594736797933-d0501ba2fe65.jpg",
  "1500534623283-312aade485b7": "03-1500534623283-312aade485b7.jpg",
  "1521587760476-6c12a4b040da": "04-1521587760476-6c12a4b040da.jpg",
  "1564399579883-451a5d44ec08": "05-1564399579883-451a5d44ec08.jpg",
  "1519681393784-d120267933ba": "06-1519681393784-d120267933ba.jpg",
  "1518005020951-eccb494ad742": "07-1518005020951-eccb494ad742.jpg",
  "1532012197267-da84d127e765": "08-1532012197267-da84d127e765.jpg",
  "1519682337058-a94d519337bc": "09-1519682337058-a94d519337bc.jpg",
  "1524231757912-21f4fe3a7200": "10-1524231757912-21f4fe3a7200.jpg",
  "1455390582262-044cdead277a": "11-1455390582262-044cdead277a.jpg",
  "1589254065878-42c9da997008": "12-1589254065878-42c9da997008.jpg",
  "1499750310107-5fef28a66643": "13-1499750310107-5fef28a66643.jpg",
  "1542751371-adc38448a05e": "14-1542751371-adc38448a05e.jpg",
  "1553484771-047a44eee27b": "15-1553484771-047a44eee27b.jpg",
  "1551288049-bebda4e38f71": "16-1551288049-bebda4e38f71.jpg",
  "1485846234645-a62644f84728": "17-1485846234645-a62644f84728.jpg",
  "1457369804613-52c61a468e7d": "18-1457369804613-52c61a468e7d.jpg",
  "1524995997946-a1c2e315a42f": "19-1524995997946-a1c2e315a42f.jpg",
  "1516321318423-f06f85e504b3": "20-1516321318423-f06f85e504b3.jpg",
  "1677442136019-21780ecad995": "21-1677442136019-21780ecad995.jpg",
  "1551650975-87deedd944c3": "22-1551650975-87deedd944c3.jpg",
  "1559028012-481c04fa702d": "23-1559028012-481c04fa702d.jpg",
  "1461749280684-dccba630e2f6": "24-1461749280684-dccba630e2f6.jpg"
};
const imageUrl = (id) => localImageFiles[id] ? `/site/images/${localImageFiles[id]}` : `/site/images/saif-ullah.jpg`;
const FALLBACK_IMAGE_URL = "https://images.unsplash.com/photo-1662667465161-d853dfa901ea?auto=format&fit=crop&w=1200&q=82";
const handleImageError = (event) => {
  const img = event.currentTarget;
  if (img.dataset.fallback) return;
  img.dataset.fallback = "1";
  img.src = FALLBACK_IMAGE_URL;
};

const navigation = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Expertise", id: "expertise" },
  { label: "Experience", id: "experience" },
  { label: "Projects", id: "projects" },
  { label: "Development", id: "development" },
  { label: "Languages", id: "languages" },
  { label: "Keyboards", id: "keyboards" },
  { label: "Contact", id: "contact" },
];

const languages = [
  ["العربية", "Arabic", "ara", "ar", "Native", "Arabic", imageUrl("1519817650390-64a93db511aa")],
  ["اردو", "Urdu", "urd", "ur", "Native / Expert", "اردو", imageUrl("1594736797933-d0501ba2fe65")],
  ["کوستَیں", "Indus-Kohistani", "mvy", "—", "Native fluency", "انڈس کوہستانی", imageUrl("1500534623283-312aade485b7")],
  ["English", "English", "eng", "en", "Fluent", "English", imageUrl("1521587760476-6c12a4b040da")],
  ["فارسی", "Persian", "fas", "fa", "Advanced", "فارسی", imageUrl("1564399579883-451a5d44ec08")],
  ["ݜݨیاٗ", "Shina", "scl", "—", "Advanced", "شینا", imageUrl("1519681393784-d120267933ba")],
  ["پښتو", "Pashto", "pus", "ps", "Professional", "پښتو", imageUrl("1518005020951-eccb494ad742")],
  ["پنجابی", "Punjabi", "pan", "pa", "Professional", "پنجابی", imageUrl("1532012197267-da84d127e765")],
  ["گوجری", "Gujri", "gju", "—", "Working", "گوجری", imageUrl("1519682337058-a94d519337bc")],
  ["Türkçe", "Turkish", "tur", "tr", "Working", "Türkçe", imageUrl("1524231757912-21f4fe3a7200")],
];

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
            <span className="brand-mark"><img src={`${import.meta.env.BASE_URL}images/CloudTrans-Logo%20-%20Copy.PNG`} alt="CloudTrans" /></span>
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
        <section id="home" className="hero-section">
          <div className="hero-background" aria-hidden="true"><img src={`${import.meta.env.BASE_URL}images/Gemini_Generated_Image_9y0o649y0o649y0o.jpg`} alt="" /></div>
          <div className="hero-background-overlay" aria-hidden="true" />
          <div className="container hero-grid">
            <div className="hero-content glass-panel">
              <p className="eyebrow">TRANSLATOR · LOCALIZATION · LANGUAGE TECHNOLOGY</p>
              <h1>Saif Ullah — Translator &amp; Localization Specialist<span>Language connects people, cultures and ideas.</span></h1>
              <p className="hero-description">Saif Ullah is a multilingual translator and localization specialist based in Gilgit, Pakistan, working across Arabic, Urdu, Persian, English, Indus-Kohistani and Shina, with a focus on game localization, LQA, MTPE, language technology and digital preservation.</p>
              <div className="hero-actions">
                <button className="button button-primary" onClick={() => scrollToSection("projects")}>Explore my work</button>
                <button className="button button-secondary" onClick={() => scrollToSection("contact")}>Get in touch</button>
              </div>
            </div>
            <div className="hero-profile">
              <div className="profile-frame glass-panel">
                <img className="profile-image" src={`${import.meta.env.BASE_URL}images/saif-ullah.jpg`} alt="Portrait of Saif Ullah, translator and localization specialist" loading="eager" onError={handleImageError} />
              </div>
              <div className="profile-caption glass-panel"><strong>Saif Ullah</strong><span>Translator & Localization Expert</span><a className="cv-download-button" href={`${import.meta.env.BASE_URL}images/SAIF%20ULLAH%20CV%202026.docx`} download target="_blank" rel="noreferrer">Download my CV <span aria-hidden="true">↓</span></a></div>
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
  ["Translation", imageUrl("1455390582262-044cdead277a")],
  ["Interpretation", imageUrl("1589254065878-42c9da997008")],
  ["Localization", imageUrl("1499750310107-5fef28a66643")],
  ["Game Localization", imageUrl("1542751371-adc38448a05e")],
  ["LQA & Linguistic Testing", imageUrl("1553484771-047a44eee27b")],
  ["MTPE", imageUrl("1551288049-bebda4e38f71")],
  ["Subtitling", imageUrl("1485846234645-a62644f84728")],
  ["Language Documentation", imageUrl("1457369804613-52c61a468e7d")],
  ["Digital Preservation", imageUrl("1524995997946-a1c2e315a42f")],
  ["Language Technology", imageUrl("1516321318423-f06f85e504b3")],
  ["AI & NLP", imageUrl("1677442136019-21780ecad995")],
  ["Multilingual Content", imageUrl("1499750310107-5fef28a66643")],
  ["AI-Assisted App Development", imageUrl("1551650975-87deedd944c3")],
  ["Web & App UI Design", imageUrl("1559028012-481c04fa702d")],
  ["Software Prototyping", imageUrl("1461749280684-dccba630e2f6")]
].map(([item, image],index)=><article className="expertise-card" key={item}><img src={image} alt="" aria-hidden="true" loading="lazy" onError={handleImageError} /><div className="expertise-card-content"><span>{String(index+1).padStart(2,"0")}</span><h3>{item}</h3></div></article>)}</div>
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
            <div className="section-heading"><h2>Selected work across language, localization and digital preservation.</h2></div>
            <div className="projects-grid">
              <article className="project-card project-featured"><img className="project-image" src={imageUrl("1455390582262-044cdead277a")} alt="Indus-Kohistani digital documentation and research workspace" loading="lazy" onError={handleImageError} /><span className="project-number">01</span><p>INDUS-KOHISTANI · FIKR&CD</p><h3>Indus-Kohistani Digital Preservation</h3><span className="project-line"/><p>FiKR&CD — Forum for Indus-Kohistani Research & Cultural Development — is a community-led initiative dedicated to documenting, preserving and digitally advancing the Indus-Kohistani language and cultural heritage.</p><p>Its digital platform brings together language resources, research, cultural documentation and preservation work in one accessible space.</p><a className="project-link" href="https://fikrcd.org/" target="_blank" rel="noreferrer">Visit the FiKR&CD Web Portal ↗</a></article>
              <article className="project-card"><img className="project-image" src={imageUrl("1499750310107-5fef28a66643")} alt="Digital work and localization workspace" loading="lazy" onError={handleImageError} /><span className="project-number">02</span><p>LOCALIZATION</p><h3>Saudi Ministry of Hajj & Umrah</h3><span className="project-line"/><p>Large-scale English and Arabic → Urdu and Persian translation, localization and linguistic quality work.</p></article>
              <article className="project-card"><img className="project-image" src={imageUrl("1542751371-adc38448a05e")} alt="Gaming and interactive media" loading="lazy" onError={handleImageError} /><span className="project-number">03</span><p>GAME LOCALIZATION</p><h3>PUBG MOBILE / World of Wonder</h3><span className="project-line"/><p>Urdu localization across UI, events and interactive content, including terminology management, MTPE and LQA.</p></article>
              <article className="project-card"><img className="project-image" src={imageUrl("1516321318423-f06f85e504b3")} alt="Digital language documentation and research" loading="lazy" onError={handleImageError} /><span className="project-number">04</span><p>LANGUAGE DOCUMENTATION</p><h3>Shina Language Documentation</h3><span className="project-line"/><p>Language verification and linguistic documentation of Shina-language media, including community-generated digital content.</p></article>
            </div>
          </div>
        </section>


        <section id="development" className="development-section" aria-labelledby="development-heading">
          <div className="container">
            <div className="development-heading">
              <div>
                <p className="section-label">05 — DIGITAL DEVELOPMENT</p>
                <h2 id="development-heading">Apps, websites and language tools — built with AI-assisted development.</h2>
              </div>
              <p>I design, prototype and build practical digital products that connect language expertise with AI, localization, research and everyday workflows.</p>
            </div>

            <div className="development-grid">
              <article className="development-card development-card-featured">
                <div className="development-card-top"><span>01</span><b>AI · LEGAL TECHNOLOGY</b></div>
                <div className="development-icon" aria-hidden="true">AI</div>
                <h3>Waraq Legal AI</h3>
                <p>Local-first legal research and drafting workspace combining Pakistani case-law data, multilingual workflows and AI-assisted document support.</p>
                <div className="development-tags"><span>React</span><span>AI / LLM</span><span>Local AI</span><span>Legal Data</span></div>
                <a href="https://github.com/xl8saif/Waraq-LegalAi" target="_blank" rel="noreferrer">View project on GitHub ↗</a>
              </article>

              <article className="development-card">
                <div className="development-card-top"><span>02</span><b>BUSINESS · WEB APP</b></div>
                <div className="development-icon" aria-hidden="true">W</div>
                <h3>WEMS</h3>
                <p>A bilingual management system for Waraq Enterprises, designed around practical business workflows, administration and multilingual UI.</p>
                <div className="development-tags"><span>Web App</span><span>EN / اردو</span><span>RTL</span><span>Admin</span></div>
                <a href="https://github.com/xl8saif/wemsapp" target="_blank" rel="noreferrer">View project on GitHub ↗</a>
              </article>

              <article className="development-card">
                <div className="development-card-top"><span>03</span><b>LANGUAGE · RESEARCH</b></div>
                <div className="development-icon" aria-hidden="true">ݜ</div>
                <h3>FiKR&CD Digital Platform</h3>
                <p>A bilingual research and preservation platform for Indus-Kohistani language, cultural documentation, datasets and community resources.</p>
                <div className="development-tags"><span>Research</span><span>Localization</span><span>Datasets</span><span>Preservation</span></div>
                <a href="https://fikrcd.pages.dev/" target="_blank" rel="noreferrer">Visit the platform ↗</a>
              </article>

              <article className="development-card">
                <div className="development-card-top"><span>04</span><b>CONTENT · AUTOMATION</b></div>
                <div className="development-icon" aria-hidden="true">QR</div>
                <h3>Quran Reels Maker</h3>
                <p>A concept and workflow for generating short-form Quran video content, with attention to Arabic text, typography, layouts and repeatable production.</p>
                <div className="development-tags"><span>Automation</span><span>Arabic UI</span><span>Content</span><span>Design</span></div>
              </article>

              <article className="development-card">
                <div className="development-card-top"><span>05</span><b>LANGUAGE TOOLS</b></div>
                <div className="development-icon" aria-hidden="true">ک</div>
                <h3>Multilingual Keyboard Tools</h3>
                <p>Practical Windows keyboard layouts supporting Urdu and Indus-Kohistani typing, digital communication and language preservation.</p>
                <div className="development-tags"><span>Windows</span><span>Urdu</span><span>Indus-Kohistani</span><span>Input Tools</span></div>
                <a href="#keyboards">Explore keyboard tools ↗</a>
              </article>

              <article className="development-card development-skills-card">
                <div className="development-card-top"><span>SKILLS</span><b>BUILDING WITH AI</b></div>
                <h3>Development skill set</h3>
                <div className="development-skill-list">
                  <span>AI-assisted / vibe coding</span><span>React & Vite</span><span>HTML / CSS / JavaScript</span>
                  <span>Responsive UI & RTL</span><span>GitHub & Git workflows</span><span>Data & dataset engineering</span>
                  <span>AI / LLM integration</span><span>Localization-aware product design</span><span>Cloud deployment</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="languages" className="content-section language-section language-section-v2">
          <div className="container">
            <div className="language-intro">
              <div>
                <p className="section-label">06 / LANGUAGES</p>
                <h2>Fluency is more than knowing <em>words.</em></h2>
                <p className="language-lead">It is knowing what they mean to the people who use them.</p>
              </div>
              <div className="language-summary">
                <strong>10</strong>
                <span>working languages</span>
                <small>Translation · Localization · Language Technology</small>
              </div>
            </div>
            <div className="languages-grid-v2">
              {languages.map(([native, english, iso3, iso1, level, typographicalName], index) => (
                <article className="language-card-v2" key={english}>
                  <div className="language-card-top">
                    <span className="language-index">0{index + 1}</span>
                    <span className="language-level-v2">{level}</span>
                  </div>
                  <div className="language-script-v2" dir="auto">{native}</div>
                  <div className="language-name-v2">
                    <h3>{english}</h3>
                    <span dir="auto">{typographicalName}</span>
                  </div>
                  <div className="language-codes-v2">
                    <span><b>639-3</b> {iso3}</span>
                    <span><b>639-1</b> {iso1}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="container contact-content">
            <p className="section-label">07 — CONTACT</p>
            <h2>Let's build better communication across languages.</h2>
            <a className="email-link" href="mailto:xl8.saif@gmail.com">xl8.saif@gmail.com</a>
            <div className="contact-links">
              <a className="contact-social contact-linkedin" href="https://www.linkedin.com/in/xl8saif/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <span className="contact-social-icon" aria-hidden="true"><img src="https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/linkedin.svg" alt="" /></span><span className="contact-social-label">LinkedIn</span>
              </a>
              <a className="contact-social contact-proz" href="https://www.proz.com/profile/3150554" target="_blank" rel="noreferrer" aria-label="ProZ">
                <span className="contact-social-icon contact-proz-icon" aria-hidden="true">ProZ</span><span className="contact-social-label">ProZ</span>
              </a>
              <a className="contact-social contact-upwork" href="https://www.upwork.com/freelancers/~011ed3711aa3cf98f4" target="_blank" rel="noreferrer" aria-label="Upwork">
                <span className="contact-social-icon" aria-hidden="true"><img src="https://cdn.simpleicons.org/upwork/14A800" alt="" /></span><span className="contact-social-label">Upwork</span>
              </a>
              <a className="contact-social contact-whatsapp" href="https://wa.me/923100989830" target="_blank" rel="noreferrer" aria-label="WhatsApp">
                <span className="contact-social-icon" aria-hidden="true"><img src="https://cdn.simpleicons.org/whatsapp/25D366" alt="" /></span><span className="contact-social-label">WhatsApp</span>
              </a>
              <a className="contact-social contact-facebook" href="https://www.facebook.com/share/p/1DZCDTed6U/" target="_blank" rel="noreferrer" aria-label="Facebook update">
                <span className="contact-social-icon" aria-hidden="true"><img src="https://cdn.simpleicons.org/facebook/1877F2" alt="" /></span><span className="contact-social-label">Facebook</span>
              </a>
            </div>
          </div>
        </section>

        <section id="keyboards" className="keyboard-downloads-section" aria-labelledby="keyboards-heading">
          <div className="container">
            <div className="keyboard-downloads-heading">
              <div>
                <p className="section-label">08 — WINDOWS KEYBOARDS</p>
                <h2 id="keyboards-heading">Language tools for everyday typing and digital preservation.</h2>
              </div>
              <p>Free Windows PC keyboard layouts developed for practical multilingual use.</p>
            </div>
            <div className="keyboard-downloads-grid">
              <article className="keyboard-download-card keyboard-ik-card">
                <div className="keyboard-card-top">
                  <span className="keyboard-card-label">INDUS-KOHISTANI</span>
                  <span className="keyboard-card-platform">WINDOWS PC</span>
                </div>
                <div className="keyboard-card-icon" aria-hidden="true">ک</div>
                <h3>Indus-Kohistani Windows PC Keyboard</h3>
                <div className="keyboard-card-arabic" lang="ur">انڈس کوہستانی کیبورڈ برائے وینڈوز</div>
                <p>Keyboard layout developed to support Indus-Kohistani typing and digital language preservation.</p>
                <div className="keyboard-card-credit">Developed by <strong>Mr. Hussain Ahmad Faizy</strong></div>
                <a className="keyboard-download-button keyboard-download-button-ik" href="https://drive.google.com/uc?export=download&amp;id=11rMn9Vn25DNhszk5sBh5n8f6IuwkJkU9" target="_blank" rel="noreferrer">Download for Windows ↗</a>
              </article>

              <article className="keyboard-download-card keyboard-urdu-card">
                <div className="keyboard-card-top">
                  <span className="keyboard-card-label">URDU</span>
                  <span className="keyboard-card-platform">WINDOWS PC</span>
                </div>
                <div className="keyboard-card-icon" aria-hidden="true">ا</div>
                <h3>Urdu Windows PC Keyboard</h3>
                <div className="keyboard-card-arabic" lang="ur">ورق اردو کیبورڈ برائے وینڈوز</div>
                <p>Windows keyboard layout developed for practical Urdu typing and multilingual work at Waraq Enterprises.</p>
                <div className="keyboard-card-credit">Developed by <strong>Saif Ullah Jailani · Waraq Enterprises</strong></div>
                <a className="keyboard-download-button keyboard-download-button-urdu" href="https://drive.google.com/uc?export=download&amp;id=1NL_SjDOh42GRiaD3GJWfVABQZUrnGU0M" target="_blank" rel="noreferrer">Download for Windows ↗</a>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container site-footer-inner">
          <div className="site-footer-copy">
            <span className="site-footer-project">A project of Waraq Enterprises, Gilgit</span>
            <strong>Developed &amp; Vibe Coded by: Saif Ullah Jailani</strong>
            <span>Waraq Enterprises, KIU Road, Court Area, Konodass, Gilgit, Pakistan - 15100</span>
          </div>
          <div className="site-footer-visitors" aria-label="Website visitors">
            <div className="site-footer-visitors-label">SITE VISITORS</div>
            <a className="site-footer-visitor-badge" href="https://visitorbadge.io/" target="_blank" rel="noreferrer" aria-label="Website visitor counter">
              <img src="https://api.visitorbadge.io/api/combined?path=https%3A%2F%2Fxl8saif.github.io%2Fsite%2F&label=VISITORS&labelColor=%231b2635&countColor=%232b6cb0" alt="Live website visitor counter" loading="lazy" />
            </a>
            <a className="site-footer-country-link" href="https://feed-pulse.com/site/xl8saif.github.io/flags" target="_blank" rel="noreferrer">View visitor countries ↗</a>
          </div>
          <div className="site-footer-brands" aria-label="Waraq Enterprises and CloudTrans">
            <div className="site-footer-brand site-footer-brand-waraq">
              <img src="/site/images/waraq-logo.png" alt="Waraq Enterprises" />
            </div>
            <div className="site-footer-brand site-footer-brand-cloudtrans">
              <img src="/site/images/CloudTrans-Logo - Copy.PNG" alt="CloudTrans" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;