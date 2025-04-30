'use client';

import Image from 'next/image';
import Link from 'next/link';

// MUI ikonları yerine SVG'ler
const RestaurantIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h.008v.008H8.25V18zm-1.259 0h.008v.008h-.008V18zM10.5 16.5h.008v.008H10.5V16.5zm1.871-1.5h.008v.008h-.008V15zm1.872-1.5h.008v.008h-.008v-.008zm3.751-1.5h.008v.008h-.008V12zm1.87-1.5h.008v.008h-.008V10.5z" /></svg>;
const GroupsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>;
const WorkspacePremiumIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.4-1.683 3.058a9.049 9.049 0 01-1.262 5.384 1.002 1.002 0 01-.858.658h-.114a1 1 0 01-.858-.658 9.052 9.052 0 01-1.262-5.384A4.497 4.497 0 0112 16.5c-1.268 0-2.4-.63-3.058-1.683a9.049 9.049 0 01-5.384-1.262 1.002 1.002 0 01-.658-.858v-.114a1 1 0 01.658-.858 9.052 9.052 0 015.384-1.262A4.497 4.497 0 017.5 12c0-1.268.63-2.4 1.683-3.058a9.049 9.049 0 011.262-5.384c.17-.56.683-.942 1.262-.942h.114c.579 0 1.092.382 1.262.942a9.052 9.052 0 011.262 5.384A4.497 4.497 0 0116.5 12c1.268 0 2.4.63 3.058 1.683a9.049 9.049 0 015.384 1.262c.56.17.942.683.942 1.262v.114c0 .579-.382 1.092-.942 1.262a9.052 9.052 0 01-5.384 1.262A4.497 4.497 0 0121 12z" /></svg>;
const RocketLaunchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 2.42A14.98 14.98 0 002.42 9.63A14.98 14.98 0 007.38 15.59m8.21-1.22a6 6 0 01-7.38 5.84m4.8 0a6 6 0 01-5.84-7.38 6 6 0 017.38-5.84 6 6 0 015.84 7.38 6 6 0 01-7.38 5.84z" /></svg>;
const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>;
const PublicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" /></svg>;

