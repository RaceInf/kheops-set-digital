export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  ebook: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Olivier Mensah",
    role: "Freelance",
    avatar: "/images/testimonials/Oliver Mensah.jpg",
    content: "Les astuces sont concrètes et directes à appliquer. Mon CA a vraiment décollé grâce à ce guide. Je le recommande !",
    rating: 5,
    ebook: "La Méthodologie de la Vente"
  },
  {
    id: "2",
    name: "Fatou Zagré",
    role: "Responsable Marketing",
    avatar: "/images/testimonials/Fatou Zagre.jpg",
    content: "Un rapport qualité-prix exceptionnel. Chaque franc investi rapporte gros. Ce livre est un must pour les marketeurs.",
    rating: 5,
    ebook: "Devenir un CM de Choc"
  },
  {
    id: "3",
    name: "Aïssata Traoré",
    role: "Community Manager",
    avatar: "/images/testimonials/Aissata traore.jpg",
    content: "Ce guide est devenu mon outil quotidien. Il est indispensable pour gérer mes réseaux sociaux. Une vraie mine d'or.",
    rating: 5,
    ebook: "Devenir un CM de Choc"
  },
  {
    id: "4",
    name: "François Mbella",
    role: "Entrepreneur",
    avatar: "/images/testimonials/Francois Mbella.jpg",
    content: "Ces e-books ont boosté mon activité comme jamais. La qualité est exceptionnelle. Je suis vraiment impressionné.",
    rating: 5,
    ebook: "La Méthodologie de la Vente"
  },
  {
    id: "5",
    name: "Marie Njock",
    role: "Chargée de Communication",
    avatar: "/images/testimonials/Marie Njock.jpg",
    content: "Des conseils précis et faciles à implémenter. Je recommande à 100%. Un investissement qui vaut vraiment le coup.",
    rating: 5,
    ebook: "Devenir un CM de Choc"
  },
  {
    id: "6",
    name: "Karim Tcham",
    role: "Consultant Digital",
    avatar: "",
    content: "La clarté des explications est remarquable. Les exemples sont pertinents. Un excellent guide pour ma stratégie digitale.",
    rating: 5,
    ebook: "La Méthodologie de la Vente"
  }
]; 