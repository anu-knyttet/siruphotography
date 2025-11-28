import PhotoGallery from "@/app/portfolio/PhotoGallery";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const param = await params;
  const category = param.category;
  return {
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} Portfolio - Siru Photography`,
    description: `Explore the ${category} photography portfolio by Siru Bhurtel.`,
  };
}

interface ImageKitFile {
  fileId: string;
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
    fileId: img.fileId,
    src: img.url,
    alt: img.name || `Image ${i + 1}`,
    title: img.name || `Image ${i + 1}`,
  }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  const images = await getImages(category);
  return (
    <div className="mx-auto px-6 py-20 max-w-7xl">
      <PhotoGallery images={images} />
    </div>
  );
}
