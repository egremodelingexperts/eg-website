import type { ImageMetadata } from "astro";
import { bathroomImages, kitchenImages, surfacesImages } from "./imageAssets";

export interface GalleryImage {
  src: ImageMetadata;
  caption: string;
  alt: string;
}

export interface Gallery {
  id: string;
  number: string;
  title: string;
  description: string;
  images: GalleryImage[];
  note?: string;
}

export const kitchenGallery: Gallery = {
  id: "kitchens",
  number: "01",
  title: "Kitchen Remodeling",
  description:
    "Where culinary ambition meets architectural precision. Custom millwork and premium surfaces define our kitchen spaces.",
  images: kitchenImages,
};

export const bathroomGallery: Gallery = {
  id: "bathrooms",
  number: "02",
  title: "Bathroom Sanctuaries",
  description:
    "Tailored tile, clean lines and durable finishes create private spaces designed for everyday restoration.",
  images: bathroomImages,
};

export const surfacesGallery: Gallery = {
  id: "surfaces",
  number: "03",
  title: "Surfaces & Custom Details",
  description:
    "Distinctive flooring, custom built-ins and architectural features bring lasting character to every room.",
  images: surfacesImages,
  note: "All images represent real projects completed by the EG Remodeling Experts team.",
};

export const galleries: Gallery[] = [kitchenGallery, bathroomGallery, surfacesGallery];
