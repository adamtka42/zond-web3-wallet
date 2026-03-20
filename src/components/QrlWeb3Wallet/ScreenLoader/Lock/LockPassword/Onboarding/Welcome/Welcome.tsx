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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const videoSource = "qrl-video-".concat(theme).concat(".mp4");

  return (
    <Card className="animate-appear-in shadow-xl">
      <CardHeader>
        <CardTitle>{t("welcome.title")}</CardTitle>
        <CardDescription className="break-words">
          {t("welcome.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative flex h-32 w-full overflow-hidden">
          <div className="absolute inset-0 z-10 flex flex-col justify-end text-lg text-secondary">
            <div className="opacity-50">{t("welcome.tagline1")}</div>
            <div className="font-bold">{t("welcome.tagline2")}</div>
            <div className="font-bold">{t("welcome.tagline3")}</div>
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
          {t("welcome.button")}
        </Button>
      </CardFooter>
    </Card>
  );
});

export default Welcome;
