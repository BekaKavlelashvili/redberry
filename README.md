# Redberry Boutique Website

Static concept site inspired by high-end multi-brand jewelry boutiques, tailored for the Redberry label.

## Project structure

- `index.html` – single-page layout showcasing collections, designers, services, and contact touchpoints.
- `css/style.css` – global styling, layout grids, responsive breakpoints, and component treatments.
- `js/main.js` – lightweight navigation toggle for mobile experience.
- `assets/` – placeholder directory for future imagery and media.

## Getting started

Open `index.html` in your browser or serve the directory with your preferred static file server to explore the site locally.

## Responsive design

The layout is mobile-first and optimized from very small devices (iPhone SE width ≈ 320px) up to desktop:

- Global safeguards prevent page-level horizontal scrolling on narrow screens.
- Cards, grids, and paddings compress below 360px to keep content comfortably within the viewport.
- Interactive horizontal carousels remain scrollable within their own containers without causing page-level overflow.

Key breakpoints used:

- ≤ 360px: Extra-tight spacing and smaller component paddings for iPhone SE class devices.
- ≤ 720px: Stack actions, adjust metrics layout, and full-width card actions.
- ≤ 860–880px: Mobile navigation overlay; mega menus adapt to vertical layout.
- ≤ 1024px: One-column layouts for complex sections (hero, capsule feature, contact, product details).
