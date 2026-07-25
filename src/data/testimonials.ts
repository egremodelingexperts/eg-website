export interface Testimonial {
  name: string;
  date: string;
  quote: string;
  detail?: string;
  featured?: boolean;
  wide?: boolean;
}

export const testimonials: Testimonial[] = [
  {
    name: "Michelle Baker",
    date: "3/25/25",
    quote:
      "Edy listens attentively and explains the process necessary for the repairs… his deconstruction is handled well and the reconstruction of these areas is meticulous.",
    detail:
      "Edy is professional in every aspect of solving the problems our home recently displayed. Our home has needed Edy’s abilities often over several years, including repairing damage from hot water pipes, floors, drywall, baseboards, painting and staining. Edy and his workers clean up completely and leave each area orderly.",
    featured: true,
  },
  {
    name: "Nancy",
    date: "2/11/25",
    quote:
      "We have been extremely pleased with their attention to detail, excellent work, and professionalism. Edy is trustworthy and follows through to make sure the job is done right.",
  },
  {
    name: "Rashad",
    date: "2/25/25",
    quote:
      "Edy did an excellent job in our kitchen. His crew installed a new sink, new backsplash, tile and painted. It looked like a brand new kitchen. He also screened in the patio and installed three patio doors.",
  },
  {
    name: "Sheena",
    date: "1/16/25",
    quote:
      "My remodeling project was completed to a high standard by their crew. His work crews were highly mindful of our demands, and the work was completed on schedule.",
  },
  {
    name: "Tania",
    date: "3/7/25",
    quote:
      "Edy and his crew did a beautiful job painting the outside of our home and modernizing the front of the house. Very dependable and professional.",
  },
  {
    name: "Anjie",
    date: "2/24/25",
    quote: "Edy has completed lots of projects at our house over the past 6 years.",
    detail:
      "He has repaired and painted an outdoor pergola, patched, repaired and retextured a ceiling after a plumbing leak, and painted many indoor rooms. He’s worked for friends and family too. Edy is an excellent worker and is also trustworthy and kind. I highly recommend Edy and team!",
    wide: true,
  },
];
