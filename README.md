# Drool Smash Burger

Statik frontend. Giriş dosyası: `dist/index.html`.
Yerelde çalıştırma: `python -m http.server 4185 --directory dist`.

Animasyonlar görünür alanın %28'ine ulaştığında başlar, bir kez oynar ve son karede kalır. Tamamen görünüm dışına çıkınca durur ve sıfırlanır. Tekrar görünür olunca baştan oynar. Sekme gizlendiğinde de durur. Hareket azaltma tercihi desteklenir. Cam sahnesinde veya videoda oynatma/tekrar butonları bulunmaz.

Milhungry referansından alınan yaklaşım: büyük condensed başlıklar, fotoğraf merkezli bölümler, görünürlüğe bağlı animasyonlar. Renkler ve içerik Drool için yeniden tasarlandı.

İşletme adı, adres, telefon, Google puanı ve yorum sayısı kullanıcı tarafından sağlandı. Google puanı canlı bir entegrasyon değildir. Saat bilgisi eklenmedi. Görseller ve video kullanıcı tarafından sağlandı; cam animasyonu önceki çalışmadan uyarlandı. Ürün fotoğrafları metinlerle eşleştirildi. Sipariş bağlantısı ve burger içerikleri Yemeksepeti restoran sayfasından kontrol edildi: https://www.yemeksepeti.com/restaurant/wesk/drool-smash-burger

Instagram: https://www.instagram.com/droolsmashburger/

Ürün fiyatları değişken olduğu için sitede gösterilmez; güncel menüye doğrudan bağlantı vardır. Harita bağlantısı adresi arar; kesin koordinat uydurulmadı. İletişim formu ve kişisel veri toplama yoktur.
