"use client";
import { useEffect, useState } from "react";
import { MorphingCard } from "./MorphingDialog";
import { Loader } from "lucide-react";

type ImageKitFile = {
  fileId: string;
  name: string;
  url: string;
  height: number;
  width: number;
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
    height: img.height,
    width: img.width,
  }));
}

export default function CourseGrid() {
  const [courses, setCourses] = useState<{ id: string; title: string; image: string; height: number; width: number }[]>(
    []
  );
  useEffect(() => {
    async function loadCourses() {
      const res = await getCourses();
      setCourses(res);
    }
    loadCourses();
  }, []);

  return (
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
  );
}
