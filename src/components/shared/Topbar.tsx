import { Chip, Typography } from "@mui/material";
import { useAppSelector } from "../../hooks";

export default function Topbar() {
  // react-redux
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="bg-white py-3 shadow-md flex justify-between px-5">
      <Typography variant="h6" className="!font-medium !text-primary">
        <strong>CSC:</strong> {user?.branch}
      </Typography>
      <div className="flex items-center gap-3">
        <Typography variant="h6" className="!font-medium !text-primary">
          <strong>Hello,</strong> {user?.name}
        </Typography>
        <Chip
          variant="filled"
          color="primary"
          label={<Typography variant="body1">{user?.role}</Typography>}
        />
      </div>
    </div>
  );
}
