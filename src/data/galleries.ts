import type { ImageMetadata } from "astro";
import heroKitchen from "../assets/images/hero-kitchen.jpg";
import kitchenService from "../assets/images/kitchen-service.jpg";
import livingMain from "../assets/images/living-main.jpg";
import tileDetail from "../assets/images/tile-detail.jpg";
import bathroomProject from "../assets/images/bathroom-project.jpg";
import vanityDetail from "../assets/images/vanity-detail.jpg";

export interface GalleryImage {
  src: ImageMetadata;
  alt: string;
}

export interface Gallery {
  id: string;
  title: string;
  description: string;
  images: GalleryImage[];
}

export const galleries: Gallery[] = [
  {
    id: "kitchens",
    title: "Kitchen Remodeling",
    description:
      "Where culinary ambition meets architectural precision. Custom millwork and premium surfaces define our kitchen spaces.",
    images: [
      {
        src: heroKitchen,
        alt: "Luxury kitchen with dark wood cabinetry, granite island and pendant lighting",
      },
      {
        src: kitchenService,
        alt: "Warm custom kitchen remodeling project with detailed cabinetry",
      },
      {
        src: livingMain,
        alt: "Open living space featuring detailed millwork and a refined finish",
      },
    ],
  },
  {
    id: "bathrooms",
    title: "Bathroom Sanctuaries",
    description:
      "Tailored tile, clean lines and durable finishes create private spaces designed for everyday restoration.",
    images: [
      {
        src: tileDetail,
        alt: "Custom hexagonal floor tile with dark grout beside white cabinetry",
      },
      {
        src: bathroomProject,
        alt: "Completed bathroom remodeling project with premium finishes",
      },
      {
        src: vanityDetail,
        alt: "Bathroom vanity and tile detail from a completed remodeling project",
      },
    ],
  },
];
