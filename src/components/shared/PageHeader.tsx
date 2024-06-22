import { ArrowBack } from "@mui/icons-material";
import { Divider, IconButton, Typography } from "@mui/material";
import { useEffect } from "react";

export default function PageHeader({ title }: { title: string }) {
  useEffect(() => {
    document.title = `CSAT Portal - ${title}`;
  }, [title]);

  return (
    <div className="pb-7">
      <div className="flex items-center gap-4 pb-2">
        <IconButton color="primary" onClick={() => window.history.back()}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" className="!font-semibold !text-primary">
          {title}
        </Typography>
      </div>
      <Divider className="!bg-primary" />
    </div>
  );
}
