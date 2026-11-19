# The Exousia Matt — Slab-inspired portfolio

This branch is the custom-coded portfolio deployed to **theexousiamatt.com**.

## Status
- Independent static website; it does not change the existing mattt.wtf portfolio.
- Home, visual archive and 9 project detail routes.
- Responsive layouts, project category filters, menu, color theme, Lagos clock.
- Case study content stored in `content/projects.js`.
- Self-hosted project imagery for Eatly and Botswana Tech Fund, plus Tiana artwork exported from the owner's Figma file.
- The Jerin case study includes an explicitly labeled archival Ordo UI study. This is not presented as final Jerin branding.
- Remaining project previews use restrained typographic treatments until actual approved project imagery is provided.
- These case studies are editorial presentations; this site does not duplicate Framer's native CMS.

## Updating projects
Edit `content/projects.js`, and add approved files to `media/`. Every project has a prerendered HTML route under `projects/[slug]/index.html`. Keep the two in sync if routes are renamed.

## Deployment
Hostinger website: theexousiamatt.com
Repository: theexousiamatt/theexousiamatt
Branch: site/theexousiamatt-slab
Auto deployment: enabled, static.

## Outstanding verification
- Visual browser QA across common viewport widths and browsers (not completed in the connector environment).
- Verify full reference fidelity against Slab's own Framer interactions.
- Complete authentic visuals for the remaining projects.
