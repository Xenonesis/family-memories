import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { FaBell, FaLock } from "react-icons/fa";

interface SettingsCardsProps {
  formData: {
    full_name: string;
    phone_number: string;
    bio: string;
    gender: string;
    avatar_url: string;
    notifications_enabled: boolean;
    email_updates_enabled: boolean;
    two_factor_enabled: boolean;
  };
  onChange: (field: string, value: string | boolean) => void;
}

export function SettingsCards({ formData, onChange }: SettingsCardsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Notification Settings */}
      <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <FaBell className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h2>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <Label className="font-medium">Push Notifications</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get notified when family members add new photos
              </p>
            </div>
            <Switch
              checked={formData.notifications_enabled}
              onCheckedChange={(checked) => onChange('notifications_enabled', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <Label className="font-medium">Email Updates</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Receive weekly summaries of vault activity
              </p>
            </div>
            <Switch
              checked={formData.email_updates_enabled}
              onCheckedChange={(checked) => onChange('email_updates_enabled', checked)}
            />
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
            <FaLock className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Security
          </h2>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <Label className="font-medium">Two-Factor Authentication</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={formData.two_factor_enabled}
              onCheckedChange={(checked) => onChange('two_factor_enabled', checked)}
            />
          </div>
          
          <Button variant="outline" className="w-full h-12 bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700">
            Change Password
          </Button>
        </div>
      </Card>
    </div>
  );
}