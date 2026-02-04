/**
 * ImportLedger - Main component for importing accounts from Ledger device.
 *
 * This component provides a step-by-step wizard for:
 * 1. Connecting to a Ledger device via WebHID
 * 2. Selecting accounts to import (with pagination)
 * 3. Confirming successful import
 *
 * The component uses ledgerStore for state management and automatically
 * handles device connection/disconnection events.
 */

import { Button } from "@/components/UI/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/UI/Card";
import BackButton from "@/components/ZondWeb3Wallet/ScreenLoader/Shared/BackButton/BackButton";
import { LEDGER_ERROR_MESSAGES } from "@/constants/ledger";
import { ROUTES } from "@/router/router";
import { LedgerAccount } from "@/services/ledger/ledgerTypes";
import { useStore } from "@/stores/store";
import StorageUtil from "@/utilities/storageUtil";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader,
  Usb,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type ImportStep = "connect" | "select" | "success";

const ACCOUNTS_PER_PAGE = 5;

const ImportLedger = observer(() => {
  const navigate = useNavigate();
  const { ledgerStore, zondStore } = useStore();
  const {
    connectionError,
    isConnected,
    isConnecting,
    accounts,
    isLoadingAccounts,
    deviceInfo,
  } = ledgerStore;

  const [step, setStep] = useState<ImportStep>("connect");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [selectedAccountsMap, setSelectedAccountsMap] = useState<
    Map<string, LedgerAccount>
  >(new Map());
  const [alreadyImportedAddresses, setAlreadyImportedAddresses] = useState<
    Set<string>
  >(new Set());
  const [importError, setImportError] = useState<string>("");

  const newlySelectedCount = selectedAccountsMap.size;

  const handleConnect = async () => {
    setImportError("");
    try {
      await ledgerStore.connect();
    } catch (error) {
      setImportError(
        error instanceof Error
          ? error.message
          : LEDGER_ERROR_MESSAGES.CONNECTION_FAILED
      );
    }
  };

  // Load previously imported account addresses from storage
  useEffect(() => {
    if (step === "select") {
      StorageUtil.getAllAccounts().then((allAddresses) => {
        const addressSet = new Set(
          allAddresses.map((a) => a.toLowerCase())
        );
        setAlreadyImportedAddresses(addressSet);
      });
    }
  }, [step]);

  // Move to account selection after successful connection
  useEffect(() => {
    if (isConnected && step === "connect") {
      setStep("select");
      setCurrentPage(0);
      ledgerStore.fetchPageAccounts(ACCOUNTS_PER_PAGE, 0).catch((error) => {
        setImportError(
          error instanceof Error
            ? error.message
            : "Failed to load accounts from device"
        );
      });
    }
  }, [isConnected, step]);

  const isAlreadyImported = (address: string): boolean => {
    return alreadyImportedAddresses.has(address.toLowerCase());
  };

  const isSelected = (address: string): boolean => {
    return selectedAccountsMap.has(address.toLowerCase());
  };

  // Handle account selection toggle
  const toggleAccountSelection = (account: LedgerAccount) => {
    if (isAlreadyImported(account.address)) return;

    setSelectedAccountsMap((prev) => {
      const next = new Map(prev);
      const key = account.address.toLowerCase();
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.set(key, account);
      }
      return next;
    });
  };

  // Navigate to a specific page
  const goToPage = async (page: number) => {
    if (page < 0) return;
    setImportError("");
    try {
      setCurrentPage(page);
      await ledgerStore.fetchPageAccounts(
        ACCOUNTS_PER_PAGE,
        page * ACCOUNTS_PER_PAGE
      );
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : "Failed to load accounts"
      );
    }
  };

  const handlePrevPage = () => goToPage(currentPage - 1);
  const handleNextPage = () => goToPage(currentPage + 1);

  // Handle import confirmation
  const handleImportSelected = async () => {
    if (selectedAccountsMap.size === 0) {
      setImportError("Please select at least one account to import");
      return;
    }

    setImportError("");

    try {
      const newAccounts = Array.from(selectedAccountsMap.values());

      // Add selected accounts to the main wallet account list
      for (const account of newAccounts) {
        await StorageUtil.addLedgerAccountToAllAccounts(account.address);
      }

      // Merge with existing stored Ledger accounts (not overwrite)
      const existingLedgerAccounts = await StorageUtil.getLedgerAccounts();
      const existingAddressSet = new Set(
        existingLedgerAccounts.map((a) => a.address.toLowerCase())
      );
      const accountsToAdd = newAccounts.filter(
        (a) => !existingAddressSet.has(a.address.toLowerCase())
      );
      const mergedAccounts = [...existingLedgerAccounts, ...accountsToAdd];
      await StorageUtil.setLedgerAccounts(mergedAccounts);

      // Refresh the main account list in zondStore
      await zondStore.fetchAccounts();

      console.log("[ImportLedger] Imported accounts:", newAccounts.length);
      setStep("success");
    } catch (error) {
      console.error("[ImportLedger] Failed to import accounts:", error);
      setImportError(
        error instanceof Error ? error.message : "Failed to import accounts"
      );
    }
  };

  // Handle finishing the import
  const handleFinish = () => {
    navigate(ROUTES.HOME);
  };

  // Disconnect Ledger when leaving the page
  useEffect(() => {
    return () => {
      ledgerStore.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 p-8">
      <BackButton />

      {/* Step 1: Connect Device */}
      {step === "connect" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Usb className="h-5 w-5" />
              Connect Ledger Device
            </CardTitle>
            <CardDescription>
              Connect your Ledger device and open the QRL Zond app to import
              accounts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4 text-sm">
              <p className="font-medium">Before connecting:</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>Connect your Ledger device via USB</li>
                <li>Unlock your device with your PIN</li>
                <li>Open the QRL Zond app on your device</li>
              </ul>
            </div>

            {(connectionError || importError) && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{connectionError || importError}</span>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Usb className="mr-2 h-4 w-4" />
                  Connect Ledger
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 2: Select Accounts */}
      {step === "select" && (
        <Card>
          <CardHeader>
            <CardTitle>Select Accounts</CardTitle>
            <CardDescription>
              {deviceInfo && (
                <span className="text-xs text-muted-foreground">
                  Connected to {deviceInfo.model} (v{deviceInfo.version})
                </span>
              )}
              <br />
              Choose which accounts you want to import from your Ledger device.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingAccounts && accounts.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Loading accounts...
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                {accounts.map((account) => {
                  const imported = isAlreadyImported(account.address);
                  const selected = isSelected(account.address);

                  return (
                    <div
                      key={account.address}
                      className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                        imported
                          ? "border-muted bg-muted/30 cursor-default"
                          : selected
                            ? "border-primary bg-primary/5 cursor-pointer"
                            : "border-border hover:bg-muted/50 cursor-pointer"
                      }`}
                      onClick={() => toggleAccountSelection(account)}
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-xs">
                          {account.address.slice(0, 8)}...
                          {account.address.slice(-6)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Account #{account.index + 1}
                          {imported && (
                            <span className="ml-2 text-xs font-medium text-green-600">
                              Already imported
                            </span>
                          )}
                        </span>
                      </div>
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                          imported
                            ? "border-green-600 bg-green-600 text-white"
                            : selected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground"
                        }`}
                      >
                        {(imported || selected) && (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {importError && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{importError}</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <div className="flex w-full gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 0 || isLoadingAccounts}
                className="flex-1"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={isLoadingAccounts}
                className="flex-1"
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={handleImportSelected}
              disabled={newlySelectedCount === 0}
              className="w-full"
            >
              Import {newlySelectedCount} account
              {newlySelectedCount !== 1 ? "s" : ""}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 3: Success */}
      {step === "success" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              Import Successful
            </CardTitle>
            <CardDescription>
              Your Ledger accounts have been imported successfully.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium">
                {selectedAccountsMap.size} account
                {selectedAccountsMap.size !== 1 ? "s" : ""} imported
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                You can now use these accounts to sign transactions. Your Ledger
                device will be required to approve each transaction.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleFinish} className="w-full">
              Done
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
});

export default ImportLedger;
