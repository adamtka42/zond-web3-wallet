import { Button } from "@/components/UI/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/UI/Card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/UI/Form";
import { Input } from "@/components/UI/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoveRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ONBOARDING_STEPS, OnboardingStepType } from "../Onboarding";

const FormSchema = z
  .object({
    password: z.string().min(8, "Password must be atleast 8 characters"),
    reEnteredPassword: z
      .string()
      .min(8, "Password must be atleast 8 characters"),
  })
  .refine((fields) => fields.password === fields.reEnteredPassword, {
    message: "Passwords doesn't match",
    path: ["reEnteredPassword"],
  });

type LockPasswordSetupProps = {
  selectStep: (step: OnboardingStepType) => void;
  setNewPassword: (password: string) => void;
};

const LockPasswordSetup = ({
  selectStep,
  setNewPassword,
}: LockPasswordSetupProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: {
      password: "",
      reEnteredPassword: "",
    },
  });
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValid },
  } = form;

  function onSubmit(formData: z.infer<typeof FormSchema>) {
    setNewPassword(formData?.reEnteredPassword);
    selectStep(ONBOARDING_STEPS.ADD_OR_IMPORT_ACCOUNT);
  }

  return (
    <Form {...form}>
      <form
        name="accountPasswordSetup"
        className="w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Card className="animate-appear-in shadow-xl">
          <CardHeader>
            <CardTitle>Set Wallet Password</CardTitle>
            <CardDescription className="break-words">
              Set a password for this wallet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      aria-label={field.name}
                      disabled={isSubmitting}
                      placeholder="Password"
                      type="password"
                    />
                  </FormControl>
                  <FormDescription>Enter a password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="reEnteredPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      aria-label={field.name}
                      disabled={isSubmitting}
                      placeholder="Re-enter Password"
                      type="password"
                    />
                  </FormControl>
                  <FormDescription>Re-enter the password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button disabled={!isValid} className="w-full">
              <MoveRight className="mr-2 h-4 w-4" />
              Continue
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default LockPasswordSetup;
