import { Add, Close, Delete } from "@mui/icons-material";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  Divider,
  Fab,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import PopupState, { bindDialog, bindTrigger } from "material-ui-popup-state";
import { FormEventHandler, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminApi } from "../../api/admin";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Loader from "../../components/shared/Loader";
import { fetchAssets } from "../../features/admin/adminSlice";
import type { AssetsType } from "../../types";

interface AssetsBoxProps {
  title: string;
  total: number;
  emptyMsg: string;
  data: AssetsType[];
  post_type: "customer_type" | "project" | "csc";
  dataLoading: boolean;
}

const AssetsBox = ({
  title,
  total,
  emptyMsg,
  post_type,
  dataLoading,
  data,
}: AssetsBoxProps) => {
  // states
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // redux
  const dispatch = useAppDispatch();

  // add dialog title
  const dialogTitle =
    post_type === "customer_type"
      ? "Add New Customer Type"
      : post_type === "project"
      ? "Add New Project"
      : "Add New CSC";

  // add dialog label
  const inputLabel =
    post_type === "customer_type"
      ? "Customer Type"
      : post_type === "project"
      ? "Project"
      : "CSC";

  // success message
  const successMsg =
    post_type === "customer_type"
      ? "Customer Type Added Successfully"
      : post_type === "project"
      ? "Project Added Successfully"
      : "CSC Added Successfully";

  // exists message
  const existsMsg =
    post_type === "customer_type"
      ? "Customer Type Already Exists"
      : post_type === "project"
      ? "Project Already Exists"
      : "CSC Already Exists";

  // add handler
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await adminApi.createAssets(post_type, input);
      setInput("");
      toast.success(successMsg);
    } catch (err) {
      const error = err as AxiosError<{ code: "exists" }>;
      if (error.response?.data?.code === "exists") {
        setError(existsMsg);
      } else {
        toast.error("Sorry! Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  // delete handler
  const handleDelete = async (id: number | string) => {
    try {
      await adminApi.deleteAsset(id);
      dispatch(fetchAssets());
      toast.success("Deleted Successfully");
    } catch (err) {
      toast.error("Sorry! Couldn't Be Deleted");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <Typography variant="h6" className="!text-primary !font-semibold">
          {title}
          <span className="!ml-2 !text-black">({total})</span>
        </Typography>

        {/* add dialog */}
        <PopupState variant="popover">
          {(popupState) => (
            <>
              <Fab size="small" color="primary" {...bindTrigger(popupState)}>
                <Add />
              </Fab>

              <Dialog {...bindDialog(popupState)}>
                <div className="max-sm:w-[95%] w-[400px] px-5 py-5">
                  <div className="flex justify-between items-center pb-1 border-b border-primary">
                    <Typography
                      variant="h6"
                      className="!text-primary !font-semibold"
                    >
                      {dialogTitle}
                    </Typography>
                    <IconButton onClick={popupState.close}>
                      <Close />
                    </IconButton>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="mt-5 flex flex-col gap-5">
                      <TextField
                        fullWidth
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        label={inputLabel}
                      />
                      {error && (
                        <Typography className="!text-red-500 !text-center">
                          {error}
                        </Typography>
                      )}

                      <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        className="!py-3 !text-sm !capitalize"
                        disabled={Boolean(!input) || loading}
                        startIcon={
                          loading && (
                            <CircularProgress size={20} color="inherit" />
                          )
                        }
                      >
                        {dialogTitle}
                      </Button>
                    </div>
                  </form>
                </div>
              </Dialog>
            </>
          )}
        </PopupState>
      </div>
      <Divider className="!bg-primary !my-3" />

      {/* loader */}
      {dataLoading && <Loader dataLoading />}

      {/* data display */}
      {!dataLoading && (
        <>
          {data?.length > 0 ? (
            <List>
              {data?.map(({ id, name, createdAt }) => (
                <ListItem
                  key={id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => handleDelete(id)}
                    >
                      <Delete />
                    </IconButton>
                  }
                  className="!pl-0 !border-b !mb-1"
                >
                  <span className="flex flex-col">
                    <Typography className="!text-primary">{name}</Typography>
                    <Typography variant="body2">{createdAt}</Typography>
                  </span>
                </ListItem>
              ))}
            </List>
          ) : (
            <Alert severity="error">
              <Typography>{emptyMsg}</Typography>
            </Alert>
          )}
        </>
      )}
    </>
  );
};

export default function Home() {
  // get assets
  const { branches, customerTypes, projects, loading } = useAppSelector(
    (state) => state.assets
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAssets());
  }, []);

  return (
    <div>
      <div className="flex gap-4 items-start">
        <div className="flex-1 bg-white px-4 py-5 rounded-md shadow-xl">
          <AssetsBox
            title="Customer Type"
            total={20}
            data={customerTypes}
            dataLoading={loading}
            post_type="customer_type"
            emptyMsg="Customer Type Not Found"
          />
        </div>
        <div className="flex-1 bg-white px-4 py-5 rounded-md shadow-xl">
          <AssetsBox
            title="Project"
            total={20}
            data={projects}
            dataLoading={loading}
            post_type="project"
            emptyMsg="Project Not Found"
          />
        </div>
        <div className="flex-1 bg-white px-4 py-5 rounded-md shadow-xl">
          <AssetsBox
            title="Branch"
            total={20}
            data={branches}
            dataLoading={loading}
            post_type="csc"
            emptyMsg="Branch Not Found"
          />
        </div>
      </div>
    </div>
  );
}
