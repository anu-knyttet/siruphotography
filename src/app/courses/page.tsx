import Image from "next/image";
import { MorphingCard } from "./MorphingDialog";
import CallToAction from "@/components/CallToAction";

type ImageKitFile = {
  fileId: string;
  name: string;
  url: string;
};

export const metadata = {
  title: "Courses - Siru Photography",
  description: "Explore my curated courses and master your creative skills with hands-on learning.",
};

async function getCourses() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/imagekit?folder=courses`, {
    cache: "force-cache",
  });
  const data = (await res.json()) as ImageKitFile[];

  return data.map((img: ImageKitFile, i: number) => ({
    id: img.fileId,
    title: img.name || `Course ${i + 1}`,
    image: img.url,
  }));
}

export default async function CoursesPage() {
  const courses = await getCourses();
  return (
    <main className="bg-background min-h-screen text-foreground">
      {/* Hero Section */}
      <section className="relative px-6 py-4 overflow-hidden text-center">
        <div className="absolute inset-0 bg-secondary/30" />

        <div className="z-10 relative mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="mb-6 font-medium text-primary text-sm uppercase tracking-[0.2em]">Learn With Me</p>

            <div className="flex lg:flex-row flex-col justify-center items-center gap-8 lg:gap-16 mb-8">
              <h1 className="font-GFS-didot text-primary text-4xl md:text-6xl lg:text-7xl text-balance leading-[0.9]">
                Courses
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
      <section className="p-4">
        <p className="mx-auto mb-8 px-6 text-muted-foreground text-lg text-center leading-relaxed">
          Explore my curated courses and master your creative skills with hands-on learning.
        </p>
        <div className="gap-6 space-y-6 columns-2 sm:columns-2 md:columns-3 mx-auto max-w-6xl">
          {courses.map((course) => (
            <MorphingCard key={course.id} course={course} />
          ))}
        </div>
      </section>
      <CallToAction />
    </main>
  );
}
