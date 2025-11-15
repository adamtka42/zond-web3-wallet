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
import { Loader, LockKeyholeOpen } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useStore } from "@/stores/store";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

const FormSchema = z.object({
  password: z.string().min(1, "Enter your password"),
});

const LockPasswordCheck = observer(() => {
  const { lockStore } = useStore();
  const { unlock } = lockStore;

  const [unlockAttempt, setUnlockAttempt] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
      setFocus("password");
    }, 0);
  }, [unlockAttempt]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValid },
    setError,
    setFocus,
  } = form;

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    window.scrollTo(0, 0);
    const unlocked = await unlock(formData.password);
    if (!unlocked) {
      setError("password", {
        message: "The entered password is incorrect",
      });
    }
    setUnlockAttempt((attempt) => attempt + 1);
  }

  return (
    <Form {...form}>
      <form
        name="accountUnlock"
        className="w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Card className="animate-appear-in shadow-xl">
          <CardHeader>
            <CardTitle>Unlock Wallet</CardTitle>
            <CardDescription className="break-words">
              Unlock the wallet with your password
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                  <FormDescription>Enter the wallet password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              disabled={isSubmitting || !isValid}
              className="w-full"
              type="submit"
            >
              {isSubmitting ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LockKeyholeOpen className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? "Unlocking" : "Unlock"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
});

export default LockPasswordCheck;
