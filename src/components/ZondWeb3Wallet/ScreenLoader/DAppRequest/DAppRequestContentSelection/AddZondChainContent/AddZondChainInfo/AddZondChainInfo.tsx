import { Card } from "@/components/UI/Card";
import AddZondChainAlert from "./AddZondChainAlert/AddZondChainAlert";
import AddZondChainDetails from "./AddZondChainDetails/AddZondChainDetails";

const AddZondChainInfo = () => {
  return (
    <Card className="flex flex-col gap-4 p-4">
      <AddZondChainDetails />
      <AddZondChainAlert />
    </Card>
  );
};

export default AddZondChainInfo;
