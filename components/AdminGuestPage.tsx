import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Loader2,
  Lock,
  LogOut,
  MessageCircle,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react';
import {
  GOOGLE_SHEETS_WEBAPP_URL,
  UNIFIED_EVENT,
  WEDDING_DATE_DISPLAY,
} from '../data/weddingData';
import { InvitedGuest } from '../types';

const ADMIN_PIN_STORAGE_KEY = 'fadhil_indhea_admin_pin_session_v1';
const BASE_URL_STORAGE_KEY = 'fadhil_indhea_invite_base_url_v1';

interface AdminGuestPageProps {
  onExitAdmin: () => void;
}

function getDefaultBaseUrl(): string {
  if (typeof window === 'undefined') return '';
  try {
    const saved = localStorage.getItem(BASE_URL_STORAGE_KEY);
    if (saved && saved.trim()) return saved.trim().replace(/\/+$/, '');
  } catch {
    // Ignore storage read errors
  }
  const cleanPath = window.location.pathname.replace(/\/index\.html$/, '');
  return `${window.location.origin}${cleanPath}`.replace(/\/+$/, '');
}

function formatWhatsAppPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  if (digits.startsWith('62')) return digits;
  if (digits.startsWith('8')) return `62${digits}`;
  return digits;
}

function buildInviteUrl(baseUrl: string, guestName: string): string {
  const raw = (baseUrl.trim() || window.location.origin).replace(/\/+$/, '');
  const encoded = encodeURIComponent(guestName.trim());
  if (raw.includes('?')) {
    return `${raw}&to=${encoded}`;
  }
  return `${raw}/?to=${encoded}`;
}

function buildWhatsAppShareUrl(guest: InvitedGuest, inviteUrl: string): string {
  const text = [
    `Assalamu'alaikum Warahmatullahi Wabarakatuh.`,
    ``,
    `Kepada Yth. Bapak/Ibu/Saudara/i *${guest.name}*,`,
    ``,
    `Tanpa mengurangi rasa hormat, kami bermaksud mengundang Anda untuk menghadiri acara pernikahan kami:`,
    `*Fadhil & Indhea*`,
    `Hari/Tanggal: ${WEDDING_DATE_DISPLAY}`,
    `Tempat: ${UNIFIED_EVENT.venue}, Rangkasbitung`,
    ``,
    `Informasi lengkap acara & konfirmasi kehadiran dapat dibuka melalui tautan undangan khusus Anda berikut:`,
    inviteUrl,
    ``,
    `Merupakan kehormatan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.`,
  ].join('\n');

  const phone = formatWhatsAppPhone(guest.phone);
  const encodedText = encodeURIComponent(text);
  return phone
    ? `https://wa.me/${phone}?text=${encodedText}`
    : `https://wa.me/?text=${encodedText}`;
}

