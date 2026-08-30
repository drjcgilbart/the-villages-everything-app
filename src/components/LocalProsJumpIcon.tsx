/**
 * Jump-chip icons in the same style as My Retirement Reboot’s home buttons:
 * a single recognizable emoji beside the label.
 */
const ICONS: Record<string, string> = {
  Electricians: "⚡",
  Plumbers: "🚿",
  "HVAC & Air Conditioning": "❄️",
  "Landscaping & Lawn Care": "🌿",
  "Landscaping & Lawn": "🌿",
  "Lightning Protection": "🌩️",
  "Aluminum Screens & Enclosures": "🪟",
  "Pools — Build & Service": "🏊",
  "Birdcages & Lanai Enclosures": "🐦",
  "Driveways, Pavers & Staining": "🧱",
  Roofing: "🏠",
  Painting: "🎨",
  "Pressure Washing & Window Cleaning": "💦",
  "Cleaning & Organizing": "🧹",
  "Garage Doors": "🚪",
  "Irrigation & Sprinklers": "💧",
  "Pest Control": "🐛",
  "Solar Energy": "☀️",
  "Concrete & Hardscape": "🪨",
  "Tree Service": "🌳",
  "Handyman & Remodeling": "🔧",
  "Home & Handyman": "🔧",
  Flooring: "🪵",
  "Security Systems": "🔒",
  "Moving & Hauling": "📦",
  "Appliance Repair": "🔌",
  "Golf Cart Service": "⛳",
  "Golf Cart & Auto": "⛳",
  "Gutter Cleaning & Installation": "🌧️",
  "Fence & Gate": "🚧",
  "Hair Salons": "💇",
  "Nail Salons": "💅",
  Barbers: "💈",
  "Spas & Massage": "💆",
  "Health & Wellness": "💚",
  "Pet Grooming": "✂️",
  Veterinarians: "🩺",
  "Dog Walkers": "🦮",
  "Pet Sitting": "🐶",
  Pets: "🐾",
  "House Sitting": "🏡",
  "Home Watch": "👁️",
  "Tech & Computers": "💻",
  "Music & Lessons": "🎵",
  "Arts, Crafts & Makers": "🎭",
  "Professional Services": "💼",
  "Food & Catering": "🍷",
  Other: "⭐",
  directory: "📋",
  list: "✍️",
};

export function LocalProsJumpIcon({ category }: { category: string }) {
  return (
    <span className="local-pros-jump-icon" aria-hidden="true">
      {ICONS[category] || "⭐"}
    </span>
  );
}
