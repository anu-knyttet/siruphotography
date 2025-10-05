import PhotoGallery from "@/app/portfolio/PhotoGallery";

interface ImageKitFile {
  url: string;
  name?: string;
}

async function getImages(category: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/imagekit?folder=${category}`, {
    cache: "force-cache",
  });

  const data = await res.json();
  return data.map((img: ImageKitFile, i: number) => ({
    id: i,
    src: img.url,
    alt: img.name || `Image ${i + 1}`,
    title: img.name || `Image ${i + 1}`,
  }));
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const images = await getImages(params.category);
  return (
    <div className="mx-auto px-6 py-20 max-w-7xl">
      <PhotoGallery images={images} />
    </div>
  );
}
