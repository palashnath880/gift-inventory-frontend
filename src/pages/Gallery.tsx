import {
  Alert,
  // Button,
  Dialog,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";
import PageHeader from "../components/shared/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { inventoryApi } from "../api/inventory";
import Loader from "../components/shared/Loader";
// import { Add } from "@mui/icons-material";
import {
  bindDialog,
  // bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";
// import GalleryImageUpload from "../components/shared/GalleryImageUpload";

interface Image {
  title: string;
  url: string;
  caption: string;
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

  // dialog
  const addPopup = usePopupState({
    variant: "popover",
    popupId: "uploadImage",
  });

  return (
    <div className="!pb-5">
      <PageHeader title="CSAT Gallery" />

      {/* <Button
        variant="contained"
        {...bindTrigger(addPopup)}
        className="!px-8 !py-2.5 !capitalize !text-sm"
        startIcon={<Add />}
      >
        Add Image
      </Button> */}

      {/* loader  */}
      {isLoading && <Loader dataLoading />}

      {isSuccess && data?.length > 0 && (
        <ImageList variant="masonry" cols={3} gap={20} className="!py-5 !px-2">
          {data.map(({ title, url, caption }, index) => (
            <ImageListItem
              key={index}
              className="!bg-[#fff] !overflow-hidden !shadow-xl"
            >
              <img
                draggable={false}
                src={url}
                alt={title}
                className="!w-full !h-auto"
              />
              {caption && (
                <div className="py-2 px-3 text-center">
                  <Typography className="!opacity-70">{caption}</Typography>
                </div>
              )}
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

      {/* upload dialog */}
      <Dialog {...bindDialog(addPopup)}>{/* <GalleryImageUpload */}</Dialog>
    </div>
  );
}
