'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

type AlertKind = 'success' | 'error' | 'warning' | 'info';

type AlertPayload = {
  kind?: AlertKind;
  title: string;
  message?: string;
  durationMs?: number;
};

type ConfirmOptions = {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
};

type AlertItem = {
  id: string;
  kind: AlertKind;
  title: string;
  message?: string;
};

type ConfirmState = ConfirmOptions & {
  open: boolean;
  resolver?: (result: boolean) => void;
};

type AdminAlertContextValue = {
  push: (payload: AlertPayload) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const AdminAlertContext = createContext<AdminAlertContextValue | null>(null);

const ALERT_STYLES: Record<AlertKind, { border: string; bg: string; text: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  success: {
    border: 'border-[#10B98140]',
    bg: 'bg-[#10B98118]',
    text: 'text-[#10B981]',
    icon: CheckCircle2,
  },
  error: {
    border: 'border-[#EF444440]',
    bg: 'bg-[#EF444418]',
    text: 'text-[#EF4444]',
    icon: XCircle,
  },
  warning: {
    border: 'border-[#F59E0B40]',
    bg: 'bg-[#F59E0B18]',
    text: 'text-[#F59E0B]',
    icon: AlertTriangle,
  },
  info: {
    border: 'border-[#00D4FF40]',
    bg: 'bg-[#00D4FF18]',
    text: 'text-[#00D4FF]',
    icon: Info,
  },
};

export function AdminAlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    open: false,
    title: '',
  });

  const push = useCallback((payload: AlertPayload) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const kind = payload.kind ?? 'info';
    const duration = payload.durationMs ?? 3500;

    setAlerts((prev) => [...prev, { id, kind, title: payload.title, message: payload.message }]);

    window.setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, duration);
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({
        open: true,
        title: options.title,
        message: options.message,
        confirmText: options.confirmText,
        cancelText: options.cancelText,
        danger: options.danger,
        resolver: resolve,
      });
    });
  }, []);

  const closeConfirm = (result: boolean) => {
    if (confirmState.resolver) {
      confirmState.resolver(result);
    }
    setConfirmState({ open: false, title: '' });
  };

  const value = useMemo(() => ({ push, confirm }), [push, confirm]);

  return (
    <AdminAlertContext.Provider value={value}>
      {children}

      <div className="fixed top-2 right-2 z-120 space-y-1.5 w-[min(94vw,280px)] sm:top-4 sm:right-4 sm:space-y-2 sm:w-[min(92vw,360px)]">
        {alerts.map((alert) => {
          const style = ALERT_STYLES[alert.kind];
          const Icon = style.icon;
          return (
            <div key={alert.id} className={`rounded-lg border ${style.border} ${style.bg} p-2.5 sm:rounded-xl sm:p-3 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur`}>
              <div className="flex items-start gap-2">
                <Icon size={14} className={style.text} />
                <div>
                  <div className={`text-[11px] sm:text-xs font-semibold ${style.text}`}>{alert.title}</div>
                  {alert.message && <div className="text-[11px] sm:text-xs text-[#CFCFD4] mt-0.5 leading-tight">{alert.message}</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {confirmState.open && (
        <div className="fixed inset-0 z-130 flex items-center justify-center bg-black/65 backdrop-blur-sm px-3 sm:px-4">
          <div className="w-full max-w-sm sm:max-w-md rounded-xl border border-white/15 bg-[#111111] p-4 sm:p-5">
            <div className="text-sm font-semibold text-white">{confirmState.title}</div>
            {confirmState.message && <p className="text-xs text-[#A1A1AA] mt-1">{confirmState.message}</p>}
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => closeConfirm(false)}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-[11px] sm:text-xs text-[#A1A1AA] hover:text-white hover:border-white/20 transition-colors"
              >
                {confirmState.cancelText || 'Cancelar'}
              </button>
              <button
                type="button"
                onClick={() => closeConfirm(true)}
                className={`rounded-lg px-3 py-1.5 text-[11px] sm:text-xs font-semibold transition-colors ${
                  confirmState.danger
                    ? 'bg-[#EF444420] text-[#EF4444] hover:bg-[#EF444430]'
                    : 'bg-[#00D4FF18] text-[#00D4FF] hover:bg-[#00D4FF2A]'
                }`}
              >
                {confirmState.confirmText || 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminAlertContext.Provider>
  );
}

export function useAdminAlert() {
  const ctx = useContext(AdminAlertContext);
  if (!ctx) {
    throw new Error('useAdminAlert must be used within AdminAlertProvider');
  }
  return ctx;
}
