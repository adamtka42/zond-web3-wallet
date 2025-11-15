import { Label } from "@/components/UI/Label";
import { MoveLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type BackButtonProps = {
  navigationRoute?: string;
};

const BackButton = ({ navigationRoute }: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <div
      data-testid="backButtonTestId"
      className="flex w-min cursor-pointer items-center gap-2 pb-4 transition-all hover:-ml-1 hover:text-secondary"
      onClick={() =>
        navigationRoute ? navigate(navigationRoute) : navigate(-1)
      }
    >
      <MoveLeft />
      <Label className="cursor-pointer text-lg">Back</Label>
    </div>
  );
};

export default BackButton;
