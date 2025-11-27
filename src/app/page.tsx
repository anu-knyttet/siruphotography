import HomeClient from "./ImagePreloader";

const imagesToPreload = [
  "/LandingHero.webp",
  "/LandingHero2.webp",
  "/LandingHero3.webp",
  "/Hero0.webp",
  "/Hero1.webp",
  "/Hero2.webp",
  "/Hero3.webp",
  "/Hero4.webp",
  "/Hero5.webp",
  "/Hero6.webp",
];

export default function Page() {
  return <HomeClient imagesToPreload={imagesToPreload} />;
}
