import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabase';

/**
 * Resim dosyasını Supabase Storage'a yükler
 * @param file Yüklenecek dosya
 * @param filePath Storage içindeki dosya yolu
 * @returns Yüklenen dosyanın URL'i ve hata nesnesi
 */
export async function uploadImageBasic(file: File, filePath: string) {
  try {
    // Dosya yolu için bazı validasyonlar
    if (!file || !filePath) {
      throw new Error('Dosya veya dosya yolu belirtilmedi.');
    }

    // Supabase storage bucket'a yükle
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) throw error;

    // Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(data.path);

    return { publicUrl, error: null };
  } catch (error) {
    console.error('Dosya yükleme hatası:', error);
    return { publicUrl: null, error };
  }
}

export async function uploadImage(
  file: File,
  bucket: string,
  oldImageUrl?: string | null
) {
  try {
    // Dosya uzantısını al
    const fileExt = file.name.split('.').pop();
    // Benzersiz dosya adı oluştur
    const fileName = `${uuidv4()}.${fileExt}`;
    // Tam dosya yolu
    const filePath = `${fileName}`;

    console.log(`Dosya yükleniyor: ${fileName} | Bucket: ${bucket}`);

    // Eğer eski bir resim varsa ve eski resim URL'i belirtilmişse sil
    if (oldImageUrl) {
      try {
        const oldFileName = oldImageUrl.split('/').pop();
        if (oldFileName) {
          console.log(`Eski resim siliniyor: ${oldFileName}`);
          const { error: deleteError } = await supabase.storage.from(bucket).remove([oldFileName]);
          if (deleteError) {
            console.error('Eski resim silme hatası:', deleteError);
          }
        }
      } catch (deleteErr) {
        console.error('Eski resim silme işlemi başarısız:', deleteErr);
        // Silme hatası olsa bile yüklemeye devam et
      }
    }

    // Yeni resmi yükle
    console.log('Yeni resim yükleniyor...');
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        upsert: true, // Aynı isimde dosya varsa üzerine yaz
        cacheControl: '3600',
      });

    if (error) {
      console.error('Supabase Storage hata detayları:', error);
      throw new Error(`Resim yükleme hatası: ${error.message || 'Bilinmeyen hata'}`);
    }

    console.log('Resim başarıyla yüklendi. URL alınıyor...');
    // Resmin genel URL'ini döndür
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    
    if (!urlData || !urlData.publicUrl) {
      throw new Error('Resim URL\'i alınamadı');
    }
    
    console.log('İşlem tamamlandı. URL:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error: any) {
    console.error('Resim yükleme hatası:', error);
    // Hata mesajını daha detaylı olarak oluştur
    const errorMessage = error.message || 'Bilinmeyen bir hata oluştu';
    const detailedError = `Resim yükleme hatası: ${errorMessage}`;
    console.error(detailedError);
    throw new Error(detailedError);
  }
} 