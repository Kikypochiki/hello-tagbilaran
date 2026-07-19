import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hello Tagbilaran",
    short_name: "Hello Tagbilaran",
    description:
      "A paper-journal guide to the history and places of Tagbilaran City, Bohol.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4e8ce",
    theme_color: "#005c09",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
