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

export default function PrivacyPage() {
  const lastUpdated = format(new Date(2023, 11, 15), 'dd MMMM yyyy');

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="md">
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4 }}>
          <MuiLink component={Link} underline="hover" color="inherit" href="/">
            Ana Sayfa
          </MuiLink>
          <Typography color="text.primary">Gizlilik Politikası</Typography>
        </Breadcrumbs>
        
        <Paper elevation={2} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Gizlilik Politikası
          </Typography>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            Son güncellenme: {lastUpdated}
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="body1" paragraph>
            QR Menü Sistemi olarak, gizliliğinize saygı duyuyor ve kişisel verilerinizin korunmasına önem veriyoruz. Bu gizlilik politikası, hizmetlerimizi kullanırken sizden topladığımız bilgileri nasıl işlediğimizi açıklamaktadır.
          </Typography>
          
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            1. Topladığımız Bilgiler
          </Typography>
          
          <Typography variant="body1" paragraph>
            QR Menü Sistemi'ni kullandığınızda, sizden aşağıdaki bilgileri toplayabiliriz:
          </Typography>
          
          <Typography component="ul" sx={{ pl: 4 }}>
            <Typography component="li" variant="body1" paragraph>
              <strong>Hesap Bilgileri:</strong> Ad, soyad, e-posta adresi, telefon numarası, restoran adı ve adresi gibi kaydolurken veya hesabınızı güncellediğinizde sağladığınız bilgiler.
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              <strong>Ödeme Bilgileri:</strong> Fatura adresi, kredi kartı bilgileri veya diğer ödeme bilgileri (bu bilgiler güvenli ödeme işlemcilerimiz tarafından saklanır, biz kredi kartı numaralarınızı saklamayız).
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              <strong>Kullanım Verileri:</strong> QR Menü Sistemimizi nasıl kullandığınıza dair veriler, erişim tarih ve saatleri, görüntülenen sayfalar, tarayıcı türü gibi bilgiler.
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              <strong>Cihaz Bilgileri:</strong> IP adresi, cihaz türü, işletim sistemi ve tarayıcı bilgileri gibi hizmetlerimize erişirken kullandığınız cihazla ilgili veriler.
            </Typography>
          </Typography>
          
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            2. Bilgileri Kullanma Amacımız
          </Typography>
          
          <Typography variant="body1" paragraph>
            Topladığımız bilgileri aşağıdaki amaçlarla kullanıyoruz:
          </Typography>
          
          <Typography component="ul" sx={{ pl: 4 }}>
            <Typography component="li" variant="body1" paragraph>
              Hesabınızı oluşturmak ve yönetmek
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              QR Menü hizmetlerimizi sağlamak ve iyileştirmek
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Müşteri desteği sağlamak
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Ödemelerinizi işleme almak
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Size güncellemeler, özel teklifler ve pazarlama bildirimleri göndermek (dilediğiniz zaman abonelikten çıkabilirsiniz)
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Güvenlik ve dolandırıcılık önleme amaçları
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Yasal yükümlülüklerimizi yerine getirmek
            </Typography>
          </Typography>
          
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            3. Bilgi Paylaşımı
          </Typography>
          
          <Typography variant="body1" paragraph>
            Kişisel bilgilerinizi aşağıdaki durumlar dışında üçüncü taraflarla paylaşmıyoruz:
          </Typography>
          
          <Typography component="ul" sx={{ pl: 4 }}>
            <Typography component="li" variant="body1" paragraph>
              <strong>Hizmet Sağlayıcılar:</strong> Hizmetlerimizi sunmamıza yardımcı olan ödeme işlemcileri, veri analizi, e-posta gönderimi, hosting hizmetleri ve müşteri hizmetleri gibi üçüncü taraf hizmet sağlayıcılarla.
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              <strong>Yasal Gereklilikler:</strong> Geçerli bir yasal süreç, mahkeme kararı veya diğer yasal gerekliliklere uymak gerektiğinde.
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              <strong>İş Ortakları:</strong> Sizin onayınız olduğunda veya talimatlarınız doğrultusunda iş ortaklarımızla.
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              <strong>İşletme Transferleri:</strong> Bir birleşme, satın alma veya varlık satışı durumunda, kişisel bilgileriniz aktarılan varlıklar arasında olabilir.
            </Typography>
          </Typography>
          
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            4. Veri Güvenliği
          </Typography>
          
          <Typography variant="body1" paragraph>
            Kişisel bilgilerinizin güvenliğini sağlamak için çeşitli güvenlik önlemleri kullanıyoruz. Buna SSL şifreleme, güvenli veri depolama ve düzenli güvenlik denetimleri dahildir. Ancak, internet üzerinden hiçbir veri iletiminin veya elektronik depolamanın %100 güvenli olmadığını lütfen unutmayın.
          </Typography>
          
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            5. Veri Saklama ve Silme
          </Typography>
          
          <Typography variant="body1" paragraph>
            Kişisel bilgilerinizi, hizmetlerimizi sağlamak için gerekli olduğu sürece veya yasal yükümlülüklerimizi yerine getirmek için saklarız. Hesabınızı sildiğinizde, kişisel bilgilerinizi sistemlerimizden sileriz veya anonim hale getiririz, ancak yasal gerekliliklere uymak için bazı bilgileri saklamamız gerekebilir.
          </Typography>
          
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            6. Çerezler ve Benzer Teknolojiler
          </Typography>
          
          <Typography variant="body1" paragraph>
            Hizmetlerimizde çerezler ve benzer izleme teknolojileri kullanıyoruz. Bu teknolojiler, deneyiminizi kişiselleştirmemize, kullanım analizlerini toplamamıza ve hizmetlerimizi iyileştirmemize yardımcı olur. Çerez ayarlarınızı tarayıcı ayarlarınızdan değiştirebilirsiniz, ancak bazı özellikler düzgün çalışmayabilir.
          </Typography>
          
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            7. Haklarınız
          </Typography>
          
          <Typography variant="body1" paragraph>
            Veri koruma yasalarına bağlı olarak, kişisel verilerinizle ilgili belirli haklara sahip olabilirsiniz. Bunlar arasında:
          </Typography>
          
          <Typography component="ul" sx={{ pl: 4 }}>
            <Typography component="li" variant="body1" paragraph>
              Kişisel verilerinize erişim talep etme hakkı
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Kişisel verilerinizin düzeltilmesini veya silinmesini talep etme hakkı
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Kişisel verilerinizin işlenmesine itiraz etme hakkı
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Veri taşınabilirliği hakkı
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              Denetleyici makamlara şikayette bulunma hakkı
            </Typography>
          </Typography>
          
          <Typography variant="body1" paragraph>
            Bu haklarınızı kullanmak istiyorsanız, lütfen aşağıdaki iletişim bilgilerini kullanarak bizimle iletişime geçin.
          </Typography>
          
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            8. Gizlilik Politikası Değişiklikleri
          </Typography>
          
          <Typography variant="body1" paragraph>
            Bu Gizlilik Politikası'nı zaman zaman güncelleyebiliriz. Herhangi bir değişiklik olduğunda, güncellenen politikayı web sitemizde yayınlayacağız ve gerektiğinde size bildirim göndereceğiz. Bu politikayı düzenli olarak gözden geçirmenizi öneririz.
          </Typography>
          
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            9. Bize Ulaşın
          </Typography>
          
          <Typography variant="body1" paragraph>
            Bu Gizlilik Politikası veya kişisel verilerinizin işlenmesi hakkında herhangi bir sorunuz veya endişeniz varsa, lütfen bizimle iletişime geçin:
          </Typography>
          
          <Typography variant="body1">
            <strong>E-posta:</strong> privacy@qrmenusistemi.com<br />
            <strong>Adres:</strong> Merkez Mah. Şişli, İstanbul, Türkiye<br />
            <strong>Telefon:</strong> +90 (212) 123 45 67
          </Typography>
          
          <Divider sx={{ my: 4 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <MuiLink component={Link} href="/terms" underline="hover">
              Kullanım Şartları
            </MuiLink>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
} 