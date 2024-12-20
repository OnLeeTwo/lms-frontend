"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/Sidebar";
import {
  EyeIcon,
  SunMoon,
  Type,
  Contrast,
  SaveIcon,
  Bell,
  Globe,
  LayoutGrid,
  Clock,
} from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    fontSize: 100,
    highContrastMode: false,
    blackAndWhiteMode: false,
    textToSpeech: false,
    emailNotifications: true,
    assignmentReminders: true,
    courseAnnouncements: true,
    language: "english",
    courseLayout: "grid",
    timezone: "UTC",
    showDeadlines: true,
    showGrades: true,
  });

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved successfully!",
      description: "",
      className: "bg-green-400",
      duration: 1500,
    });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar role="teacher" />

      {/* Main Content */}
      <div className="flex-1 container mx-auto py-8 px-4 overflow-y-auto">
        <div className="grid gap-6 max-w-2xl mx-auto">
          {/* Accessibility Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Accessibility</h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Type className="h-5 w-5 text-muted-foreground" />
                  <Label className="text-lg">Text Size</Label>
                </div>
                <div className="space-y-2">
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={(value) =>
                      setSettings({ ...settings, fontSize: value[0] })
                    }
                    min={75}
                    max={200}
                    step={25}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>75%</span>
                    <span>100%</span>
                    <span>200%</span>
                  </div>
                </div>
                <p
                  className="text-sm text-muted-foreground"
                  style={{ fontSize: `${settings.fontSize}%` }}
                >
                  Sample text - This is how your text will look
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Contrast className="h-5 w-5 text-muted-foreground" />
                  <Label className="text-lg">High Contrast Mode</Label>
                </div>
                <Switch
                  checked={settings.highContrastMode}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, highContrastMode: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SunMoon className="h-5 w-5 text-muted-foreground" />
                  <Label className="text-lg">Black and White Mode</Label>
                </div>
                <Switch
                  checked={settings.blackAndWhiteMode}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, blackAndWhiteMode: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <EyeIcon className="h-5 w-5 text-muted-foreground" />
                  <Label className="text-lg">Text to Speech</Label>
                </div>
                <Switch
                  checked={settings.textToSpeech}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, textToSpeech: checked })
                  }
                />
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <Label className="text-lg">Email Notifications</Label>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, emailNotifications: checked })
                  }
                />
              </div>
              {/* Other notification settings */}
            </div>
          </Card>

          {/* Save Button */}
          <Button onClick={handleSaveSettings} className="w-full mt-6">
            <SaveIcon className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
