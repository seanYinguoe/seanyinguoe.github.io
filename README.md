# Xiaoyuan (Sean) Ying — academic website

Personal academic website about architected structures, mechanical metamaterials, kirigami and inverse design.

**Website:** [seanyinguoe.github.io](https://seanyinguoe.github.io/)

## Update the website

Edit the relevant file, then commit and push to `main`. GitHub Actions checks and publishes the website automatically.

| File | Content |
|---|---|
| `content/home.html` | Introduction, profile and research highlights |
| `content/research.html` | Research statement, ongoing work, themes and code |
| `content/publications.html` | Publication records |
| `content/academic.html` | Education, presentations, teaching and skills |
| `static/style.css` | Typography, layout and responsive styles |
| `static/assets/` | Profile photograph, research figure and geometric icons |
| `static/publications.bib` | Downloadable citations |

This repository contains only the public website. The private job tracker and unpublished drafts are managed separately and are not included in its source, history or deployment.

## Preview locally

Use Python 3 and Node.js 22 or later. No package installation is needed.

```sh
node scripts/test_structure_icons.mjs
python3 scripts/build_site.py
python3 scripts/check_site.py
python3 -m http.server 8080 --directory dist --bind 127.0.0.1
```

Open `http://localhost:8080`. Generated output in `dist/` is ignored by Git; the hosting workflow builds it afresh. If changing the icon geometry, run `node scripts/render_structure_icons.mjs` and commit the refreshed fallback SVGs as well.

## Hosting and a future custom domain

The repository's **Settings → Pages → Source** is **GitHub Actions**. The workflow uploads only `dist/`, not the entire repository. Public pages allow search-engine indexing and include canonical URLs and a sitemap; appearing in search results is not immediate or guaranteed.

A custom domain can be connected later without redesigning the site. Verify the domain in GitHub, add it under **Settings → Pages → Custom domain**, then configure its DNS using [GitHub's custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). After connection, run the publishing workflow again so canonical URLs and the sitemap use the custom domain. Enable HTTPS once available.

## Research illustrations and interaction

The research figure and photograph are supplied by the author. The photograph uses the approved natural lighting edit. Small kirigami and Kresling icons respond to hover, focus, press and touch; reduced-motion preferences are respected. The Kresling animation is illustrative geometry, not a rigid-folding solution or a force–displacement prediction.
