import { Outlet } from "react-router-dom";

const Body = () => {
  return (
    <div className="relative w-full shrink-0">
      <Outlet />
    </div>
  );
};

export default Body;
