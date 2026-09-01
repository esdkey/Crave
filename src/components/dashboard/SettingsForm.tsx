"use client";

import { useActionState } from "react";
import { saveSettings, type SettingsState } from "@/lib/actions/dashboard";

type SettingsDict = {
  paymentSectionTitle: string;
  paymentVodafoneLabel: string;
  paymentInstapayLabel: string;
  saveSettings: string;
  settingsSaved: string;
};

export function SettingsForm({
  dict,
  vodafone,
  instapay,
}: {
  dict: SettingsDict;
  vodafone: string;
  instapay: string;
}) {
  const [state, formAction, pending] = useActionState(
    saveSettings,
    undefined as SettingsState,
  );

  return (
    <form
      action={formAction}
      className="max-w-xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
    >
      <div>
        <h2 className="text-lg font-bold text-slate-800">
          {dict.paymentSectionTitle}
        </h2>

        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="vodafoneNumber"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              {dict.paymentVodafoneLabel}
            </label>
            <input
              id="vodafoneNumber"
              name="vodafoneNumber"
              defaultValue={vodafone}
              dir="ltr"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-800 focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/20"
            />
          </div>

          <div>
            <label
              htmlFor="instapayNumber"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              {dict.paymentInstapayLabel}
            </label>
            <input
              id="instapayNumber"
              name="instapayNumber"
              defaultValue={instapay}
              dir="ltr"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-800 focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/20"
            />
          </div>
        </div>
      </div>

      {state?.saved && (
        <p className="rounded-lg bg-emerald-100 px-4 py-2.5 text-sm font-semibold text-emerald-700">
          {dict.settingsSaved}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-burgundy px-6 py-3.5 text-base font-semibold text-cream shadow-sm transition-colors hover:bg-burgundy-dark disabled:opacity-60"
      >
        {pending ? "..." : dict.saveSettings}
      </button>
    </form>
  );
}
