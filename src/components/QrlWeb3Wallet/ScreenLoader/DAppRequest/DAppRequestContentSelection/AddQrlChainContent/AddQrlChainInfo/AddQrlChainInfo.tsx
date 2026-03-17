import { Card } from "@/components/UI/Card";
import AddQrlChainAlert from "./AddQrlChainAlert/AddQrlChainAlert";
import AddQrlChainDetails from "./AddQrlChainDetails/AddQrlChainDetails";

const AddQrlChainInfo = () => {
  return (
    <Card className="flex flex-col gap-4 p-4">
      <AddQrlChainDetails />
      <AddQrlChainAlert />
    </Card>
  );
};

export default AddQrlChainInfo;
