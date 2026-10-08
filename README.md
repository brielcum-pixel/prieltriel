# Dave Mark · Tattoo Artist · Custom Tattoos

Dark editorial portfolio site. Monochrome, artwork first, consultation led.

## Add the real tattoo photos

Save the 8 supplied photos into `assets/tattoos/` with these exact names.
Full mapping is in `assets/tattoos/README.txt`.

- saint-shoulder.jpg · back-piece.jpg · angel-sleeve.jpg
- saint-forearm.jpg · bat-shoulder.jpg · ramen-bowl.jpg
- cat-outline.jpg · script-forearm.jpg

Export JPG at 1600px long edge, quality 80 to 85. The gallery,
selected work, and styles sections pick them up automatically.
Missing files show a labeled placeholder, never a broken icon.

## Update content in one place

- Contact email and form endpoint: `site.config.js`
  (`contactEmail`, `formEndpoint`). Leave `formEndpoint` empty
  to use the mailto fallback. Set it to a real API URL when ready.
- Portfolio entries: `PORTFOLIO` array at the top of `script.js`.
  Add one entry per new photo. Categories: black-grey, fine-line,
  custom, meaningful.
- Contact details and socials: `index.html` contact section.
  Placeholders are labeled and easy to replace.
- Legal copy: `privacy.html`, `terms.html`. Current copy is
  structured placeholder text, ready for final legal wording.

## Content rules

Nothing is faked. No invented testimonials, awards, press, locations,
years of experience, pricing, or availability. Unknown details use
labeled placeholders.

## Deploy

```
git add -A
git commit -m "Describe the change"
git push origin main
```

Live via GitHub Pages (branch `main`, root). `.nojekyll` is included
so `assets/` paths resolve as written.
