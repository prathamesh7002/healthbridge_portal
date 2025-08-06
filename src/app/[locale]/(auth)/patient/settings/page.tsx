import { SettingsForm } from "@/components/shared/settings-form";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";

export default function SettingsPage() {
    const t = useTranslations("SettingsPage");
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">{t("title")}</h3>
                <p className="text-sm text-muted-foreground">
                    {t("profileDescription")}
                </p>
            </div>
            <Separator />
            <SettingsForm userRole="patient" />
        </div>
    );
}
