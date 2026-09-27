# Drool Smash Burger

Restoranın ana sayfası, ürün menüsü ve alerjen bilgilerini içeren statik web sitesi.

## Yerelde çalıştırma

Proje klasöründe:

```sh
python -m http.server 4185 --directory dist
```

Ana sayfa: http://localhost:4185/
Menü: http://localhost:4185/menu.html

## Yayınlama

Vercel'de kök dizin repo kökü olmalıdır. `vercel.json` yayın klasörünü `dist` olarak ayarlar. Derleme veya paket kurulumu gerekmez.

## Dosyalar

- `dist/index.html`: Ana sayfa
- `dist/menu.html`: Menü ve fiyatlar
- `dist/menu.js`: Burger boy seçenekleri
- `dist/allergens.js`: Alerjen pencereleri
- `dist/assets/`: Ürün görselleri ve video

Ürün fiyatları ve alerjen bilgileri işletmenin sağladığı içeriklere dayanır; güncel tutulmalıdır. Google puanı ve yorum sayısı statik içeriktir.
