import logo from "../../assets/logo.webp";

export default function Loader() {
  return (
    <div className="w-screen h-screen grid place-items-center">
      <div className="animate-pulse">
        <img
          src={logo}
          alt="logo"
          className="w-40 max-w-[90%] h-auto"
          draggable={false}
        />
      </div>
    </div>
  );
}
