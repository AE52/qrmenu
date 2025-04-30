'use client';

import { useState } from 'react';
import Link from 'next/link';
// MUI ikonları yerine basit yer tutucular veya SVG'ler kullanılabilir
// import PhoneIcon from '@mui/icons-material/Phone';
// import EmailIcon from '@mui/icons-material/Email';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
// import WhatsAppIcon from '@mui/icons-material/WhatsApp';
// import SendIcon from '@mui/icons-material/Send';

// Basit SVG ikonlar (örnek)
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>;
const EmailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>;
const LocationOnIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>;
const WhatsAppIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" className="w-6 h-6"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.932 7.932 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>;


export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    contactType: 'genel',
    restaurantCount: '1-5'
  });
  
  const [formErrors, setFormErrors] = useState({
    fullName: false,
    email: false,
    message: false
  });
  
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const validateForm = () => {
    const errors = {
      fullName: formData.fullName.trim() === '',
      email: !/^\S+@\S+\.\S+$/.test(formData.email), // Basit email validasyonu
      message: formData.message.trim() === ''
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSnackbarMessage('Lütfen gerekli alanları doldurun.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      setTimeout(() => setOpenSnackbar(false), 6000); // Snackbar'ı gizle
      return;
    }
    
    console.log('Form verileri:', formData);
    setSnackbarMessage('Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
    setTimeout(() => setOpenSnackbar(false), 6000); // Snackbar'ı gizle
    
    setFormData({ // Formu temizle
      fullName: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      message: '',
      contactType: 'genel',
      restaurantCount: '1-5'
    });
  };

  const contactOptions = [
    { value: 'genel', label: 'Genel Bilgi' },
    { value: 'satis', label: 'Satış Bilgisi' },
    { value: 'teknik', label: 'Teknik Destek' },
    { value: 'kurumsal', label: 'Kurumsal Çözümler' }
  ];

  const restaurantCountOptions = [
    { value: '1-5', label: '1-5 Restoran' },
    { value: '6-20', label: '6-20 Restoran' },
    { value: '21-50', label: '21-50 Restoran' },
    { value: '50+', label: '50+ Restoran' }
  ];

  const faqItems = [
    { q: 'Demo talebinde bulunabilir miyim?', a: 'Evet, QR Menü Sistemi\'nin tüm özelliklerini görmek için demo talebinde bulunabilirsiniz. İletişim formu üzerinden "Demo Talebi" seçeneğiyle başvurunuzu yapabilirsiniz.' },
    { q: 'Teknik destek ne kadar sürede yanıt veriyor?', a: 'Standart paketlerde 24 saat içerisinde, Premium paketlerde ise 2 saat içerisinde teknik destek ekibimiz sorularınıza yanıt vermektedir.' },
    { q: 'Kurumsal çözümler için kimle görüşmeliyim?', a: '10\'dan fazla restoranınız varsa veya özel gereksinimleriniz için kurumsal çözümler sunuyoruz. İletişim formunda "Kurumsal Çözümler" seçeneğini işaretlemeniz yeterlidir.' },
    { q: 'Ofiste yüz yüze toplantı yapabilir miyiz?', a: 'Elbette, İstanbul ofisimizde yüz yüze toplantı için randevu alabilirsiniz. İletişim bilgilerimizden bize ulaşarak uygun bir tarih belirleyebiliriz.' }
  ];

  // Input stili için ortak sınıflar
  const inputBaseClass = "w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out bg-gray-50";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const errorTextClass = "text-red-600 text-xs mt-1";

  return (
    <div className="py-12 md:py-20 bg-gray-50"> {/* Ana arkaplan rengi */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Container */}
        
        {/* Başlık Bölümü */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
            İletişime Geçin
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Sorularınız mı var veya yardıma mı ihtiyacınız var? Aşağıdaki formu doldurun, ekibimiz en kısa sürede size ulaşacaktır.
          </p>
        </div>

        {/* Ana İçerik - Dikey Stack */}
        <div className="space-y-12 md:space-y-16">
          
          {/* İletişim Bilgileri */}
          <section>
             <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Diğer Ulaşım Yolları
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center md:text-left">
              {/* İletişim Öğesi */}
              <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-3">
                <span className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-2 sm:mb-0">
                  <PhoneIcon />
                </span>
                <div>
                  <h3 className="font-medium text-gray-800">Telefon</h3>
                  <p className="text-gray-600 text-sm">+90 (212) 123 45 67</p>
                </div>
              </div>
               {/* İletişim Öğesi */}
              <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-3">
                <span className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-2 sm:mb-0">
                  <EmailIcon />
                </span>
                <div>
                  <h3 className="font-medium text-gray-800">E-posta</h3>
                  <p className="text-gray-600 text-sm">info@qrmenusistemi.com</p>
                </div>
              </div>
               {/* İletişim Öğesi */}
              <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-3">
                <span className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-2 sm:mb-0">
                  <WhatsAppIcon />
                </span>
                <div>
                  <h3 className="font-medium text-gray-800">WhatsApp</h3>
                  <p className="text-gray-600 text-sm">+90 (555) 123 45 67</p>
                </div>
              </div>
               {/* İletişim Öğesi */}
               <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-3">
                <span className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-2 sm:mb-0">
                  <LocationOnIcon />
                </span>
                <div>
                  <h3 className="font-medium text-gray-800">Adres</h3>
                  <p className="text-gray-600 text-sm">Merkez Mah. Şişli, İstanbul</p>
                </div>
              </div>
            </div>
            
            {/* Çalışma Saatleri */}
            <div className="mt-8 text-center text-gray-500 text-sm">
              <p>Çalışma Saatleri: Hafta içi 09:00 - 18:00, Cmt 10:00 - 14:00</p>
              <p>(Teknik destek 7/24 hizmetinizdedir)</p>
            </div>
          </section>

          {/* İletişim Formu */}
          <section>
             <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Mesaj Gönderin
            </h2>
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto"> {/* Formu ortala */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5"> {/* Grid yapısı */}
                {/* Ad Soyad */}
                <div>
                  <label htmlFor="fullName" className={labelClass}>Adınız Soyadınız *</label>
                  <input 
                    type="text" 
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required 
                    className={`${inputBaseClass} ${formErrors.fullName ? 'border-red-500 ring-red-500' : ''}`} 
                  />
                  {formErrors.fullName && <p className={errorTextClass}>Ad soyad gerekli</p>}
                </div>
                {/* E-posta */}
                <div>
                  <label htmlFor="email" className={labelClass}>E-posta Adresiniz *</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required 
                    className={`${inputBaseClass} ${formErrors.email ? 'border-red-500 ring-red-500' : ''}`} 
                  />
                   {formErrors.email && <p className={errorTextClass}>Geçerli bir e-posta adresi girin</p>}
                </div>
                 {/* Telefon */}
                 <div>
                  <label htmlFor="phone" className={labelClass}>Telefon Numaranız <span className='text-gray-400'>(İsteğe bağlı)</span></label>
                  <input 
                    type="tel" 
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputBaseClass}
                  />
                </div>
                 {/* Şirket Adı */}
                 <div>
                  <label htmlFor="company" className={labelClass}>Şirket Adı <span className='text-gray-400'>(İsteğe bağlı)</span></label>
                  <input 
                    type="text" 
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className={inputBaseClass}
                  />
                </div>
                {/* İlgilenilen Konu */}
                 <div>
                   <label htmlFor="contactType" className={labelClass}>İlgilendiğiniz Konu</label>
                   <select 
                     id="contactType" 
                     name="contactType" 
                     value={formData.contactType}
                     onChange={handleChange}
                     className={inputBaseClass}
                   >
                     {contactOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                   </select>
                 </div>
                 {/* Restoran Sayısı */}
                 <div>
                  <label htmlFor="restaurantCount" className={labelClass}>Restoran Sayısı <span className='text-gray-400'>(Tahmini)</span></label>
                   <select 
                     id="restaurantCount" 
                     name="restaurantCount" 
                     value={formData.restaurantCount}
                     onChange={handleChange}
                     className={inputBaseClass}
                   >
                     {restaurantCountOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                   </select>
                 </div>
                 {/* Konu */}
                 <div className="sm:col-span-2">
                   <label htmlFor="subject" className={labelClass}>Konu</label>
                   <input 
                    type="text" 
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={inputBaseClass}
                  />
                 </div>
                 {/* Mesaj */}
                <div className="sm:col-span-2"> {/* 2 sütun kaplasın */}
                  <label htmlFor="message" className={labelClass}>Mesajınız *</label>
                  <textarea 
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className={`${inputBaseClass} ${formErrors.message ? 'border-red-500 ring-red-500' : ''}`} 
                  ></textarea>
                   {formErrors.message && <p className={errorTextClass}>Mesaj içeriği gerekli</p>}
                </div>
                 {/* Buton */}
                 <div className="sm:col-span-2 text-center mt-4">
                   <button 
                    type="submit" 
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                  >
                    <SendIcon />
                    <span className="ml-2">Mesajı Gönder</span>
                  </button>
                 </div>
              </div>
            </form>
          </section>

          {/* SSS Bölümü */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Sık Sorulan Sorular
            </h2>
            <div className="max-w-xl mx-auto space-y-4"> {/* Ortala ve dikey boşluk */}
              {faqItems.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {faq.q}
                  </h3>
                  <p className="text-gray-600">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* Snackbar Bildirimi (Tailwind ile basit implementasyon) */}
      {openSnackbar && (
        <div 
          className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-md shadow-lg text-white ${snackbarSeverity === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
          role="alert"
        >
          {snackbarMessage}
          <button 
            onClick={() => setOpenSnackbar(false)} 
            className="absolute top-1 right-1 p-1 text-white hover:bg-white hover:bg-opacity-20 rounded-full"
            aria-label="Kapat"
          >
            {/* Basit Kapat ikonu */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
    </div>
  );
} 