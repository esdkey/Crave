import { SettingsForm } from "@/components/dashboard/SettingsForm";
import { getStoredPaymentSettings } from "@/lib/payment";
import { getDictionary, hasLocale } from "../../dictionaries";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardSettingsPage({
  params,
}: PageProps<"/[lang]/dashboard/settings">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();
  const d = dict.dashboard;

  const { vodafone, instapay } = await getStoredPaymentSettings();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          {d.settingsTitle}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{d.settingsHint}</p>
      </div>

      <SettingsForm
        dict={{
          paymentSectionTitle: d.paymentSectionTitle,
          paymentVodafoneLabel: d.paymentVodafoneLabel,
          paymentInstapayLabel: d.paymentInstapayLabel,
          saveSettings: d.saveSettings,
          settingsSaved: d.settingsSaved,
        }}
        vodafone={vodafone}
        instapay={instapay}
      />
    </div>
  );
}
