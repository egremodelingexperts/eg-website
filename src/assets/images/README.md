# Website image folders

Images are discovered automatically when the site builds. Copy files into the appropriate folder
and commit them with the rest of the site.

## Folder structure

- `home_banner.jpg` — Home page hero image.
- `crafting_beautiful_and_functional_spaces.png` — Home About image and Consultation hero.
- `portfolio/kitchen/` — Kitchen portfolio carousel.
- `portfolio/bathroom/` — Bathroom portfolio carousel.
- `portfolio/surfaces/` — Surfaces and custom-details portfolio carousel.

## Portfolio filenames

Use the filename as the image caption, with an optional numeric ordering prefix:

```text
01 - Custom Walnut Kitchen Island.jpg
02 - Granite Countertops and Cabinetry.jpg
```

The numeric prefix controls carousel order and is removed from the visible caption. The first image
in each portfolio folder is also used as its corresponding Home page specialty cover.

Supported formats are AVIF, JPEG, JPG, PNG and WebP. Avoid `/`, `\`, `:`, `?`, `#` and `%` in
filenames.
