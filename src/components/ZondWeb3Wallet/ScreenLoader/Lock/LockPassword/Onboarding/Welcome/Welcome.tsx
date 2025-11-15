import { Button } from "@/components/UI/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/UI/Card";
import { MoveRight } from "lucide-react";
import { ONBOARDING_STEPS, OnboardingStepType } from "../Onboarding";
import { useStore } from "@/stores/store";
import { cva } from "class-variance-authority";
import { observer } from "mobx-react-lite";

const videoClasses = cva("w-full scale-[2.5]", {
  variants: {
    isDarkMode: {
      true: ["rotate-90"],
      false: ["rotate-180"],
    },
  },
  defaultVariants: {
    isDarkMode: false,
  },
});

type WelcomeProps = {
  selectStep: (step: OnboardingStepType) => void;
};

const Welcome = observer(({ selectStep }: WelcomeProps) => {
  const { settingsStore } = useStore();
  const { isDarkMode, theme } = settingsStore;

  const videoSource = "qrl-video-".concat(theme).concat(".mp4");

  return (
    <Card className="animate-appear-in shadow-xl">
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
        <CardDescription className="break-words">
          Let's start using the Zond Web3 Wallet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative flex h-32 w-full overflow-hidden">
          <div className="absolute inset-0 z-10 flex flex-col justify-end text-lg text-secondary">
            <div className="opacity-50">We are</div>
            <div className="font-bold">The Quantum</div>
            <div className="font-bold">Resistant Ledger</div>
          </div>
          <video autoPlay muted loop className={videoClasses({ isDarkMode })}>
            <source
              src={videoSource}
              type="video/mp4"
              data-testid="welcome-video"
            />
          </video>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => selectStep(ONBOARDING_STEPS.SET_PASSWORD)}
        >
          <MoveRight className="mr-2 h-4 w-4" />
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
});

export default Welcome;