const AdminGuestPage: React.FC<AdminGuestPageProps> = ({ onExitAdmin }) => {
  const [pinInput, setPinInput] = useState('');
  const [activePin, setActivePin] = useState<string>(() => {
    try {
      return sessionStorage.getItem(ADMIN_PIN_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState('');

  const [guests, setGuests] = useState<InvitedGuest[]>([]);
  const [isLoadingGuests, setIsLoadingGuests] = useState(false);
  const [listError, setListError] = useState('');

  const [baseUrl, setBaseUrl] = useState<string>(getDefaultBaseUrl);
  const [guestName, setGuestName] = useState('');
  const [guestGroup, setGuestGroup] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchGuests = useCallback(async (pinToUse: string, isInitialAuth = false) => {
    if (!pinToUse.trim()) return;

    if (isInitialAuth) {
      setIsVerifying(true);
      setAuthError('');
    } else {
      setIsLoadingGuests(true);
      setListError('');
    }

    try {
      const url = `${GOOGLE_SHEETS_WEBAPP_URL}?action=guests&pin=${encodeURIComponent(
        pinToUse.trim()
      )}`;
      const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();

      if (payload?.status !== 'ok') {
        throw new Error(payload?.message || 'PIN tidak valid atau akses ditolak.');
      }

      if (payload?.mode !== 'guests') {
        throw new Error(
          'Apps Script belum diperbarui untuk manajemen tamu. Pastikan kode Apps Script terbaru sudah di-deploy sebagai New version.'
        );
      }

      const items: InvitedGuest[] = Array.isArray(payload.data)
        ? payload.data.map((row: Record<string, unknown>, index: number) => ({
            id: Number(row.id) || index + 1,
            name: String(row.name || '').trim(),
            group: String(row.group || '').trim(),
            phone: String(row.phone || '').trim(),
            timestamp: String(row.timestamp || '').trim(),
          }))
        : [];

      setGuests(items.filter((item) => item.name.length > 0));
      setActivePin(pinToUse.trim());
      setIsUnlocked(true);
      try {
        sessionStorage.setItem(ADMIN_PIN_STORAGE_KEY, pinToUse.trim());
      } catch {
        // Ignore storage errors
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Gagal terhubung ke Google Sheets.';
      if (isInitialAuth) {
        setAuthError(msg);
        setIsUnlocked(false);
        try {
          sessionStorage.removeItem(ADMIN_PIN_STORAGE_KEY);
        } catch {
          // Ignore storage errors
        }
      } else {
        setListError(msg);
      }
    } finally {
      setIsVerifying(false);
      setIsLoadingGuests(false);
    }
  }, []);

  useEffect(() => {
    if (activePin && !isUnlocked) {
      fetchGuests(activePin, true);
    }
  }, [activePin, fetchGuests, isUnlocked]);

  const handleBaseUrlChange = (value: string) => {
    setBaseUrl(value);
    try {
      localStorage.setItem(BASE_URL_STORAGE_KEY, value.trim());
    } catch {
      // Ignore storage errors
    }
  };

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) {
      setAuthError('Masukkan PIN admin terlebih dahulu.');
      return;
    }
    fetchGuests(pinInput, true);
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setActivePin('');
    setPinInput('');
    setGuests([]);
    setAuthError('');
    try {
      sessionStorage.removeItem(ADMIN_PIN_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess('');

    const trimmedName = guestName.trim();
    if (!trimmedName) {
      setAddError('Nama tamu wajib diisi.');
      return;
    }

    setIsAdding(true);

    try {
      const response = await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'add_guest',
          pin: activePin,
          name: trimmedName,
          group: guestGroup.trim(),
          phone: guestPhone.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();
      if (payload?.status !== 'ok' || !payload?.item) {
        throw new Error(payload?.message || 'Gagal menyimpan tamu ke Google Sheets.');
      }

      const created: InvitedGuest = {
        id: Number(payload.item.id) || Date.now(),
        name: String(payload.item.name || trimmedName),
        group: String(payload.item.group || guestGroup.trim()),
        phone: String(payload.item.phone || guestPhone.trim()),
        timestamp: String(payload.item.timestamp || ''),
      };

      setGuests((prev) => [created, ...prev]);
      setGuestName('');
      setGuestGroup('');
      setGuestPhone('');
      setAddSuccess(`Tamu "${created.name}" tersimpan dan link siap dikirim.`);
      window.setTimeout(() => setAddSuccess(''), 4000);
    } catch (err) {
      setAddError(
        err instanceof Error ? err.message : 'Gagal menyimpan tamu ke Google Sheets.'
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteGuest = async (id: number) => {
    setDeletingId(id);
    setListError('');
    try {
      const response = await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'delete_guest',
          pin: activePin,
          id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();
      if (payload?.status !== 'ok') {
        throw new Error(payload?.message || 'Gagal menghapus tamu.');
      }

      setGuests((prev) => prev.filter((item) => item.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      setListError(
        err instanceof Error ? err.message : 'Gagal menghapus tamu dari Spreadsheet.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyLink = async (guest: InvitedGuest) => {
    const inviteUrl = buildInviteUrl(baseUrl, guest.name);
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopiedId(guest.id);
      window.setTimeout(() => setCopiedId((curr) => (curr === guest.id ? null : curr)), 2200);
    } catch {
      setListError('Gagal menyalin otomatis. Anda bisa klik tombol Buka untuk menyalin URL.');
    }
  };

  const filteredGuests = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return guests;
    return guests.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.group.toLowerCase().includes(q) ||
        g.phone.toLowerCase().includes(q)
    );
  }, [guests, searchQuery]);

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] text-[#1f3b4a] flex flex-col">
        <header className="border-b border-[#1f3b4a]/10 bg-white px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-editorial text-xl font-semibold text-[#162b36] whitespace-nowrap">
              Fadhil &amp; Indhea
            </span>
            <span className="text-[#4e6775]/40" aria-hidden="true">
              /
            </span>
            <span className="text-sm font-medium text-[#4e6775] truncate">
              Admin Daftar Tamu
            </span>
          </div>
          <button
            type="button"
            onClick={onExitAdmin}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[#1f3b4a]/15 bg-white hover:bg-[#edf2f6] px-4 py-2 text-xs font-semibold text-[#162b36] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Undangan</span>
          </button>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md rounded-2xl border border-[#1f3b4a]/12 bg-white p-7 sm:p-9 shadow-sm">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf2f6] text-[#a85d66]">
              <Lock className="h-5 w-5" />
            </div>

            <h1 className="font-editorial text-3xl font-semibold text-[#162b36] mb-2">
              Akses Admin Tamu
            </h1>
            <p className="text-sm text-[#4e6775] leading-relaxed mb-6">
              Masukkan PIN admin yang terpasang di Google Apps Script untuk mengelola daftar
              tamu dan membuat tautan undangan khusus.
            </p>

            <form onSubmit={handleUnlockSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-pin"
                  className="block text-sm font-medium text-[#162b36] mb-1.5"
                >
                  PIN Admin
                </label>
                <input
                  id="admin-pin"
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Masukkan PIN rahasia"
                  disabled={isVerifying}
                  autoComplete="current-password"
                  className="w-full min-h-[44px] rounded-lg border border-[#1f3b4a]/20 bg-[#f7f9fb] px-4 py-2.5 text-sm text-[#162b36] placeholder:text-[#4e6775]/60 focus:border-[#a85d66] focus:bg-white focus:outline-none disabled:opacity-60"
                  required
                />
              </div>

              {authError && (
                <p
                  role="alert"
                  className="rounded-lg border border-[#9e2a2b]/20 bg-[#9e2a2b]/5 px-3.5 py-2.5 text-xs font-medium text-[#9e2a2b]"
                >
                  {authError}
                </p>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-[#a85d66] hover:bg-[#924d56] px-6 py-3 text-sm font-semibold text-white transition-colors whitespace-nowrap cursor-pointer disabled:opacity-65"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Memverifikasi PIN...</span>
                  </>
                ) : (
                  <span>Masuk ke Panel Admin</span>
                )}
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#1f3b4a]">
      <header className="sticky top-0 z-30 border-b border-[#1f3b4a]/10 bg-white/95 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-editorial text-xl font-semibold text-[#162b36] whitespace-nowrap">
              Fadhil &amp; Indhea
            </span>
            <span className="text-[#4e6775]/40" aria-hidden="true">
              /
            </span>
            <span className="text-sm font-medium text-[#4e6775] truncate">
              Panel Admin Tamu
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onExitAdmin}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[#1f3b4a]/15 bg-white hover:bg-[#edf2f6] px-3.5 py-2 text-xs font-semibold text-[#162b36] transition-colors whitespace-nowrap cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Lihat Undangan</span>
            </button>
            <button
              type="button"
              onClick={handleLock}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[#1f3b4a]/15 bg-white hover:bg-[#edf2f6] px-3.5 py-2 text-xs font-semibold text-[#4e6775] hover:text-[#162b36] transition-colors whitespace-nowrap cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Kunci</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-8 py-8 sm:py-10">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#a85d66] font-semibold mb-1.5">
              Manajemen Undangan Tamu
            </p>
            <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#162b36]">
              Daftar Tamu &amp; Generator Link Unik
            </h1>
          </div>

          <div className="flex items-center gap-4 text-sm text-[#4e6775] tabular-nums">
            <span>
              Total Tamu:{' '}
              <strong className="font-semibold text-[#162b36]">{guests.length}</strong>
            </span>
            <button
              type="button"
              onClick={() => fetchGuests(activePin, false)}
              disabled={isLoadingGuests}
              aria-label="Muat ulang daftar tamu"
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#1f3b4a]/15 bg-white hover:bg-[#edf2f6] px-3 py-1.5 text-xs font-semibold text-[#162b36] transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isLoadingGuests ? 'animate-spin' : ''}`}
              />
              <span>Muat Ulang</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Form Tambah Tamu + Pengaturan Domain URL */}
          <div className="lg:col-span-4 space-y-6">
            <section className="rounded-2xl border border-[#1f3b4a]/12 bg-white p-6 shadow-sm">
              <h2 className="font-editorial text-2xl font-semibold text-[#162b36] mb-1">
                Tambah Tamu Baru
              </h2>
              <p className="text-xs text-[#4e6775] mb-5 leading-relaxed">
                Nama yang disimpan masuk ke tab <strong className="font-semibold">Tamu</strong>{' '}
                di Google Spreadsheet dan langsung menghasilkan tautan undangan khusus.
              </p>

              <form onSubmit={handleAddGuest} className="space-y-4">
                <div>
                  <label
                    htmlFor="guest-name"
                    className="block text-sm font-medium text-[#162b36] mb-1.5"
                  >
                    Nama Tamu Undangan
                  </label>
                  <input
                    id="guest-name"
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Contoh: Budi Santoso & Keluarga"
                    disabled={isAdding}
                    className="w-full min-h-[44px] rounded-lg border border-[#1f3b4a]/20 bg-[#f7f9fb] px-4 py-2.5 text-sm text-[#162b36] placeholder:text-[#4e6775]/60 focus:border-[#a85d66] focus:bg-white focus:outline-none disabled:opacity-60"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="guest-group"
                    className="block text-sm font-medium text-[#162b36] mb-1.5"
                  >
                    Grup / Kategori (Opsional)
                  </label>
                  <input
                    id="guest-group"
                    type="text"
                    value={guestGroup}
                    onChange={(e) => setGuestGroup(e.target.value)}
                    placeholder="Contoh: Rekan Kerja, Keluarga Serang"
                    disabled={isAdding}
                    className="w-full min-h-[44px] rounded-lg border border-[#1f3b4a]/20 bg-[#f7f9fb] px-4 py-2.5 text-sm text-[#162b36] placeholder:text-[#4e6775]/60 focus:border-[#a85d66] focus:bg-white focus:outline-none disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="guest-phone"
                    className="block text-sm font-medium text-[#162b36] mb-1.5"
                  >
                    Nomor WhatsApp (Opsional)
                  </label>
                  <input
                    id="guest-phone"
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    disabled={isAdding}
                    className="w-full min-h-[44px] rounded-lg border border-[#1f3b4a]/20 bg-[#f7f9fb] px-4 py-2.5 text-sm text-[#162b36] placeholder:text-[#4e6775]/60 focus:border-[#a85d66] focus:bg-white focus:outline-none disabled:opacity-60"
                  />
                  <p className="mt-1 text-[11px] text-[#4e6775]">
                    Jika dikosongkan, tombol Kirim WA tetap bisa memilih kontak manual.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isAdding}
                  className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-[#a85d66] hover:bg-[#924d56] px-5 py-3 text-sm font-semibold text-white transition-colors whitespace-nowrap cursor-pointer disabled:opacity-65"
                >
                  {isAdding ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Menyimpan Tamu...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Simpan &amp; Buat Link</span>
                    </>
                  )}
                </button>

                {addError && (
                  <p role="alert" className="text-xs font-medium text-[#9e2a2b] text-center">
                    {addError}
                  </p>
                )}

                {addSuccess && (
                  <p role="status" className="text-xs font-medium text-[#2d6a4f] text-center">
                    {addSuccess}
                  </p>
                )}
              </form>
            </section>

            <section className="rounded-2xl border border-[#1f3b4a]/12 bg-white p-5 shadow-sm">
              <label
                htmlFor="invite-base-url"
                className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#4e6775] mb-2"
              >
                Alamat Website Undangan
              </label>
              <input
                id="invite-base-url"
                type="url"
                value={baseUrl}
                onChange={(e) => handleBaseUrlChange(e.target.value)}
                placeholder="https://username.github.io/nama-repo"
                className="w-full min-h-[40px] rounded-lg border border-[#1f3b4a]/20 bg-[#f7f9fb] px-3 py-2 text-xs text-[#162b36] focus:border-[#a85d66] focus:bg-white focus:outline-none"
              />
              <p className="mt-2 text-[11px] text-[#4e6775] leading-relaxed">
                Otomatis terdeteksi dari alamat halaman saat ini. Ubah hanya jika ingin
                membuat link untuk domain GitHub Pages lain.
              </p>
            </section>
          </div>

          {/* Daftar Tamu & Aksi Bagikan */}
          <section className="lg:col-span-8 rounded-2xl border border-[#1f3b4a]/12 bg-white p-5 sm:p-6 shadow-sm">
            <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1f3b4a]/10">
              <h2 className="font-editorial text-2xl font-semibold text-[#162b36]">
                Tautan Undangan Per Tamu
              </h2>

              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4e6775]" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama tamu..."
                  aria-label="Cari nama tamu"
                  className="w-full min-h-[40px] rounded-lg border border-[#1f3b4a]/20 bg-[#f7f9fb] pl-9 pr-3 py-2 text-sm text-[#162b36] placeholder:text-[#4e6775]/60 focus:border-[#a85d66] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {listError && (
              <div
                role="alert"
                className="mb-4 rounded-lg border border-[#9e2a2b]/20 bg-[#9e2a2b]/5 px-4 py-3 text-xs font-medium text-[#9e2a2b]"
              >
                {listError}
              </div>
            )}

            {isLoadingGuests && guests.length === 0 ? (
              <div className="flex items-center justify-center gap-2 py-14 text-sm text-[#4e6775]">
                <Loader2 className="h-4 w-4 animate-spin text-[#a85d66]" />
                <span>Memuat daftar tamu dari Spreadsheet...</span>
              </div>
            ) : filteredGuests.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm font-medium text-[#162b36] mb-1">
                  {guests.length === 0
                    ? 'Belum ada tamu yang ditambahkan'
                    : 'Tidak ada tamu yang cocok dengan pencarian'}
                </p>
                <p className="text-xs text-[#4e6775]">
                  {guests.length === 0
                    ? 'Gunakan form di sebelah kiri untuk menambahkan tamu pertama dan membuat link uniknya.'
                    : 'Coba kata kunci nama atau grup lainnya.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#1f3b4a]/10">
                {filteredGuests.map((guest) => {
                  const inviteUrl = buildInviteUrl(baseUrl, guest.name);
                  const waUrl = buildWhatsAppShareUrl(guest, inviteUrl);
                  const isCopied = copiedId === guest.id;
                  const isConfirmingDelete = confirmDeleteId === guest.id;
                  const isDeletingThis = deletingId === guest.id;

                  return (
                    <div
                      key={guest.id}
                      className="py-4 first:pt-1 last:pb-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <h3 className="text-base font-semibold text-[#162b36] truncate">
                            {guest.name}
                          </h3>
                          {guest.group && (
                            <span className="text-xs text-[#4e6775]">
                              <span aria-hidden="true">· </span>
                              {guest.group}
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-xs text-[#4e6775] truncate font-mono">
                          {inviteUrl}
                        </p>

                        {(guest.phone || guest.timestamp) && (
                          <p className="mt-1 text-[11px] text-[#4e6775] tabular-nums">
                            {guest.phone && <span>WA: {guest.phone}</span>}
                            {guest.phone && guest.timestamp && (
                              <span aria-hidden="true"> · </span>
                            )}
                            {guest.timestamp && <span>Ditambahkan {guest.timestamp}</span>}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyLink(guest)}
                          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#1f3b4a]/18 bg-[#f7f9fb] hover:bg-[#edf2f6] px-3 py-1.5 text-xs font-semibold text-[#162b36] transition-colors whitespace-nowrap cursor-pointer"
                        >
                          {isCopied ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-[#2d6a4f]" />
                              <span className="text-[#2d6a4f]">Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Salin Link</span>
                            </>
                          )}
                        </button>

                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#a85d66] hover:bg-[#924d56] px-3 py-1.5 text-xs font-semibold text-white transition-colors whitespace-nowrap"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>Kirim WA</span>
                        </a>

                        <a
                          href={inviteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Pratinjau undangan untuk ${guest.name}`}
                          title="Pratinjau halaman tamu"
                          className="inline-flex min-h-[38px] items-center gap-1 rounded-lg border border-[#1f3b4a]/18 bg-white hover:bg-[#edf2f6] px-2.5 py-1.5 text-xs font-medium text-[#4e6775] hover:text-[#162b36] transition-colors whitespace-nowrap"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>Buka</span>
                        </a>

                        {isConfirmingDelete ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDeleteGuest(guest.id)}
                              disabled={isDeletingThis}
                              className="inline-flex min-h-[38px] items-center gap-1 rounded-lg bg-[#9e2a2b] hover:bg-[#822223] px-2.5 py-1.5 text-xs font-semibold text-white transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60"
                            >
                              {isDeletingThis ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <span>Hapus</span>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              disabled={isDeletingThis}
                              className="inline-flex min-h-[38px] items-center rounded-lg border border-[#1f3b4a]/15 px-2.5 py-1.5 text-xs font-medium text-[#4e6775] hover:text-[#162b36] whitespace-nowrap cursor-pointer"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(guest.id)}
                            aria-label={`Hapus ${guest.name}`}
                            title="Hapus tamu"
                            className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg border border-[#1f3b4a]/15 bg-white hover:bg-[#9e2a2b]/5 text-[#4e6775] hover:text-[#9e2a2b] transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminGuestPage;
