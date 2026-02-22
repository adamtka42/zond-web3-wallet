import { Button } from "@/components/UI/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/UI/Card";
import { ROUTES } from "@/router/router";
import StorageUtil from "@/utilities/storageUtil";
import { Download, MoveLeft } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CircuitBackground from "../../../Shared/CircuitBackground/CircuitBackground";

const WALLET_VERSION = "0.1.1";

const SettingsData = observer(() => {
  const navigate = useNavigate();
  const [exporting, setExporting] = useState(false);

  const exportBackup = async () => {
    setExporting(true);
    try {
      const keystores = await StorageUtil.getKeystores();
      const accounts = await StorageUtil.getAllAccounts();
      const activeChain = await StorageUtil.getActiveBlockChain();

      const backup = {
        version: WALLET_VERSION,
        exportedAt: new Date().toISOString(),
        keystores,
        accounts,
        activeChain: {
          chainId: activeChain.chainId,
          chainName: activeChain.chainName,
        },
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `zond-wallet-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="w-full">
      <CircuitBackground />
      <div className="relative z-10 p-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MoveLeft
                className="cursor-pointer transition-all hover:text-secondary"
                onClick={() => navigate(ROUTES.SETTINGS)}
                data-testid="back-arrow"
              />
              Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-xs text-muted-foreground">
              Export encrypted keystores as a JSON backup file. No
              decrypted keys or passwords are included.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={exportBackup}
              disabled={exporting}
            >
              <Download className="mr-1 h-3.5 w-3.5" />
              {exporting ? "Exporting..." : "Export Backup"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export default SettingsData;
