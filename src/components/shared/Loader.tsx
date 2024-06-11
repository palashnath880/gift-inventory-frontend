import logo from "../../assets/logo.webp";

export default function Loader({ dataLoading }: { dataLoading?: boolean }) {
  return (
    <>
      {dataLoading ? (
        <div className="h-[20vh] grid place-items-center">
          <div className="loader"></div>
        </div>
      ) : (
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
      )}
    </>
  );
}
