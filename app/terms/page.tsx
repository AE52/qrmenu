'use client';

import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Divider,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import Link from 'next/link';
import { format } from 'date-fns';

export default function TermsPage() {
  const lastUpdated = format(new Date(2023, 11, 15), 'dd MMMM yyyy');

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="md">
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4 }}>
          <MuiLink component={Link} underline="hover" color="inherit" href="/">
            Ana Sayfa
          </MuiLink>
          <Typography color="text.primary">Kullanım Şartları</Typography>
        </Breadcrumbs>
        
        <Paper elevation={2} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Kullanım Şartları
          </Typography>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            Son güncellenme: {lastUpdated}
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="body1" paragraph>
            QR Menü Sistemi'ne hoş geldiniz. Bu kullanım şartları, QR Menü Sistemi web sitesini ve hizmetlerini kullanımınızı düzenlemektedir. Lütfen bu şartları dikkatlice okuyun. Sitemizi veya hizmetlerimizi kullanarak, bu şartları kabul etmiş olursunuz.
          </Typography>
          
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            1. Tanımlar
          </Typography>
          
          <Typography variant="body1" paragraph>
            Bu kullanım şartlarında:
          </Typography>
          
          <Typography component="ul" sx={{ pl: 4 }}>
            <Typography component="li" variant="body1" paragraph>
              <strong>"QR Menü Sistemi", "biz", "bizim"</strong> ifadeleri QR Menü Sistemi ve işletmecilerini,
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              <strong>"Hizmet"</strong> ifadesi, QR Menü Sistemi tarafından sunulan tüm dijital menü ve ilgili hizmetleri,
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              <strong>"Kullanıcı", "siz", "sizin"</strong> ifadeleri bu hizmeti kullanan kişi veya kuruluşu,
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              <strong>"İçerik"</strong> ifadesi, menü öğeleri, görseller, metinler ve hizmete yüklenen veya hizmet aracılığıyla erişilebilen diğer materyalleri ifade eder.
            </Typography>
          </Typography>
          
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            2. Hesap Kaydı
          </Typography>
          
          <Typography variant="body1" paragraph>
            QR Menü Sistemi'ni kullanmak için bir hesap oluşturmanız gerekebilir. Kaydolduğunuzda doğru, güncel ve eksiksiz bilgiler sağlama sorumluluğunuz vardır. Hesap bilgilerinizin gizliliğini korumak ve hesabınızla ilgili tüm etkinliklerden sorumlu olmak sizin sorumluluğunuzdadır. Hesabınızın yetkisiz kullanımı durumunda bize derhal bildirmeniz gerekmektedir.
          </Typography>
          
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            3. Hizmet Kullanımı
          </Typography>
          
          <Typography variant="body1" paragraph>
            QR Menü Sistemi'ni kullanırken:
          </Typography>
          
          <Typography component="ul" sx={{ pl: 4 }}>
            <Typography component="li" variant="body1" paragraph>
              Hizmeti yasalara uygun şekilde kullanacağınızı,
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Başkalarının haklarına saygı göstereceğinizi,
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Sistemi kötüye kullanmayacağınızı,
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Yanıltıcı veya aldatıcı menü bilgileri yayınlamayacağınızı,
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Hizmeti virüsler veya zararlı yazılımlar yaymak için kullanmayacağınızı,
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Hizmete yetkisiz erişim sağlamaya çalışmayacağınızı,
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Hizmeti, diğer kullanıcıların zararına olacak şekilde kullanmayacağınızı kabul edersiniz.
            </Typography>
          </Typography>
          
          <Typography variant="body1" paragraph>
            Bu şartlara uymamanız durumunda, hesabınızı geçici olarak askıya alma veya kalıcı olarak sonlandırma hakkını saklı tutarız.
          </Typography>
          
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            4. İçerik ve Fikri Mülkiyet
          </Typography>
          
          <Typography variant="body1" paragraph>
            QR Menü Sistemi aracılığıyla paylaştığınız veya yüklediğiniz tüm içeriğin (menü görselleri, ürün açıklamaları, logolar vb.) sahibi sizsiniz. Bu içeriği yayınlama hakkına sahip olduğunuzu ve içeriğin yasa dışı veya bu şartları ihlal etmediğini garanti edersiniz.
          </Typography>
          
          <Typography variant="body1" paragraph>
            Bize, hizmeti sağlamamız için gerekli olan içeriğinizi kullanma, çoğaltma, işleme, uyarlama, yayınlama, tercüme etme, dağıtma, performans gösterme ve görüntüleme konusunda dünya çapında, telifsiz, devredilemeyen, alt lisanslanabilir, özel olmayan bir lisans verirsiniz.
          </Typography>
          
          <Typography variant="body1" paragraph>
            QR Menü Sistemi, tüm hakları, mülkiyeti ve çıkarları (tüm fikri mülkiyet hakları dahil) hizmetin kendisine aittir. Bu anlaşma size bu hakları devretmez.
          </Typography>
          
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            5. Hizmet Ücreti ve Ödemeler
          </Typography>
          
          <Typography variant="body1" paragraph>
            QR Menü Sistemi'nin bazı özellikleri ücretli olabilir. Ücretli bir abonelik satın aldığınızda, abonelik ücretini ve yenileme politikasını açıkça belirteceğiz. Tüm ödemeler iade edilemez niteliktedir ve gelecekteki ödemeleri garanti altına almak için otomatik yenileme özelliğini etkinleştirebiliriz.
          </Typography>
          
          <Typography variant="body1" paragraph>
            Ödemeleri zamanında yapmamanız durumunda, hesabınızı askıya alma veya sonlandırma hakkımız saklıdır. Ödemelere ilişkin anlaşmazlıklarda geçerli fiyatlandırma, web sitemizde veya hizmet içinde yayınlanan güncel fiyatlardır.
          </Typography>
          
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            6. Sorumluluk Reddi
          </Typography>
          
          <Typography variant="body1" paragraph>
            QR Menü Sistemi "OLDUĞU GİBİ" ve "MEVCUT OLDUĞU KADAR" sunulmaktadır. Hizmeti kullanımınız kendi sorumluluğunuzdadır. Hizmetin kesintisiz, zamanında, güvenli veya hatasız olacağını garanti etmiyoruz.
          </Typography>
          
          <Typography variant="body1" paragraph>
            Menüde yer alan ürünlerin besin değerleri, alerjenler ve diğer içerik bilgilerinin doğruluğu, restoran sahibinin sorumluluğundadır. QR Menü Sistemi, bu bilgilerin doğruluğu konusunda herhangi bir garanti vermez.
          </Typography>
          
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            7. Sorumluluk Sınırlaması
          </Typography>
          
          <Typography variant="body1" paragraph>
            Geçerli yasaların izin verdiği azami ölçüde, QR Menü Sistemi ve iş ortakları, yöneticileri, çalışanları ve temsilcileri, hizmetin kullanımından veya kullanılamamasından kaynaklanan herhangi bir doğrudan, dolaylı, arızi, özel, sonuç niteliğindeki veya cezai zararlardan sorumlu olmayacaktır.
          </Typography>
          
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            8. Tazminat
          </Typography>
          
          <Typography variant="body1" paragraph>
            Bu Kullanım Şartları'nı ihlal etmenizden veya üçüncü taraf haklarını ihlal etmenizden kaynaklanan herhangi bir iddia, talep, zarar, yükümlülük ve masrafa (makul avukatlık ücretleri dahil) karşı QR Menü Sistemi ve yöneticilerini, çalışanlarını savunmayı, tazmin etmeyi ve zararsız tutmayı kabul edersiniz.
          </Typography>
          
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            9. Anlaşmanın Feshi
          </Typography>
          
          <Typography variant="body1" paragraph>
            İstediğiniz zaman hesabınızı kapatarak bu anlaşmayı feshedebilirsiniz. Ayrıca, bu şartları ihlal etmeniz durumunda, önceden bildirmeksizin hizmetimizi kullanma hakkınızı sonlandırabiliriz.
          </Typography>
          
          <Typography variant="body1" paragraph>
            Fesih durumunda, hesabınızdaki tüm veriler silinebilir. Ücretli hizmetler için fesih politikamız, satın alma sırasında belirtilen koşullara göre uygulanacaktır.
          </Typography>
          
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            10. Şartların Değiştirilmesi
          </Typography>
          
          <Typography variant="body1" paragraph>
            Bu Kullanım Şartları'nı zaman zaman güncelleyebiliriz. Önemli değişiklikler yaptığımızda, web sitemizde duyuru yayınlayarak veya size e-posta göndererek bilgi vereceğiz. Değişikliklerden sonra hizmeti kullanmaya devam etmeniz, güncellenmiş şartları kabul ettiğiniz anlamına gelir.
          </Typography>
          
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            11. Genel Hükümler
          </Typography>
          
          <Typography variant="body1" paragraph>
            Bu anlaşma, QR Menü Sistemi ve sizin aranızdaki tam anlaşmayı temsil eder ve daha önceki tüm anlaşmaları geçersiz kılar. Bu anlaşmanın herhangi bir hükmünün uygulanamaz olması durumunda, bu hüküm, anlaşmanın geri kalanı geçerliliğini koruyacak şekilde minimum düzeyde değiştirilecektir.
          </Typography>
          
          <Typography variant="body1" paragraph>
            Bu şartları uygulamamamız, gelecekte uygulama hakkımızdan feragat ettiğimiz anlamına gelmez. Bu anlaşma, Türkiye Cumhuriyeti yasalarına tabidir ve tüm anlaşmazlıklar Türkiye mahkemelerinde çözülecektir.
          </Typography>
          
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            12. Bize Ulaşın
          </Typography>
          
          <Typography variant="body1" paragraph>
            Bu Kullanım Şartları hakkında herhangi bir sorunuz veya öneriniz varsa, lütfen bizimle iletişime geçin:
          </Typography>
          
          <Typography variant="body1">
            <strong>E-posta:</strong> info@qrmenusistemi.com<br />
            <strong>Adres:</strong> Merkez Mah. Şişli, İstanbul, Türkiye<br />
            <strong>Telefon:</strong> +90 (212) 123 45 67
          </Typography>
          
          <Divider sx={{ my: 4 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <MuiLink component={Link} href="/privacy" underline="hover">
              Gizlilik Politikası
            </MuiLink>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
} 