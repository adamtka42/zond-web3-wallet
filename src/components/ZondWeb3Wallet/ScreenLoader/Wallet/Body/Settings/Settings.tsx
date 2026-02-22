import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/UI/Card";
import { ROUTES } from "@/router/router";
import {
  ChevronRight,
  Download,
  Globe,
  Info,
  Palette,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CircuitBackground from "../../../Shared/CircuitBackground/CircuitBackground";

const MENU_ITEMS = [
  { label: "Appearance", icon: Palette, route: ROUTES.SETTINGS_APPEARANCE },
  { label: "Security", icon: Shield, route: ROUTES.SETTINGS_SECURITY },
  { label: "Preferences", icon: Globe, route: ROUTES.SETTINGS_PREFERENCES },
  { label: "Data", icon: Download, route: ROUTES.SETTINGS_DATA },
  { label: "About", icon: Info, route: ROUTES.SETTINGS_ABOUT },
];

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <CircuitBackground />
      <div className="relative z-10 p-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {MENU_ITEMS.map((item, index) => (
              <div
                key={item.label}
                className={`flex cursor-pointer items-center justify-between px-6 py-3 transition-colors hover:bg-accent ${
                  index < MENU_ITEMS.length - 1 ? "border-b" : ""
                }`}
                onClick={() => navigate(item.route)}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{item.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
