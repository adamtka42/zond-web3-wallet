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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/UI/Dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/UI/Form";
import { Input } from "@/components/UI/Input";
import { Label } from "@/components/UI/Label";
import MnemonicWordListing from "@/components/QrlWeb3Wallet/ScreenLoader/Wallet/Body/CreateAccount/MnemonicDisplay/MnemonicWordListing/MnemonicWordListing";
import { getHexSeedFromMnemonic } from "@/functions/getHexSeedFromMnemonic";
import { useStore } from "@/stores/store";
import StringUtil from "@/utilities/stringUtil";
import { zodResolver } from "@hookform/resolvers/zod";
import { TFunction } from "i18next";
import Web3, { Web3BaseWalletAccount } from "@theqrl/web3";
import {
  Download,
  HardDriveDownload,
  MoveRight,
  Plus,
  Undo,
  X,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { ONBOARDING_STEPS, OnboardingStepType } from "../Onboarding";
import AccountAddressDisplay from "./AccountAddressDisplay/AccountAddressDisplay";

const createFormSchema = (t: TFunction) =>
  z.object({
    mnemonicPhrases: z.string().min(1, t("validation.mnemonicRequired")),
  });

type AddOrImportAccountProps = {
  selectStep: (step: OnboardingStepType) => void;
  addAnAccountToWallet: (account: Web3BaseWalletAccount) => Promise<void>;
};

const AddOrImportAccount = observer(
  ({ selectStep, addAnAccountToWallet }: AddOrImportAccountProps) => {
    const { qrlStore } = useStore();
    const { activeAccount } = qrlStore;
    const { accountAddress } = activeAccount;
    const hasAccount = !!accountAddress;
    const { t } = useTranslation();
    const FormSchema = createFormSchema(t);

    const [open, setOpen] = useState(false);
    const [addedAccount, setAddedAccount] = useState<
      Web3BaseWalletAccount | undefined
    >();

    const onDownload = () => {
      if (addedAccount) StringUtil.downloadRecoveryPhrases(addedAccount);
    };

    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      mode: "onChange",
      reValidateMode: "onSubmit",
      defaultValues: {
        mnemonicPhrases: "",
      },
    });

    const {
      handleSubmit,
      control,
      watch,
      formState: { isSubmitting, isValid },
    } = form;

    const onAddAccount = async () => {
      const { qrl } = new Web3();
      const account = qrl?.accounts?.create();
      setAddedAccount(account);
      await addAnAccountToWallet(account);
    };

    const onImportAccount = async (account: Web3BaseWalletAccount) => {
      await addAnAccountToWallet(account);
    };

    async function onSubmit(formData: z.infer<typeof FormSchema>) {
      try {
        const { qrl } = new Web3();
        const account = qrl.accounts.seedToAccount(
          getHexSeedFromMnemonic(formData.mnemonicPhrases.trim()),
        );
        if (account) {
          setOpen(false);
          form.reset();
          onImportAccount(account);
        } else {
          control.setError("mnemonicPhrases", {
            message: t("onboarding.account.importError"),
          });
        }
      } catch (error) {
        control.setError("mnemonicPhrases", {
          message: t("onboarding.account.importMnemonicError", { error: String(error) }),
        });
      }
    }

    const revoceryPhrasesDescription = t("onboarding.account.recoveryDescription");
    const continueWarning = t("onboarding.account.continueDialogWarning");

    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("onboarding.account.title")}</CardTitle>
          <CardDescription>
            {t("onboarding.account.description")}
          </CardDescription>
        </CardHeader>
        {hasAccount && (
          <CardContent>
            <AccountAddressDisplay />
          </CardContent>
        )}
        <CardFooter className="flex-col gap-4">
          {hasAccount ? (
            <>
              {addedAccount ? (
                <div className="flex w-full flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <div>{revoceryPhrasesDescription}</div>
                    <Button
                      className="w-full"
                      type="button"
                      variant="constructive"
                      onClick={onDownload}
                    >
                      <HardDriveDownload className="mr-2 h-4 w-4" />
                      {t("onboarding.account.downloadButton")}
                    </Button>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" type="button">
                        <MoveRight className="mr-2 h-4 w-4" />
                        {t("onboarding.account.continueButton")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-80 rounded-md">
                      <DialogHeader className="text-left">
                        <DialogTitle>{t("onboarding.account.continueDialogTitle")}</DialogTitle>
                        <DialogDescription>{continueWarning}</DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="flex flex-row gap-4">
                        <DialogClose asChild>
                          <Button
                            className="w-full"
                            type="button"
                            variant="outline"
                          >
                            <Undo className="mr-2 h-4 w-4" />
                            {t("onboarding.account.goBack")}
                          </Button>
                        </DialogClose>
                        <Button
                          className="w-full"
                          type="button"
                          onClick={() => {
                            selectStep(ONBOARDING_STEPS.COMPLETED);
                          }}
                        >
                          <MoveRight className="mr-2 h-4 w-4" />
                          {t("onboarding.account.continueButton")}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => {
                    selectStep(ONBOARDING_STEPS.COMPLETED);
                  }}
                >
                  <MoveRight className="mr-2 h-4 w-4" />
                  {t("onboarding.account.continueButton")}
                </Button>
              )}
            </>
          ) : (
            <>
              <Button className="w-full" onClick={onAddAccount}>
                <Plus className="mr-2 h-4 w-4" />
                {t("onboarding.account.createButton")}
              </Button>
              <Form {...form}>
                <form
                  className="w-full"
                  name="importAccountForm"
                  aria-label="importAccountForm"
                >
                  <Dialog open={open} onOpenChange={setOpen}>
                    <Button
                      className="w-full"
                      type="button"
                      onClick={() => {
                        form.reset();
                        setOpen(true);
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {t("onboarding.account.importButton")}
                    </Button>
                    <DialogContent className="w-80 rounded-md">
                      <DialogHeader className="text-left">
                        <DialogTitle>{t("onboarding.account.importDialogTitle")}</DialogTitle>
                      </DialogHeader>
                      <FormField
                        control={control}
                        name="mnemonicPhrases"
                        render={({ field }) => (
                          <FormItem>
                            <Label></Label>
                            <FormControl>
                              <Input
                                {...field}
                                aria-label={field.name}
                                autoComplete="off"
                                disabled={isSubmitting}
                                placeholder={t("onboarding.account.importPlaceholder")}
                                type="text"
                              />
                            </FormControl>
                            <FormDescription>
                              {t("onboarding.account.importDescription")}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <MnemonicWordListing mnemonic={watch().mnemonicPhrases} />
                      <DialogFooter className="flex flex-row gap-2">
                        <DialogClose asChild>
                          <Button
                            className="w-full"
                            type="button"
                            variant="outline"
                            aria-label="Cancel"
                          >
                            <X className="mr-2 h-4 w-4" />
                            {t("onboarding.account.importCancel")}
                          </Button>
                        </DialogClose>
                        <Button
                          className="w-full"
                          type="button"
                          disabled={isSubmitting || !isValid}
                          aria-label="Import"
                          onClick={handleSubmit(onSubmit)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          {t("onboarding.account.importSubmit")}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </form>
              </Form>
            </>
          )}
        </CardFooter>
      </Card>
    );
  },
);

export default AddOrImportAccount;
