import { Button } from "@/components/UI/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/UI/Card";
import { Check } from "lucide-react";

const OnboardingCompleted = () => {
  return (
    <Card className="animate-appear-in shadow-xl">
      <CardHeader>
        <CardTitle>That's All</CardTitle>
        <CardDescription className="break-words">
          The Zond Web3 Wallet is now ready for use. You can open it from the
          browser extensions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative flex h-32 w-full overflow-hidden">
          <img
            src="onboarding-completed.png"
            data-testid="onboarding-completed"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => window.close()}>
          <Check className="mr-2 h-4 w-4" />
          Done
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OnboardingCompleted;
