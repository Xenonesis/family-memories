import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaUser } from "react-icons/fa";

interface PersonalInfoFormProps {
  formData: {
    full_name: string;
    phone_number: string;
    bio: string;
    gender: string;
  };
  user: {
    email: string;
  };
  onChange: (field: string, value: string) => void;
}

export function PersonalInfoForm({ formData, user, onChange }: PersonalInfoFormProps) {
  return (
    <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
          <FaUser className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Personal Information
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="full_name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => onChange('full_name', e.target.value)}
            className="h-12 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={user.email || ''}
            disabled
            className="h-12 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-600"
          />
          <p className="text-xs text-gray-500">Email cannot be changed here</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_number" className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</Label>
          <Input
            id="phone_number"
            type="tel"
            value={formData.phone_number}
            onChange={(e) => onChange('phone_number', e.target.value)}
            className="h-12 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender" className="text-sm font-medium text-gray-700 dark:text-gray-300">Gender</Label>
          <select
            id="gender"
            value={formData.gender}
            onChange={(e) => onChange('gender', e.target.value)}
            className="h-12 w-full px-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="bio" className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</Label>
          <textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => onChange('bio', e.target.value)}
            className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white resize-none"
            rows={4}
            placeholder="Tell us about yourself..."
          />
        </div>
      </div>
    </Card>
  );
}