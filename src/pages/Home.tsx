import { Typography } from "@mui/material";
import img1 from "../assets/home-card-1.jpg";
import img2 from "../assets/home-card-2.jpg";
import img3 from "../assets/home-card-3.jpg";
import { useAppSelector } from "../hooks";

const Card = ({
  title,
  subtitle,
  image,
  currency,
}: {
  title: string;
  subtitle: undefined | number;
  image: string;
  currency?: boolean;
}) => {
  return (
    <div className="aspect-video rounded-xl shadow-md overflow-hidden relative">
      <img src={image} className="w-full h-full object-cover" alt={title} />
      <div className="absolute top-0 left-0 w-full h-full bg-primary bg-opacity-30 pl-6 pb-6 flex flex-col justify-end">
        <Typography
          variant="h2"
          className="text-white !font-semibold flex items-start"
        >
          {currency && <span className="!text-3xl mt-2">&#2547;</span>}
          {subtitle}
        </Typography>
        <Typography className="!text-[#f2f2f2]" variant="h6">
          {title}
        </Typography>
      </div>
    </div>
  );
};

export default function Home() {
  // react-redux
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div>
      <div className="grid grid-cols-3 gap-5">
        <Card
          image={img3}
          subtitle={user?.availableBal}
          title="Available Balance"
          currency
        />
        <Card
          image={img2}
          subtitle={user?.assignedBal}
          title="Consumed Balance"
          currency
        />
        <Card image={img1} subtitle={user?.issuedGift} title="Issued Gift" />
      </div>
    </div>
  );
}
