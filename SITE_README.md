# theexousiamatt.com — Slab-inspired portfolio

This branch is a separate, custom-coded portfolio for theexousiamatt.com.
It is **not** the original Framer project or a CMS export.
The existing mattt.wtf portfolio is unchanged.

## Deployment
Hostinger site: theexousiamatt.com
Git source: theexousiamatt/theexousiamatt
Branch: site/theexousiamatt-slab
Type: static HTML
Auto-deploy: enabled

## Editing
All site code, styling, project data, and interactions are in `index.html`.
Find `var projects=[` to edit project titles, descriptions, tags, year, links and cover artwork.
Replace illustrative treatment panels with approved project imagery when ready.

The Eatly project currently tries to load one portfolio image from mattt.wtf.
It has a built-in CSS fallback if that cross-site image cannot load.

## Features
- Responsive grid, archive, and discipline filters
- Menu overlay, light/dark mode toggle with Lagos time-based default
- Lagos clock, preloader, project detail panels
- SEO/OG tags, social links and email contact
- Reduced-motion support

## Notes
This implementation recreates the visual direction of the free Slab Framer template,
but does not provide the template's original Framer CMS or identical scroll transitions.
The initial project artwork includes editorial treatment panels rather than final client-approved project cover exports.
