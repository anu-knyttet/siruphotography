import { MorphingCard } from "./MorphingDialog";
import Image from "next/image";
import CallToAction from "../../components/CallToAction";

const mockTeam = [
  {
    id: "1",
    name: "Siru Bhurtel",
    role: "Lead Photographer",
    bio: "Siru specializes in portrait and event photography, capturing moments with a creative eye.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    socials: { instagram: "#", linkedin: "#" },
  },
  {
    id: "2",
    name: "Mandira Rai",
    role: "Assistant Photographer",
    bio: "Ava brings energy and technical skill to every shoot, ensuring smooth sessions.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    socials: { instagram: "#", linkedin: "#" },
  },
  {
    id: "3",
    name: "Ruby Poudel",
    role: "Lighting Specialist",
    bio: "Liam crafts perfect lighting setups for both studio and outdoor shoots.",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
    socials: { instagram: "#", linkedin: "#" },
  },
  {
    id: "4",
    name: "Maya Rodriguez",
    role: "Editor & Retoucher",
    bio: "Maya polishes every photo to perfection with her expert editing skills.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    socials: { instagram: "#", linkedin: "#" },
  },
  {
    id: "5",
    name: "Noah Kim",
    role: "Studio Manager",
    bio: "Noah keeps the studio running smoothly and ensures every client is happy.",
    image: "https://randomuser.me/api/portraits/men/77.jpg",
    socials: { instagram: "#", linkedin: "#" },
  },
];

export default function TeamPage() {
  return (
    <main className="bg-background min-h-screen text-foreground">
      {/* Hero Section */}
      <section className="relative px-6 py-4 overflow-hidden text-center">
        <div className="absolute inset-0 bg-secondary/30" />
        <div className="z-10 relative mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="mb-6 font-medium text-primary text-sm uppercase tracking-[0.2em]">Our Team</p>
            <div className="flex lg:flex-row flex-col justify-center items-center gap-8 lg:gap-16 mb-8">
              <h1 className="font-serif font-light text-primary text-4xl md:text-6xl lg:text-7xl text-balance leading-[0.9]">
                Meet the Team
              </h1>
              <div className="w-48 md:w-56 lg:w-64">
                <Image
                  src="/mainlogo2.png"
                  alt="Siru Bhurtel Photography Logo"
                  width={256}
                  height={180}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            </div>
            <div className="bg-primary mx-auto mb-8 w-24 h-px" />
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="mx-auto mb-12 max-w-2xl text-muted-foreground text-lg text-center leading-relaxed">
          Our dedicated crew brings your moments to life.
        </div>
        <div className="gap-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mx-auto max-w-4xl">
          {mockTeam.map((member) => (
            <MorphingCard key={member.id} member={member} />
          ))}
        </div>
      </section>
      <CallToAction />
    </main>
  );
}
