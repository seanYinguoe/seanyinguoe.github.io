# Xiaoyuan (Sean) Ying — academic website

Personal academic website about architected structures, mechanical metamaterials, kirigami and inverse design.

**Website:** [xiaoyuanying.me](https://xiaoyuanying.me). Hosted on GitHub Pages; public release authorised by the owner on 9 October 2026.

## Update the website

Edit the relevant file, then commit and push to `main`. The GitHub Pages workflow checks, builds and publishes the website. It can also be run manually from the Actions tab.

| File | Content |
|---|---|
| `content/home.html` | Introduction, profile and research highlights |
| `content/research.html` | Research statement, ongoing work, themes and code |
| `content/publications.html` | Publication records |
| `content/bistable-note.html` | Illustrated bistability note at `/research/bistable-kirigami/` |
| `content/academic.html` | Education, presentations, teaching and skills |
| `static/style.css` | Typography, layout and responsive styles |
| `static/bistable-note.css`, `static/bistable-note.js` | Scoped note layout and original-animation playback controls |
| `static/assets/` | Profile photograph, research figure and geometric icons |
| `static/publications.bib` | Citation entries used by each paper's expandable BibTeX box |

Each publication uses a `{{BIBTEX:citationKey}}` marker in `content/publications.html`. The build inserts the matching entry from `static/publications.bib`; edit that file to update a citation. Visitors can expand an entry and copy it, or select its text manually if clipboard access is unavailable.

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

## Hosting and custom domain

The public website is hosted by GitHub Pages. The workflow uploads only `dist/`, not the entire repository. The output includes indexing metadata, canonical URLs and a sitemap. The private job tracker remains a separate authenticated application and is not hosted by GitHub Pages.

The custom domain is `xiaoyuanying.me`, managed through Namecheap BasicDNS and **Settings → Pages → Custom domain** in GitHub. The `www` CNAME points to `seanyinguoe.github.io`; the apex uses GitHub's four A records. Keep the GitHub ownership-verification TXT record in DNS. See [GitHub's custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) for the current values.

The publishing workflow uses the domain configured in GitHub Pages and generates HTTPS canonical URLs and a sitemap, including while a new certificate is being issued. If the domain changes, run the workflow again and update the local build's default address. HTTPS enforcement is managed in GitHub Pages settings once the certificate is ready. This Actions-based deployment does not require a `CNAME` file.

## Research illustrations and interaction

The research figure and photograph are supplied by the author. The photograph uses the approved natural lighting edit. Small kirigami and Kresling icons respond to hover, focus, press and touch; reduced-motion preferences are respected. The Kresling animation is illustrative geometry, not a rigid-folding solution or a force–displacement prediction.

The bistability note reuses original research figures and animations from the author’s SES presentation. See [asset provenance](docs/bistable-note-sources.md) before replacing its media. Playback is opt-in, supports keyboard controls and pauses when the example or page is hidden. The mapping pair shares playback and scrubbing controls; percentages refer to clip position, not physical strain. Native video controls remain available without JavaScript.
