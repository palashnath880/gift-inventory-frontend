import { useState } from "react";
import { StockType } from "../../types";
import { Button } from "@mui/material";
import { Close, Done } from "@mui/icons-material";
import toast from "react-hot-toast";
import { stockApi } from "../../api/stock";

export default function StockReceiveAction({
  refetch,
  stock,
}: {
  refetch: () => void;
  stock: StockType;
}) {
  // states
  const [loading, setLoading] = useState<boolean>(false);

  // status update handler
  const actionHandler = async (status: "rejected" | "received") => {
    try {
      setLoading(true);
      await stockApi.stockStatusUpdate(stock.id, { status });
      if (status === "received") {
        toast.success("Stock receive successfully.");
      } else {
        toast.success("Stock rejected.");
      }

      refetch();
    } catch (err) {
      setLoading(false);
      toast.error("Sorry! Something went wrong");
    }
  };

  if (stock.status !== "open") {
    return "";
  }

  return (
    <span className="flex items-center gap-4 justify-end">
      <Button
        variant="contained"
        className="!py-2.5 !px-6 !text-sm !capitalize"
        color="success"
        startIcon={<Done />}
        disabled={loading}
        onClick={() => actionHandler("received")}
      >
        Accept
      </Button>
      <Button
        variant="contained"
        className="!py-2.5 !px-6 !text-sm !capitalize"
        color="error"
        startIcon={<Close />}
        disabled={loading}
        onClick={() => actionHandler("rejected")}
      >
        Reject
      </Button>
    </span>
  );
}
