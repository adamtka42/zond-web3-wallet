import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/UI/Accordion";
import { useStore } from "@/stores/store";
import { utils } from "@theqrl/web3";
import { observer } from "mobx-react-lite";

type TransactionType = { to: string; value: string };

const WalletSendCallsTransactions = observer(() => {
  const { dAppRequestStore } = useStore();
  const { dAppRequestData } = dAppRequestStore;

  const paramsObject = dAppRequestData?.params[0];
  const { calls } = paramsObject;

  const transactions: TransactionType[] = calls ?? [];

  return (
    <Accordion type="multiple" className="w-full space-y-4">
      {transactions.map(({ to, value }, index) => {
        return (
          <AccordionItem value={to} className="border-b-0">
            <AccordionTrigger className="rounded-md bg-muted p-2">
              Transaction {index + 1}
            </AccordionTrigger>
            <AccordionContent className="mt-2 rounded-md p-2 text-xs">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <div>To Address</div>
                  <div className="break-all font-bold text-secondary">{to}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <div>Amount</div>
                  <div className="font-bold text-secondary">
                    {utils.fromWei(value, "ether")} ZND
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
});

export default WalletSendCallsTransactions;
