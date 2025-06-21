import { Button } from "@/components/ui/button";
import { FaArrowLeft, FaSave } from "react-icons/fa";

interface ProfileHeaderProps {
  onBack: () => void;
  onSave: () => void;
  saving: boolean;
}

export function ProfileHeader({ onBack, onSave, saving }: ProfileHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="flex items-center gap-2 hover:bg-white/50 dark:hover:bg-gray-800/50"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your personal information and preferences
          </p>
        </div>
      </div>
      
      <Button 
        onClick={onSave} 
        disabled={saving}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6"
      >
        <FaSave className="w-4 h-4 mr-2" />
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
}