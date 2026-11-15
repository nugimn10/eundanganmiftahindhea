import coverImg from '../src/assets/images/ocean_rose_cover_1794754308656.jpg';
import groomImg from '../src/assets/images/groom_portrait_1794754308222.jpg';
import brideImg from '../src/assets/images/bride_portrait_1794754309004.jpg';
import coastalImg from '../src/assets/images/prewed_coastal_1794754310148.jpg';
import gardenImg from '../src/assets/images/prewed_garden_1794754309517.jpg';
import { GalleryItem, GuestComment, StoryMilestone } from '../types';

export const WEDDING_DATE_ISO = '2027-04-04T08:00:00+07:00';
export const WEDDING_DATE_DISPLAY = 'Minggu, 4 April 2027';
export const WEDDING_CITY = 'Rangkasbitung, Lebak';

export const IMAGES = {
  cover: coverImg,
  groom: groomImg,
  bride: brideImg,
  coastal: coastalImg,
  garden: gardenImg,
};

export const COUPLE = {
  groom: {
    shortName: 'Fadil',
    fullName: 'Fadil Miftah Fauzi',
    role: 'Mempelai Pria',
    parents: 'Putra pertama dari Bapak Asep & Ibu Bety',
    origin: 'Serang',
    bio: 'Pribadi tenang yang gemar merancang perangkat lunak, mendaki pegunungan Nusantara, dan menyeduh kopi pagi.',
    image: groomImg,
  },
  bride: {
    shortName: 'Indhea',
    fullName: 'Indhea Ayu Oxza',
    role: 'Mempelai Wanita',
    parents: 'Putri kedua dari Bapak titik titik & Ibu titik titik',
    origin: 'Rangkasbitung',
    bio: 'Desainer visual yang mencintai lukisan cat air, aroma mawar taman, serta perjalanan menyusuri pesisir.',
    image: brideImg,
  },
};

export const UNIFIED_EVENT = {
  title: 'Akad Nikah & Resepsi Pernikahan',
  date: 'Minggu, 4 April 2027',
  schedules: [
    { label: 'Akad Nikah', time: '08:00 – 10:00 WIB' },
    { label: 'Resepsi Pernikahan', time: '11:00 – 14:30 WIB' },
  ],
  venue: 'Gedung Serbaguna La Tansa',
  address: 'Jl. Soekarno–Hatta, Cijoro Lebak, Kec. Rangkasbitung, Kab. Lebak, Banten 42317',
  note: 'Kehadiran 30 menit sebelum akad dimulai sangat kami hargai. Busana formal bernuansa biru laut, gading, atau dusty rose.',
  mapsUrl: 'https://maps.app.goo.gl/7nJzfXA5kCTaGcAK9',
  mapEmbedUrl:
    'https://maps.google.com/maps?q=Gedung+Serbaguna+La+Tansa,-6.3439122,106.2526159&t=&z=16&ie=UTF8&iwloc=&output=embed',
};

export const LOVE_STORY: StoryMilestone[] = [
  {
    chapter: '01',
    year: '2021',
    title: 'Pertemuan Pertama',
    narrative:
      'Berawal dari kolaborasi proyek desain dan teknologi di Jakarta, obrolan singkat tentang seni dan kopi perlahan membuka ruang keakraban.',
  },
  {
    chapter: '02',
    year: '2023',
    title: 'Menjalin Kasih',
    narrative:
      'Setelah dua tahun bertumbuh sebagai sahabat, kami memutuskan melangkah bersama dengan saling mendukung mimpi masing-masing.',
  },
  {
    chapter: '03',
    year: '2025',
    title: 'Khitbah & Lamaran',
    narrative:
      'Di hadapan kedua keluarga besar di rangkasbitung, Fadil menyampaikan niat tulus untuk meminang Indhea menuju ikatan suci.',
  },
  {
    chapter: '04',
    year: '2027',
    title: 'Menuju Pelaminan',
    narrative:
      'Dengan memohon rahmat dan rida Allah SWT, kami mengundang Anda menjadi saksi awal babak baru kehidupan kami.',
  },
];

export const GALLERY_PHOTOS: GalleryItem[] = [
  {
    id: 'coastal-walk',
    src: coastalImg,
    alt: 'Fadil dan Indhea berjalan berpegangan tangan di tepi pantai saat senja',
    caption: 'Senja di Pesisir',
    location: 'Uluwatu · Sesi Pre-Wedding',
    span: 'lead',
  },
  {
    id: 'garden-arch',
    src: gardenImg,
    alt: 'Fadil dan Indhea tersenyum di bawah lengkungan mawar dusty rose',
    caption: 'Di Bawah Lengkungan Mawar',
    location: 'Villa Taman · Sesi Pre-Wedding',
    span: 'standard',
  },
  {
    id: 'coastal-altar',
    src: coverImg,
    alt: 'Altar pernikahan dengan rangkaian bunga mawar pastel menghadap samudra biru',
    caption: 'Nuansa Ocean Rose',
    location: 'Dekorasi Impian · Banten',
    span: 'standard',
  },
  {
    id: 'bride-study',
    src: brideImg,
    alt: 'Potret Indhea dalam balutan kebaya modern putih gading dan dusty rose',
    caption: 'Anggun dalam Kebaya Gading',
    location: 'Potret Mempelai Wanita',
    span: 'standard',
  },
  {
    id: 'groom-study',
    src: groomImg,
    alt: 'Potret Fadil mengenakan jas biru laut dengan bunga mawar dusty rose',
    caption: 'Mantap Melangkah',
    location: 'Potret Mempelai Pria',
    span: 'standard',
  },
];

export const GIFT_ADDRESS = {
  recipient: 'Fadil Miftah Fauzi & Indhea Ayu Oxza',
  phone: '+62 821-1560-****',
  address: 'Citra Gading [mau alamat siapa]',
};

export const INITIAL_COMMENTS: GuestComment[] = [
  {
    id: 1,
    name: 'Budi contoh',
    attendance: 'Hadir',
    message:
      'Selamat menempuh hidup baru Fadil & Indhea! Semoga lancar hingga hari H dan menjadi keluarga yang sakinah, mawaddah, warahmah.',
    timestamp: '2 jam lalu',
  },
  {
    id: 2,
    name: 'Siti contoh',
    attendance: 'Hadir',
    message:
      'Turut berbahagia untuk kalian berdua. Undangan bernuansa Ocean Rose ini manis sekali, sampai jumpa di Rangkasbitung!',
    timestamp: '1 hari lalu',
  },
  {
    id: 3,
    name: 'Dimas & Nadia contoh',
    attendance: 'Tidak Hadir',
    message:
      'Mohon maaf belum bisa hadir langsung karena tugas di luar kota, namun doa terbaik kami selalu menyertai pernikahan Fadil & Indhea.',
    timestamp: '2 hari lalu',
  },
];

export function downloadWeddingIcs() {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Fadil & Indhea//Wedding Invitation//ID',
    'BEGIN:VEVENT',
    'UID:fadil-indhea-20270404@wedding',
    'DTSTAMP:20261115T000000Z',
    'DTSTART:20270404T010000Z',
    'DTEND:20270404T073000Z',
    'SUMMARY:Pernikahan Fadil & Indhea',
    'DESCRIPTION:Akad Nikah (08:00 WIB) & Resepsi Pernikahan (11:00 WIB) di Gedung Serbaguna La Tansa, Rangkasbitung.',
    'LOCATION:Gedung Serbaguna La Tansa, Jl. Soekarno-Hatta, Rangkasbitung, Lebak, Banten',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Pernikahan-Fadil-Indhea.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
