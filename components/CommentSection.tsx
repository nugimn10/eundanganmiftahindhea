import React, { useCallback, useEffect, useState } from 'react';
import { Loader2, RefreshCw, Send } from 'lucide-react';
import { GOOGLE_SHEETS_WEBAPP_URL } from '../data/weddingData';
import { AttendanceStatus, GuestComment } from '../types';
import { BotanicalDivider } from './BotanicalOrnament';

const STORAGE_KEY = 'fadhil_indhea_wishes_cache_v1';

interface CommentSectionProps {
  defaultGuestName?: string;
}

function normalizeAttendance(value: unknown): AttendanceStatus {
  if (value === 'Tidak Hadir' || value === 'Masih Ragu' || value === 'Hadir') {
    return value;
  }
  return 'Hadir';
}

const CommentSection: React.FC<CommentSectionProps> = ({ defaultGuestName = '' }) => {
  const [comments, setComments] = useState<GuestComment[]>([]);
  const [name, setName] = useState(
    defaultGuestName && defaultGuestName !== 'Tamu Undangan Terhormat'
      ? defaultGuestName
      : ''
  );
  const [attendance, setAttendance] = useState<AttendanceStatus>('Hadir');
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState<'Semua' | AttendanceStatus>('Semua');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submittedNotice, setSubmittedNotice] = useState(false);

  const loadComments = useCallback(async () => {
    setIsLoading(true);
    setFetchError('');

    try {
      const response = await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
        method: 'GET',
        redirect: 'follow',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();
      if (payload?.status !== 'ok' || !Array.isArray(payload.data)) {
        throw new Error('Format respons tidak sesuai.');
      }

      const normalized: GuestComment[] = payload.data.map(
        (item: Record<string, unknown>, idx: number) => ({
          id: Number(item.id) || idx + 1,
          name: String(item.name || 'Tamu Undangan'),
          attendance: normalizeAttendance(item.attendance),
          message: String(item.message || ''),
          timestamp: String(item.timestamp || 'Baru saja'),
        })
      );

      setComments(normalized);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      } catch {
        // Ignore storage quota errors
      }
    } catch {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed: GuestComment[] = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            setComments(parsed);
          }
        }
      } catch {
        // Ignore storage errors
      }
      setFetchError('Gagal memuat daftar ucapan dari Google Sheets.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmittedNotice(false);

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedMessage) {
      setSubmitError('Mohon isi nama dan ucapan Anda terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          name: trimmedName,
          attendance,
          message: trimmedMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();
      const createdItem: GuestComment =
        payload?.status === 'ok' && payload?.item
          ? {
              id: Number(payload.item.id) || Date.now(),
              name: String(payload.item.name || trimmedName),
              attendance: normalizeAttendance(payload.item.attendance),
              message: String(payload.item.message || trimmedMessage),
              timestamp: String(payload.item.timestamp || 'Baru saja'),
            }
          : {
              id: Date.now(),
              name: trimmedName,
              attendance,
              message: trimmedMessage,
              timestamp: 'Baru saja',
            };

      setComments((prev) => {
        const next = [createdItem, ...prev];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // Ignore storage errors
        }
        return next;
      });

      setMessage('');
      setSubmittedNotice(true);
      setTimeout(() => setSubmittedNotice(false), 4000);
    } catch {
      setSubmitError('Ucapan gagal dikirim ke Google Sheets. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredComments =
    filter === 'Semua'
      ? comments
      : comments.filter((comment) => comment.attendance === filter);

  const attendingCount = comments.filter((c) => c.attendance === 'Hadir').length;
  const notAttendingCount = comments.filter((c) => c.attendance === 'Tidak Hadir').length;

  return (
    <section id="ucapan" className="bg-[#f7f9fb] py-16 sm:py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-[#a85d66] font-semibold mb-3">
            Konfirmasi Kehadiran &amp; Buku Tamu
          </p>
          <h2 className="font-editorial text-4xl sm:text-5xl font-semibold text-[#162b36] mb-4 text-balance">
            Ucapan &amp; Doa Restu
          </h2>
          <p className="text-sm sm:text-base text-[#4e6775] leading-relaxed">
            Kirimkan ucapan serta doa restu sekaligus konfirmasi kehadiran Anda pada acara
            pernikahan Fadhil &amp; Indhea.
          </p>
          <BotanicalDivider className="mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          <div className="lg:col-span-5 rounded-2xl border border-[#1f3b4a]/12 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#162b36] mb-1.5">
              Tulis Ucapan &amp; Kehadiran
            </h3>
            <p className="text-sm text-[#4e6775] mb-6">
              Pilih status kehadiran Anda dan titipkan doa terbaik untuk kedua mempelai.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="wish-name"
                  className="block text-sm font-medium text-[#162b36] mb-1.5"
                >
                  Nama Anda
                </label>
                <input
                  type="text"
                  id="wish-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] rounded-lg border border-[#1f3b4a]/20 bg-[#f7f9fb] px-4 py-2.5 text-sm text-[#162b36] placeholder:text-[#4e6775]/60 focus:border-[#a85d66] focus:bg-white focus:outline-none disabled:opacity-60"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="wish-attendance"
                  className="block text-sm font-medium text-[#162b36] mb-1.5"
                >
                  Konfirmasi Kehadiran
                </label>
                <select
                  id="wish-attendance"
                  value={attendance}
                  onChange={(e) => setAttendance(e.target.value as AttendanceStatus)}
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] rounded-lg border border-[#1f3b4a]/20 bg-[#f7f9fb] px-3.5 py-2.5 text-sm text-[#162b36] focus:border-[#a85d66] focus:bg-white focus:outline-none disabled:opacity-60"
                >
                  <option value="Hadir">Hadir</option>
                  <option value="Tidak Hadir">Tidak Hadir</option>
                  <option value="Masih Ragu">Masih Ragu</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="wish-message"
                  className="block text-sm font-medium text-[#162b36] mb-1.5"
                >
                  Ucapan &amp; Doa
                </label>
                <textarea
                  id="wish-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  disabled={isSubmitting}
                  placeholder="Tuliskan ucapan serta doa restu untuk Fadhil & Indhea..."
                  className="w-full rounded-lg border border-[#1f3b4a]/20 bg-[#f7f9fb] px-4 py-2.5 text-sm text-[#162b36] placeholder:text-[#4e6775]/60 focus:border-[#a85d66] focus:bg-white focus:outline-none disabled:opacity-60"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-[#a85d66] hover:bg-[#924d56] px-6 py-3 text-sm font-semibold text-white transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3b4a] disabled:opacity-65 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Mengirim Ucapan...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Kirim Ucapan</span>
                  </>
                )}
              </button>

              {submitError && (
                <p role="alert" className="text-xs font-medium text-[#9e2a2b] text-center pt-1">
                  {submitError}
                </p>
              )}

              {submittedNotice && (
                <p role="status" className="text-xs font-medium text-[#2d6a4f] text-center pt-1">
                  Terima kasih, ucapan dan konfirmasi kehadiran Anda telah tersimpan.
                </p>
              )}
            </form>
          </div>

          <div className="lg:col-span-7 rounded-2xl border border-[#1f3b4a]/12 bg-white p-6 sm:p-8 shadow-sm flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-5 border-b border-[#1f3b4a]/10">
              <div className="flex items-center gap-3">
                <div className="text-xs sm:text-sm text-[#4e6775] tabular-nums">
                  <span className="font-semibold text-[#162b36]">{comments.length} Ucapan</span>
                  <span className="mx-2" aria-hidden="true">
                    ·
                  </span>
                  <span>{attendingCount} Hadir</span>
                  <span className="mx-2" aria-hidden="true">
                    ·
                  </span>
                  <span>{notAttendingCount} Berhalangan</span>
                </div>

                <button
                  type="button"
                  onClick={loadComments}
                  disabled={isLoading}
                  aria-label="Muat ulang daftar ucapan"
                  title="Muat ulang daftar ucapan"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#1f3b4a]/15 text-[#4e6775] hover:text-[#162b36] hover:bg-[#edf2f6] transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1 rounded-lg bg-[#edf2f6] p-1">
                {(['Semua', 'Hadir', 'Tidak Hadir', 'Masih Ragu'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setFilter(tab)}
                    className={`min-h-[34px] rounded-md px-3 py-1 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                      filter === tab
                        ? 'bg-white text-[#162b36] shadow-xs'
                        : 'text-[#4e6775] hover:text-[#162b36]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {fetchError && (
              <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-[#9e2a2b]/20 bg-[#9e2a2b]/5 px-4 py-2.5 text-xs text-[#9e2a2b]">
                <span>{fetchError}</span>
                <button
                  type="button"
                  onClick={loadComments}
                  className="font-semibold underline underline-offset-2 whitespace-nowrap cursor-pointer"
                >
                  Coba Lagi
                </button>
              </div>
            )}

            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1 flex-1">
              {isLoading && comments.length === 0 ? (
                <div className="flex items-center justify-center gap-2 py-12 text-sm text-[#4e6775]">
                  <Loader2 className="h-4 w-4 animate-spin text-[#a85d66]" />
                  <span>Memuat ucapan tamu...</span>
                </div>
              ) : filteredComments.length === 0 ? (
                <p className="text-sm text-[#4e6775] py-10 text-center">
                  {comments.length === 0
                    ? 'Belum ada ucapan yang masuk. Jadilah yang pertama menuliskan doa restu.'
                    : 'Belum ada ucapan pada kategori ini.'}
                </p>
              ) : (
                filteredComments.map((comment) => (
                  <article
                    key={comment.id}
                    className="rounded-xl border border-[#1f3b4a]/10 bg-[#f7f9fb] p-4 sm:p-5"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
                      <h4 className="text-sm font-semibold text-[#162b36]">{comment.name}</h4>
                      <p className="text-xs text-[#4e6775]">
                        <span className="font-medium text-[#a85d66]">{comment.attendance}</span>
                        <span className="mx-1.5" aria-hidden="true">
                          ·
                        </span>
                        <span>{comment.timestamp}</span>
                      </p>
                    </div>
                    <p className="text-sm text-[#2b3d47] leading-relaxed">{comment.message}</p>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommentSection;