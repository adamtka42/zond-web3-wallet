import { ROUTES } from "@/router/router";
import BackButton from "../../../Shared/BackButton/BackButton";
import ActiveChain from "./ActiveChain/ActiveChain";
import NewChain from "./NewChain/NewChain";
import OtherChains from "./OtherChains/OtherChains";

const ChainConnectivity = () => {
  return (
    <div className="flex flex-col gap-2 p-8">
      <BackButton navigationRoute={ROUTES.HOME} />
      <div className="flex flex-col gap-8">
        <NewChain />
        <ActiveChain />
        <OtherChains />
      </div>
    </div>
  );
};

export default ChainConnectivity;
