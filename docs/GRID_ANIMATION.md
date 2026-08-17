# Grid background

The background is selected with `gridBackground` in `data/siteMetadata.js`:

- `minimal` renders a static CSS grid and ambient glow.
- `animated` renders a CSS-only pulsing grid.
- `none` renders no background component.

Both implementations are Server Components. They do not measure the viewport, attach resize listeners, or add grid-line DOM nodes.
