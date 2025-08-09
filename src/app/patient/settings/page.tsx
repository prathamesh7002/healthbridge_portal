import { SettingsForm } from "@/components/shared/settings-form";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Settings</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your account, notification, and privacy settings.
                </p>
            </div>
            <Separator />
            <SettingsForm userRole="patient" />
        </div>
    );
}


