import { ShieldCheck, Info, AlertTriangle, Monitor } from 'lucide-react';

export function CadPrivacyNotice() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50/70 p-4 text-sm text-sky-950 dark:border-sky-900/60 dark:bg-sky-950/20 dark:text-sky-200">
      <ShieldCheck className="mt-0.5 size-5 shrink-0 text-sky-600 dark:text-sky-400" />
      <div>
        <p className="font-bold">CAD Privacy & Temporary Processing</p>
        <p className="mt-0.5 text-xs text-sky-800 dark:text-sky-300">
          Your CAD file is processed temporarily in an isolated workspace for conversion and is deleted automatically when the task finishes. It is not stored permanently or shared.
        </p>
      </div>
    </div>
  );
}

export function CadViewerNotice() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-200">
      <Monitor className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
      <div>
        <p className="font-bold">Adobe Acrobat Reader Desktop Recommended for 3D Interaction</p>
        <p className="mt-0.5 text-xs text-amber-900 dark:text-amber-300">
          For interactive 3D viewing, open the downloaded PDF in <strong>Adobe Acrobat Reader desktop</strong> or another compatible 3D PDF viewer. Built-in web browser PDF viewers (Chrome, Edge, Firefox, Safari) do not support 3D PRC interaction and may display only the preview image.
        </p>
      </div>
    </div>
  );
}

export function CadBackendUnavailableNotice() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/20 dark:text-rose-200">
      <AlertTriangle className="mt-0.5 size-5 shrink-0 text-rose-600 dark:text-rose-400" />
      <div>
        <p className="font-bold">Server Conversion Backend Unavailable</p>
        <p className="mt-0.5 text-xs text-rose-800 dark:text-rose-300">
          The native Open CASCADE or Asymptote conversion backend is not configured on this host. Conversions are disabled to prevent generating corrupt or simulated files.
        </p>
      </div>
    </div>
  );
}

export function CadErrorNotice({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/20 dark:text-rose-200">
      <Info className="mt-0.5 size-5 shrink-0 text-rose-600 dark:text-rose-400" />
      <div>
        <p className="font-bold">Conversion Error</p>
        <p className="mt-0.5 text-xs text-rose-800 dark:text-rose-300">{message}</p>
      </div>
    </div>
  );
}
