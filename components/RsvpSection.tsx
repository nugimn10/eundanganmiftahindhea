import React, { useEffect, useState } from 'react';
import { CheckCircle2, Edit3, Users } from 'lucide-react';
import { RsvpSubmission } from '../types';

interface RsvpSectionProps {
  defaultGuestName?: string;
}

const STORAGE_KEY = 'fadil_indhea_rsvp_v1';

const RsvpSection: React.FC<RsvpSectionProps> = ({ defaultGuestName = '' }) => {
  const [name, setName] = useState(
    defaultGuestName && defaultGuestName !== 'Tamu Undangan Terhormat'
      ? defaultGuestName
      : ''
  );
  const [attendance, setAttendance] = useState<'attending' | 'not_attending' | ''>('');
  const [guests, setGuests] = useState(1);
  const [savedRsvp, setSavedRsvp] = useState<RsvpSubmission | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: RsvpSubmission = JSON.parse(raw);
        setSavedRsvp(parsed);
        setName(parsed.name);
        setAttendance(parsed.attendance);
        setGuests(parsed.guests);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Mohon masukkan nama lengkap Anda.');
      return;
    }
    if (!attendance) {
      setError('Mohon pilih status kehadiran Anda.');
      return;
    }

    const payload: RsvpSubmission = {
      name: name.trim(),
      attendance,
      guests: attendance === 'attending' ? guests : 0,
      submittedAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage errors
    }

    setSavedRsvp(payload);
  };

  return (
    <div
      id="rsvp"
      className="rounded-2xl border border-[#1f3b4a]/12 bg-white p-6 sm:p-8 shadow-sm h-full"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-[#a85d66] font-semibold mb-2">
        Konfirmasi Kehadiran
      </p>
      <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#162b36] mb-2">
        Reservasi Tamu (RSVP)
      </h2>
      <p className="text-sm text-[#4e6775] mb-6 leading-relaxed">
        Bantu kami mempersiapkan jamuan terbaik di Gedung Serbaguna La Tansa dengan mengonfirmasi
        kehadiran Anda sebelum 25 Maret 2027.
      </p>

      {savedRsvp ? (
        <div className="rounded-xl border border-[#1f3b4a]/12 bg-[#f7f9fb] p-6">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle2 className="h-5 w-5 text-[#2d6a4f] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-[#162b36]">Konfirmasi Tersimpan</h3>
              <p className="text-xs text-[#4e6775]">Dikirim pada {savedRsvp.submittedAt}</p>
            </div>
          </div>

          <dl className="space-y-2.5 text-sm border-t border-[#1f3b4a]/10 pt-4 mb-6">
            <div className="flex justify-between gap-4">
              <dt className="text-[#4e6775]">Nama Tamu</dt>
              <dd className="font-semibold text-[#162b36] text-right">{savedRsvp.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#4e6775]">Kehadiran</dt>
              <dd className="font-semibold text-[#162b36] text-right">
                {savedRsvp.attendance === 'attending'
                  ? 'Ya, InsyaAllah Hadir'
                  : 'Berhalangan Hadir'}
              </dd>
            </div>
            {savedRsvp.attendance === 'attending' && (
              <div className="flex justify-between gap-4">
                <dt className="text-[#4e6775]">Jumlah Tamu</dt>
                <dd className="font-semibold text-[#162b36] tabular-nums text-right">
                  {savedRsvp.guests} Orang
                </dd>
              </div>
            )}
          </dl>

          <button
            type="button"
            onClick={() => setSavedRsvp(null)}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-[#1f3b4a]/20 bg-white hover:bg-[#edf2f6] px-4 py-2.5 text-sm font-semibold text-[#1f3b4a] transition-colors cursor-pointer"
          >
            <Edit3 className="h-4 w-4" />
            <span>Ubah Konfirmasi</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="rsvp-name" className="block text-sm font-medium text-[#162b36] mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              id="rsvp-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full min-h-[44px] rounded-lg border border-[#1f3b4a]/20 bg-[#f7f9fb] px-4 py-2.5 text-sm text-[#162b36] placeholder:text-[#4e6775]/60 focus:border-[#a85d66] focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div>
            <span className="block text-sm font-medium text-[#162b36] mb-1.5">
              Konfirmasi Kehadiran
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAttendance('attending')}
                className={`min-h-[44px] rounded-lg border px-4 py-2.5 text-sm font-medium text-left transition-colors cursor-pointer ${
                  attendance === 'attending'
                    ? 'border-[#1f3b4a] bg-[#1f3b4a] text-white'
                    : 'border-[#1f3b4a]/20 bg-[#f7f9fb] text-[#162b36] hover:bg-[#edf2f6]'
                }`}
              >
                Ya, Saya Akan Hadir
              </button>
              <button
                type="button"
                onClick={() => setAttendance('not_attending')}
                className={`min-h-[44px] rounded-lg border px-4 py-2.5 text-sm font-medium text-left transition-colors cursor-pointer ${
                  attendance === 'not_attending'
                    ? 'border-[#1f3b4a] bg-[#1f3b4a] text-white'
                    : 'border-[#1f3b4a]/20 bg-[#f7f9fb] text-[#162b36] hover:bg-[#edf2f6]'
                }`}
              >
                Maaf, Tidak Bisa Hadir
              </button>
            </div>
          </div>

          {attendance === 'attending' && (
            <div>
              <label
                htmlFor="rsvp-guests"
                className="block text-sm font-medium text-[#162b36] mb-1.5"
              >
                Jumlah Tamu
              </label>
              <div className="relative">
                <Users className="h-4 w-4 text-[#4e6775] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  id="rsvp-guests"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full min-h-[44px] rounded-lg border border-[#1f3b4a]/20 bg-[#f7f9fb] pl-10 pr-3.5 py-2.5 text-sm text-[#162b36] tabular-nums focus:border-[#a85d66] focus:bg-white focus:outline-none"
                >
                  <option value={1}>1 Orang</option>
                  <option value={2}>2 Orang</option>
                  <option value={3}>3 Orang</option>
                  <option value={4}>4 Orang</option>
                </select>
              </div>
            </div>
          )}

          {error && (
            <p role="alert" className="text-sm font-medium text-[#9e2a2b]">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="inline-flex min-h-[46px] w-full items-center justify-center rounded-lg bg-[#a85d66] hover:bg-[#924d56] px-6 py-3 text-sm font-semibold text-white transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3b4a]"
          >
            Kirim Konfirmasi Kehadiran
          </button>
        </form>
      )}
    </div>
  );
};

export default RsvpSection;
