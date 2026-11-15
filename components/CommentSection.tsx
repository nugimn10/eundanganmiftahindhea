import React, { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import { INITIAL_COMMENTS } from '../data/weddingData';
import { AttendanceStatus, GuestComment } from '../types';

const STORAGE_KEY = 'fadil_indhea_wishes_v1';

interface CommentSectionProps {
  defaultGuestName?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ defaultGuestName = '' }) => {
  const [comments, setComments] = useState<GuestComment[]>(INITIAL_COMMENTS);
  const [name, setName] = useState(
    defaultGuestName && defaultGuestName !== 'Tamu Undangan Terhormat'
      ? defaultGuestName
      : ''
  );
  const [attendance, setAttendance] = useState<AttendanceStatus>('Hadir');
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState<'Semua' | AttendanceStatus>('Semua');
  const [submittedNotice, setSubmittedNotice] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: GuestComment[] = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setComments(parsed);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newComment: GuestComment = {
      id: Date.now(),
      name: name.trim(),
      attendance,
      message: message.trim(),
      timestamp: 'Baru saja',
    };

    const nextComments = [newComment, ...comments];
    setComments(nextComments);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextComments));
    } catch {
      // Ignore storage errors
    }
    setMessage('');
    setSubmittedNotice(true);
    setTimeout(() => setSubmittedNotice(false), 3000);
  };

  const filteredComments =
    filter === 'Semua'
      ? comments
      : comments.filter((comment) => comment.attendance === filter);

  const attendingCount = comments.filter((c) => c.attendance === 'Hadir').length;

  return (
    <div
      id="ucapan"
      className="rounded-2xl border border-[#1f3b4a]/12 bg-white p-6 sm:p-8 shadow-sm h-full flex flex-col"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-4 mb-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#a85d66] font-semibold mb-2">
            Buku Tamu
          </p>
          <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#162b36]">
            Ucapan &amp; Doa Restu
          </h2>
        </div>
        <p className="text-xs text-[#4e6775] tabular-nums">
          {comments.length} Ucapan <span aria-hidden="true">·</span> {attendingCount} Hadir
        </p>
      </div>

      <p className="text-sm text-[#4e6775] mb-6 leading-relaxed">
        Titipkan doa terbaik untuk langkah baru Fadil &amp; Indhea.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 mb-7 pb-7 border-b border-[#1f3b4a]/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="wish-name" className="block text-xs font-medium text-[#162b36] mb-1">
              Nama Anda
            </label>
            <input
              type="text"
              id="wish-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap"
              className="w-full min-h-[42px] rounded-lg border border-[#1f3b4a]/20 bg-[#f7f9fb] px-3.5 py-2 text-sm text-[#162b36] placeholder:text-[#4e6775]/60 focus:border-[#a85d66] focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="wish-attendance"
              className="block text-xs font-medium text-[#162b36] mb-1"
            >
              Status Kehadiran
            </label>
            <select
              id="wish-attendance"
              value={attendance}
              onChange={(e) => setAttendance(e.target.value as AttendanceStatus)}
              className="w-full min-h-[42px] rounded-lg border border-[#1f3b4a]/20 bg-[#f7f9fb] px-3.5 py-2 text-sm text-[#162b36] focus:border-[#a85d66] focus:bg-white focus:outline-none"
            >
              <option value="Hadir">Hadir</option>
              <option value="Tidak Hadir">Tidak Hadir</option>
              <option value="Masih Ragu">Masih Ragu</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="wish-message" className="block text-xs font-medium text-[#162b36] mb-1">
            Ucapan &amp; Doa
          </label>
          <textarea
            id="wish-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Tuliskan doa restu untuk kedua mempelai..."
            className="w-full rounded-lg border border-[#1f3b4a]/20 bg-[#f7f9fb] px-3.5 py-2.5 text-sm text-[#162b36] placeholder:text-[#4e6775]/60 focus:border-[#a85d66] focus:bg-white focus:outline-none"
            required
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            type="submit"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#1f3b4a] hover:bg-[#162b36] px-5 py-2.5 text-sm font-semibold text-white transition-colors whitespace-nowrap cursor-pointer"
          >
            <Send className="h-4 w-4" />
            <span>Kirim Ucapan</span>
          </button>

          {submittedNotice && (
            <span className="text-xs font-medium text-[#2d6a4f]">
              Terima kasih, ucapan Anda telah ditambahkan.
            </span>
          )}
        </div>
      </form>

      <div className="flex items-center gap-1 rounded-lg bg-[#edf2f6] p-1 self-start mb-4">
        {(['Semua', 'Hadir', 'Tidak Hadir'] as const).map((tab) => (
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

      <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
        {filteredComments.length === 0 ? (
          <p className="text-sm text-[#4e6775] py-6 text-center">
            Belum ada ucapan pada kategori ini.
          </p>
        ) : (
          filteredComments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-xl border border-[#1f3b4a]/10 bg-[#f7f9fb] p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
                <h3 className="text-sm font-semibold text-[#162b36]">{comment.name}</h3>
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
  );
};

export default CommentSection;