export default function AboutPage() {
  const milestones = [
    {
      year: '2019',
      title: 'Fikrin Doğuşu',
      description: 'QR Menü fikri, kurucu ekibimizin restoran sektöründeki dijital dönüşüm ihtiyacını tespit etmesiyle ortaya çıktı.',
      icon: <RocketLaunchIcon />
    },
    {
      year: '2020',
      title: 'İlk Versiyon Lansmanı',
      description: 'COVID-19 pandemisiyle beraber hızlanan temassız çözüm ihtiyacına cevap vererek ilk versiyonumuzu 10 pilot restoranla test ettik.',
      icon: <RestaurantIcon />
    },
    {
      year: '2021',
      title: 'Büyüme ve Gelişme',
      description: '500+ restorana ulaştık ve ürünümüzü müşteri geri bildirimleriyle geliştirerek premium özellikleri ekledik.',
      icon: <TrendingUpIcon />
    },
    {
      year: '2022',
      title: 'Uluslararası Genişleme',
      description: 'Türkiye dışında 5 ülkede daha hizmet vermeye başladık ve çoklu dil desteği ekledik.',
      icon: <PublicIcon />
    },
    {
      year: '2023',
      title: 'Ödüller ve Tanınma',
      description: 'Restoran teknolojileri alanında "Yılın Yenilikçi Çözümü" ödülünü kazandık ve 2000+ aktif kullanıcıya ulaştık.',
      icon: <WorkspacePremiumIcon />
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Hakkımızda
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Restoranların dijital dönüşümüne öncülük eden QR Menü Sistemi'nin hikayesini keşfedin.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="mb-16 bg-gray-50 p-8 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold text-blue-600 mb-3">
                Misyonumuz
              </h2>
              <p className="text-gray-700 mb-2">
                Restoran ve kafelerin, müşterilerine modern ve temassız bir menü deneyimi sunmalarını sağlayarak hem işletme verimliliğini artırmak hem de müşteri memnuniyetini yükseltmek.
              </p>
              <p className="text-gray-700">
                Dijital dönüşümü karmaşık teknolojilerden arındırarak, tüm büyüklükteki işletmelerin kolayca adapte olabileceği kullanıcı dostu bir çözüm sunmak.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-blue-600 mb-3">
                Vizyonumuz
              </h2>
              <p className="text-gray-700 mb-2">
                Restoran teknolojileri alanında öncü bir platform olarak, yeme-içme sektöründeki dijital dönüşümün standartlarını belirlemek ve global ölçekte yaygınlaşmak.
              </p>
              <p className="text-gray-700">
                Sürdürülebilir çözümler sunarak işletmelerin basılı menülerini azaltmalarına yardımcı olmak ve çevresel etkileri minimize etmek.
              </p>
            </div>
          </div>
        </section>

        {/* Company Story Timeline - Basitleştirilmiş Dikey Timeline */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            Yolculuğumuz
          </h2>
          <div className="relative max-w-2xl mx-auto">
            {/* Dikey çizgi */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300 hidden sm:block" aria-hidden="true"></div>
            
            {milestones.map((milestone, index) => (
              <div key={index} className="relative pl-12 pb-10 sm:pl-0 sm:grid sm:grid-cols-12 sm:gap-x-8">
                 {/* Yıl ve Nokta (Mobil) */}
                 <div className="sm:hidden flex items-center space-x-4 mb-3">
                    <span className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full text-white">
                        {milestone.icon}
                    </span>
                    <p className="text-lg font-semibold text-gray-600">{milestone.year}</p>
                 </div>

                 {/* Yıl (Desktop) */}
                 <div className="hidden sm:block sm:col-span-3 text-right">
                     <p className="text-lg font-semibold text-gray-600 mt-2">{milestone.year}</p>
                 </div>

                 {/* Nokta ve Çizgi (Desktop) */}
                  <div className="hidden sm:block sm:col-span-1 relative">
                    <div className="absolute left-1/2 top-2 -translate-x-1/2 w-px h-full bg-gray-300"></div>
                    <span className="absolute left-1/2 top-2 -translate-x-1/2 flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full text-white">
                      {milestone.icon}
                    </span>
                  </div>

                 {/* İçerik */}
                 <div className="col-span-12 sm:col-span-8">
                     <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
                       <h3 className="text-xl font-semibold text-gray-800 mb-1">{milestone.title}</h3>
                       <p className="text-gray-600">{milestone.description}</p>
                     </div>
                 </div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Değerlerimiz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow border-t-4 border-blue-500">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Yenilikçilik
              </h3>
              <p className="text-gray-600">
                Sürekli gelişim ve teknolojik yenilikleri takip ederek müşterilerimize en güncel çözümleri sunmak için çalışıyoruz.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-t-4 border-blue-500">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Müşteri Odaklılık
              </h3>
              <p className="text-gray-600">
                Tüm kararlarımızda müşterilerimizin ihtiyaçlarını merkeze alıyor, onların başarısı için çözümler geliştiriyoruz.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-t-4 border-blue-500">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Sürdürülebilirlik
              </h3>
              <p className="text-gray-600">
                Dijital menü çözümlerimizle kağıt israfını azaltarak daha sürdürülebilir bir gelecek için sorumluluk alıyoruz.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="text-center bg-gray-50 p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Rakamlarla Biz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-4xl font-bold text-blue-600">
                2000+
              </p>
              <p className="text-lg text-gray-600 mt-1">
                Aktif Restoran
              </p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">
                6
              </p>
              <p className="text-lg text-gray-600 mt-1">
                Hizmet Verilen Ülke
              </p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">
                500,000+
              </p>
              <p className="text-lg text-gray-600 mt-1">
                Menü Görüntülenme/Ay
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 