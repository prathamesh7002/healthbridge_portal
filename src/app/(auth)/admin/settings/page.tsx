import { SettingsForm } from "@/components/shared/settings-form";
import { Separator } from "@/components/ui/separator";

export default function ClinicSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Settings</h3>
                <p className="text-sm text-muted-foreground">
                    Configure global settings for the HealthConnect platform.
                </p>
            </div>
            <Separator />
            <SettingsForm userRole="admin" />
        </div>
    );
}
