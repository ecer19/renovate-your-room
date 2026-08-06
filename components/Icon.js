import {
  BedDouble,
  Laptop2,
  Sofa,
  Baby,
  ChefHat,
  Bath,
  Droplet,
  Square,
  Armchair,
  TreePine,
  Cog,
  Sun,
  Gem,
  Coffee,
  Clock,
} from "lucide-react";

const ICONS = {
  bedroom: BedDouble,
  study: Laptop2,
  living: Sofa,
  kids: Baby,
  kitchen: ChefHat,
  bathroom: Bath,
  toilet: Droplet,

  minimal: Square,
  modern: Armchair,
  scandinavian: TreePine,
  industrial: Cog,
  bohemian: Sun,
  luxury: Gem,
  cozy: Coffee,
  vintage: Clock,
};

export default function Icon({ name, className = "h-6 w-6" }) {
  const Lucide = ICONS[name];
  if (!Lucide) return null;

  return <Lucide className={className} strokeWidth={1.75} aria-hidden="true" />;
}
