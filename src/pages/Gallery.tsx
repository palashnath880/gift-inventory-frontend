import { ImageList, ImageListItem } from "@mui/material";
import { useEffect, useState } from "react";
import PageHeader from "../components/shared/PageHeader";

interface Image {
  title: string;
  url: string;
}

export default function Gallery() {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("data.json");
      let data = await res.json();
      data = data.map((item: any) => ({
        title: item?.alt_description,
        url: item?.urls?.small,
      }));

      setImages(data);
    })();
  }, []);

  return (
    <div className="!pb-10">
      <PageHeader title="Inventory Gallery" />
      <ImageList variant="masonry" cols={3} gap={20}>
        {images.map(({ title, url }, index) => (
          <ImageListItem
            key={index}
            className="!rounded-lg !overflow-hidden !shadow-lg"
          >
            <img src={url} alt={title} className="!w-full !h-auto" />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
}
