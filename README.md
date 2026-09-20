# Saif Ullah — Professional Portfolio

A production-ready static website for Saif Ullah, a multilingual translator, localization expert and language preservation specialist.

**Live URL:** https://xl8saif.github.io/site

---

## File Structure

```
├── index.html              # Main HTML file
├── style.css               # Stylesheet
├── script.js               # JavaScript
├── public/
│   ├── images/
│   │   └── saif-ullah.jpg  # Your professional portrait (place here)
│   ├── sitemap.xml         # Sitemap
│   └── robots.txt          # Robots file
└── README.md               # This file
```

---

## Setup Instructions

### 1. Place Your Portrait

Copy your professional portrait to:

```
public/images/saif-ullah.jpg
```

**Important:** Do not rename the file. The HTML references this exact path.

### 2. Configure the Contact Form (Formspree)

The hiring form uses **Formspree** for form submission on static hosting.

**Why Formspree?**
- Works with GitHub Pages (static hosting)
- Handles file attachments
- Provides spam protection
- Sends email notifications
- No backend server required

**Setup Steps:**

1. Go to https://formspree.io/register and create a free account.
2. Create a new form.
3. Copy your form endpoint URL (looks like `https://formspree.io/f/xxxxxxxx`).
4. Open `index.html` and find this line in the form:
   ```html
   <form class="hire-form" id="hire-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST" ...>
   ```
5. Replace `YOUR_FORM_ID` with your actual Formspree form ID.
6. Commit and push to GitHub.

**Formspree Free Plan Limits:**
- 50 submissions per month
- File attachments up to 10MB
- Basic spam protection

**Alternative Services:**
If you prefer not to use Formspree, you can also use:
- **Getform** (https://getform.io)
- **FormSubmit** (https://formsubmit.co)
- ** Basin** (https://usebasin.com)

Simply replace the `action` URL in the form tag with your chosen service endpoint.

### 3. Deploy to GitHub Pages

1. Push all files to your repository (`xl8saif.github.io`).
2. Go to repository **Settings → Pages**.
3. Select source: **Deploy from a branch** → **main** → **/(root)**.
4. Wait 1–2 minutes for deployment.
5. Visit https://xl8saif.github.io/

---

## Features

- **Dual Professional Identity:** Commercial translation/localization + Language preservation specialist
- **Glassmorphism Design:** Premium translucent UI with backdrop blur
- **Six Language Cards:** Arabic, Urdu, Indus Kohistani, English, Persian, Shina — with verified ISO codes
- **Language-Specific Hiring Modal:** Auto-populates selected language, includes slide verification
- **Mobile-First Responsive:** Fully functional on desktop, tablet and mobile
- **Accessibility:** Semantic HTML, ARIA labels, keyboard navigation, focus states, reduced-motion support
- **SEO Optimized:** Meta tags, Open Graph, canonical URL, sitemap, robots.txt
- **Performance:** Lightweight, no external libraries, lazy-loaded images
- **Google Search Console:** Verification tag preserved

---

## Verified ISO Codes

| Language | ISO 639-1 | ISO 639-3 |
|----------|-----------|-----------|
| Arabic | ar | ara |
| Urdu | ur | urd |
| Indus Kohistani | — | mvy |
| English | en | eng |
| Persian (Farsi) | fa | fas |
| Shina | — | scl |

---

## Social Links Verified

- LinkedIn: https://www.linkedin.com/in/xl8saif/
- Upwork: https://www.upwork.com/freelancers/~011ed3711aa3cf98f4
- ProZ: https://www.proz.com/profile/3150554
- GitHub: https://github.com/xl8saif
- Website: https://xl8saif.github.io/
- Facebook: https://www.facebook.com/khalid.tasmim
- WhatsApp: https://wa.me/923100989830
- Email: xl8.saif@gmail.com

---

## No Overclaims Policy

This portfolio uses evidence-based language only. No claims of "world's leading," "UN partner," "official representative," or unsaved credentials are made. All projects, clients and capabilities are documented as stated by Saif Ullah.

---

## License

© Saif Ullah. All rights reserved.
