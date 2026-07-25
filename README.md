# EG Remodeling Experts Website

The public website for **EG Remodeling Experts**, a remodeling company serving
Fort Worth, DFW, and surrounding areas.

The site is a static Astro website hosted with GitHub Pages. It contains no
backend, CMS, analytics, or general contact-form database. Consultation
requests are collected through the company-owned Google Form.

## Website pages

| Page           | Address          |
| -------------- | ---------------- |
| Home           | `/`              |
| Portfolio      | `/portfolio/`    |
| Reviews        | `/reviews/`      |
| Consultation   | `/consultation/` |
| Privacy policy | `/privacy/`      |

The site also includes a branded not-found page and redirects for legacy Wix
addresses.

## Business owner guide

### What happens when changes are pushed

Pushing to the `main` branch automatically runs the validation and browser
tests. **A push does not publish the website.**

Publishing is a separate, manually started GitHub Actions workflow named
**Deploy to GitHub Pages**.

### The two deployment choices

The deployment workflow asks which target to use:

- **`repository-preview`** publishes a pre-launch preview at
  <https://egremodelingexperts.github.io/eg-website/>.
- **`custom-domain`** publishes the production build for
  <https://egremodelingexperts.com/>.

GitHub Pages keeps only **one active deployment for this repository**. Each
deployment replaces the previous one.

> After the custom domain goes live, always choose `custom-domain`. Running
> `repository-preview` afterward can replace the production artifact with a
> build that has incorrect paths for the live domain.

### Publishing a preview before launch

1. Open the repository on GitHub.
2. Select **Actions**.
3. Select **Deploy to GitHub Pages**.
4. Select **Run workflow**.
5. Choose **`repository-preview`**.
6. Wait for the workflow to finish, then open the GitHub Pages preview.

### Going live and publishing future updates

At launch, configure the custom domain and DNS as described in
[the domain cutover guide](docs/domain-cutover/README.md), then run **Deploy to
GitHub Pages** with **`custom-domain`**.

For every normal website update after launch:

1. Confirm the **Validate site** workflow passed for the latest `main` commit.
2. Run **Deploy to GitHub Pages** manually.
3. Choose **`custom-domain`**.
4. Confirm the live homepage and the changed page work correctly.

The GitHub Pages address acts as an entry point to the configured custom
domain after launch; it is not a second independent website.

### Adding portfolio photographs

Portfolio images are loaded automatically from these folders:

- `src/assets/images/portfolio/kitchen/`
- `src/assets/images/portfolio/bathroom/`
- `src/assets/images/portfolio/surfaces/`

The filename becomes the public caption. An optional number at the beginning
controls the order without appearing in the caption:

```text
01 - Custom Walnut Kitchen Island.jpg
02 - Granite Countertops and Cabinetry.jpg
```

The first image in each folder is also the corresponding specialty image on
the Home page. Use descriptive filenames and review every photo before making
the repository public. Supported formats are AVIF, JPEG/JPG, PNG, and WebP.
More details are in the [image guide](src/assets/images/README.md).

### Business information and reviews

- Phone, email, hours, location, Instagram, navigation, domain, and Google Form
  URLs are centralized in `src/config/site.ts`.
- Portfolio section descriptions are in `src/data/galleries.ts`.
- Customer reviews are in `src/data/testimonials.ts`.
- Privacy-policy content is in `src/pages/privacy/index.astro`.

These are code files. If someone is not comfortable editing them, ask a
developer to make the change and review the resulting preview before
publishing.

### Rollback

The previous Wix DNS values and rollback instructions are recorded in
[docs/domain-cutover/README.md](docs/domain-cutover/README.md). Keep the Wix
site and subscription available during the agreed post-launch observation
period so the old website can be republished if needed.

Private screenshots and account-specific evidence belong in
`docs/domain-cutover/private/`. That directory is intentionally ignored by Git
and must never be committed.

## Developer guide

### Technology

- Astro with TypeScript
- Tailwind CSS 4 through the Vite integration
- Local EB Garamond and Manrope font packages
- Playwright and Axe for browser and accessibility tests
- GitHub Actions and GitHub Pages for validation and hosting

### Requirements

- Node.js 24
- npm

Install dependencies and start the development server:

```bash
npm ci
npm run dev
```

Astro prints the local development address in the terminal, normally
`http://localhost:4321`.

### Commands

| Command                       | Purpose                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------ |
| `npm run dev`                 | Start the local development server                                             |
| `npm run check`               | Run Astro and TypeScript checks                                                |
| `npm run build`               | Run public-repository checks, type checks, build, and built-link validation    |
| `npm run build:production`    | Add production content gates to the normal build                               |
| `npm run preview`             | Serve the most recent local build                                              |
| `npm test`                    | Run Playwright browser and accessibility tests                                 |
| `npm run check:public`        | Check tracked files for forbidden private paths and common credential patterns |
| `npm run validate:production` | Reject missing Google Form or privacy-policy production content                |
| `npm run validate:build`      | Check built links and prohibit remote Stitch/Wix asset hotlinks                |

Run the main local verification sequence before pushing:

```bash
npm run build
npm test
```

### Build targets

Astro reads `DEPLOY_BASE_PATH` to generate links and assets for the selected
host:

```bash
# GitHub repository preview
DEPLOY_BASE_PATH=/eg-website npm run build:production

# Custom domain
DEPLOY_BASE_PATH=/ npm run build:production
```

The deployment workflow sets this value automatically. Do not deploy the
repository-preview build to the live custom domain.

### Project structure

```text
.github/workflows/       Validation and manual Pages deployment
docs/domain-cutover/     Public DNS configuration and rollback documentation
public/                  Static metadata files, favicon, robots, and Open Graph image
scripts/                 Repository, production, and built-site validation
src/assets/              Local brand, icon, and project imagery
src/components/          Shared header, footer, carousel, lightbox, and contact UI
src/config/              Typed public business configuration
src/data/                Typed galleries, image discovery, and testimonials
src/layouts/             Shared page and redirect shells
src/pages/               Astro routes
src/styles/              Global design system and responsive styles
tests/                   Playwright and Axe acceptance tests
```

Portfolio images are discovered at build time with `import.meta.glob`. Carousel
counts and tests adapt to the number of images in each portfolio folder,
including a gallery containing only one image.

### Public repository safety

This repository is designed to be publicly visible. Public business contact
information, normal website copy, image filenames, and DNS routing records are
not secrets. Never commit:

- passwords, tokens, API keys, cookies, or recovery codes;
- billing or payment information;
- private customer or employee information;
- `.env` or `.npmrc` credentials;
- Wix or GitHub account screenshots containing private metadata; or
- anything inside `docs/domain-cutover/private/`.

The automated public-repository check is a safety net, not a substitute for
reviewing changes before committing them.

## Deployment and domain documentation

Detailed DNS values, verification commands, launch steps, and Wix rollback
values are maintained in
[docs/domain-cutover/README.md](docs/domain-cutover/README.md).
