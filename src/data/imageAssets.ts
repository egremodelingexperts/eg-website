import type { ImageMetadata } from "astro";
import mainBannerSource from "../assets/images/main_banner.jpg";
import craftingSource from "../assets/images/crafting_beautiful_and_functional_spaces.png";

export interface DiscoveredImage {
  src: ImageMetadata;
  caption: string;
  alt: string;
  filename: string;
}

type ImageModule = {
  default: ImageMetadata;
};

const naturalOrder = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

function filenameFromPath(path: string): string {
  return path.split("/").at(-1) ?? path;
}

function captionFromFilename(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/^\d+\s*[-–—_.]\s*/, "")
    .trim();
}

function discoverImages(modules: Record<string, ImageModule>): DiscoveredImage[] {
  return Object.entries(modules)
    .sort(([left], [right]) =>
      naturalOrder.compare(filenameFromPath(left), filenameFromPath(right)),
    )
    .map(([path, module]) => {
      const filename = filenameFromPath(path);
      const caption = captionFromFilename(filename);

      return {
        src: module.default,
        caption,
        alt: caption,
        filename,
      };
    });
}

const kitchenModules = import.meta.glob<ImageModule>(
  "../assets/images/portfolio/kitchen/*.{avif,jpeg,jpg,png,webp}",
  { eager: true },
);
const bathroomModules = import.meta.glob<ImageModule>(
  "../assets/images/portfolio/bathroom/*.{avif,jpeg,jpg,png,webp}",
  { eager: true },
);
const surfacesModules = import.meta.glob<ImageModule>(
  "../assets/images/portfolio/surfaces/*.{avif,jpeg,jpg,png,webp}",
  { eager: true },
);

export const kitchenImages = discoverImages(kitchenModules);
export const bathroomImages = discoverImages(bathroomModules);
export const surfacesImages = discoverImages(surfacesModules);

export const mainBannerImage: DiscoveredImage = {
  src: mainBannerSource,
  caption: "Main Banner",
  alt: "Luxury kitchen with custom cabinetry and a granite island",
  filename: "main_banner.jpg",
};

export const craftingImage: DiscoveredImage = {
  src: craftingSource,
  caption: "Crafting Beautiful and Functional Spaces",
  alt: "Crafting Beautiful and Functional Spaces",
  filename: "crafting_beautiful_and_functional_spaces.png",
};
