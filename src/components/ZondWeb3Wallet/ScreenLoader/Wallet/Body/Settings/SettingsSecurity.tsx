import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/UI/Card";
import { Label } from "@/components/UI/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/Select";
import { ROUTES } from "@/router/router";
import { useStore } from "@/stores/store";
import { MoveLeft } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import CircuitBackground from "../../../Shared/CircuitBackground/CircuitBackground";

const AUTO_LOCK_OPTIONS = [
  { value: "1", label: "1 minute" },
  { value: "5", label: "5 minutes" },
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "60", label: "60 minutes" },
  { value: "0", label: "Never" },
];

const SettingsSecurity = observer(() => {
  const navigate = useNavigate();
  const { settingsStore } = useStore();
  const { autoLockMinutes, setAutoLockMinutes } = settingsStore;

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
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label className="mb-2 block text-xs text-muted-foreground">
              Auto-lock timeout
            </Label>
            <Select
              value={String(autoLockMinutes)}
              onValueChange={(value) => setAutoLockMinutes(Number(value))}
            >
              <SelectTrigger aria-label="Auto-lock timeout">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AUTO_LOCK_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export default SettingsSecurity;
