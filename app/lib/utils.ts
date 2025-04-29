// Fiyat formatını Türk Lirası olarak ayarlayan fonksiyon
export function formatCurrency(price: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2
  }).format(price);
} 