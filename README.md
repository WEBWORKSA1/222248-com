# 222248.com — Launch in 48

Free 48-hour launch planner, startup calculators, guides, curated videos and a monthly build challenge — monetized with Google AdSense, done-for-you launch leads, sponsorships and donations.

- Static Jekyll site for **GitHub Pages (free plan)**. Shared header, footer and AdSense code live in `_layouts/default.html`; each page holds only its content.
- Styles: `assets/css/style.css` · Script: `assets/js/main.js` (theme, planner, calculators, forms, countdowns, video facades).
- Forms post via AJAX to a form backend; the destination inbox is encoded in `main.js` and never appears in plain text. The first submission sends a one-time activation email to the inbox — click it once.
- `ads.txt`, `robots.txt`, `sitemap.xml`, `CNAME` (222248.com) are at the root.

## Publish
1. Settings → Pages → Build and deployment → **Deploy from a branch** → `main` / `/ (root)`.
2. DNS for 222248.com: A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; CNAME `www` → `webworksa1.github.io`. Then tick **Enforce HTTPS**.

See `BUILD-PROMPTS.md` for the phase-wise build prompts and `RESEARCH.md` for the research and benchmark.

Trademark: "222248" is used only as a domain identifier; no exclusive rights are claimed. See `/trademark.html`.
