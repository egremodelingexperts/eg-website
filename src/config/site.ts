export interface NavItem {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  legalName: string;
  siteUrl: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  location: string;
  hours: string;
  instagram: string;
  navigation: NavItem[];
  consultationForm: {
    embedUrl: string;
    publicUrl: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "EG Remodeling Experts",
  legalName: "EG Remodeling Experts",
  siteUrl: "https://egremodelingexperts.com",
  phoneDisplay: "(817) 862-1380",
  phoneHref: "tel:+18178621380",
  email: "egpaintingandmore@gmail.com",
  location: "Fort Worth, TX 76116",
  hours: "Mon–Fri | 8:00 AM–5:00 PM",
  instagram: "https://www.instagram.com/egremodelingexperts/",
  navigation: [
    { label: "Portfolio", href: "/portfolio/" },
    { label: "Reviews", href: "/reviews/" },
  ],
  consultationForm: {
    // FORM_URL_PENDING: replace both values with the company-owned, login-free Google Form.
    embedUrl: "",
    publicUrl: "",
  },
};
