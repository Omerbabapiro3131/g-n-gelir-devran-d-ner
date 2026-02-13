# CapyAI

CapyAI, kod yazma ve sohbet etme odaklı tek sayfa bir web uygulamasıdır.

## Özellikler

- Çimen yiyen capybara logosu.
- Gemini 2.5 Flash ile sohbet.
- Kullanıcı hangi dilde yazarsa, modele aynı dilde cevap vermesi için yönerge.
- IP adresini görüntüleme.
- IP ülke koduna göre otomatik arayüz dili:
  - `TR` ve diğerleri: Türkçe
  - `GB`: İngilizce
- Sayfa açıldığında iki aşamalı popup:
  1. IP popup
  2. "GÜN GELIR DEVRAN DÖNER CAPYAI YERINE GERI DÖNER" mesaj popup'u

## Çalıştırma

```bash
python3 -m http.server 4173
```

Ardından `http://localhost:4173` adresini açın.
