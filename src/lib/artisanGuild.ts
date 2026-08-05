/** Featured partner for the Art section — local makers marketplace. */
export const ARTISAN_GUILD = {
  name: "The Villages Artisan Guild",
  url: "https://thevillagesartisanguild.com/",
  shopUrl: "https://thevillagesartisanguild.com/shop",
  artistsUrl: "https://thevillagesartisanguild.com/artists",
  consignUrl: "https://thevillagesartisanguild.com/consign",
  blurb:
    "A marketplace for makers in The Villages — handcrafted pottery, kiln-formed glass, and original paintings. Shop secure online, or join as a consigning artist.",
  tagline: "Local artists, one curated shop",
  mediums: [
    {
      label: "Pottery",
      note: "Wheel-thrown and hand-built stoneware — mugs, vessels, planters, and sculptural forms.",
      href: "https://thevillagesartisanguild.com/shop?medium=pottery",
    },
    {
      label: "Glass fusion",
      note: "Kiln-formed bowls, panels, trays, and suncatchers that catch Florida light.",
      href: "https://thevillagesartisanguild.com/shop?medium=glass",
    },
    {
      label: "Paintings",
      note: "Original oils and acrylics — landscapes, florals, figures, and still lifes.",
      href: "https://thevillagesartisanguild.com/shop?medium=painting",
    },
  ],
} as const;
