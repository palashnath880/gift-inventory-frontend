import { Alert, ImageList, ImageListItem, Typography } from "@mui/material";
import PageHeader from "../components/shared/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { inventoryApi } from "../api/inventory";
import Loader from "../components/shared/Loader";

interface Image {
  title: string;
  url: string;
}

export default function Gallery() {
  // fetch gallery images
  const { data, isLoading, isSuccess } = useQuery<Image[]>({
    queryKey: ["images"],
    queryFn: async () => {
      const res = await inventoryApi.getImages();
      return res.data;
    },
  });

  return (
    <div className="!pb-10">
      <PageHeader title="CSAT Gallery" />

      {/* loader  */}
      {isLoading && <Loader dataLoading />}

      {isSuccess && data?.length > 0 && (
        <ImageList variant="masonry" cols={3} gap={20}>
          {data.map(({ title, url }, index) => (
            <ImageListItem
              key={index}
              className="!rounded-lg !overflow-hidden !shadow-lg"
            >
              <img src={url} alt={title} className="!w-full !h-auto" />
            </ImageListItem>
          ))}
        </ImageList>
      )}

      {/* error message */}
      {isSuccess && data?.length <= 0 && (
        <div className="!mt-5">
          z
          <Alert severity="error">
            <Typography variant="body1">No Images Here</Typography>
          </Alert>
        </div>
      )}
    </div>
  );
}
