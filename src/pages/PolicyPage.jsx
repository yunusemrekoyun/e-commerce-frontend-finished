// /components/PolicyPage.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./PolicyPage.css";

const PolicyPage = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  }, [hash]);

  return (
    <div className="policy-page container">
      <section id="gizlilik">
        <h2>Gizlilik Politikası</h2>
        <p>
          ÜNKO KOZMETİK olarak kullanıcılarımızın gizliliğine büyük önem
          veriyoruz. Kişisel bilgileriniz yalnızca sipariş işlemleri, kullanıcı
          deneyimi geliştirme ve yasal yükümlülükler kapsamında
          kullanılmaktadır. Üçüncü taraflarla paylaşımı yalnızca hizmet
          sağlayıcılarla sınırlıdır.
        </p>
        <p>
          Verileriniz SSL şifreleme ile korunur. Her kullanıcı, dilediği zaman
          kişisel veri talebi, güncelleme veya silme hakkına sahiptir.
        </p>
      </section>

      <section id="kosullar">
        <h2>Şartlar ve Koşullar</h2>
        <p>
          Web sitemizi kullanan her ziyaretçi, aşağıda belirtilen şartları kabul
          etmiş sayılır:
        </p>
        <ul>
          <li>
            Sitedeki tüm içerik bilgilendirme amaçlıdır ve değiştirilebilir.
          </li>
          <li>
            Kullanıcı bilgileri doğru olmalı, sahte sipariş verilmemelidir.
          </li>
          <li>
            Ürün fiyatları, kampanyalar ve stok durumu önceden haber
            verilmeksizin değişebilir.
          </li>
        </ul>
        <p>
          Tüm kullanıcılar, hizmeti kullanmaya devam ettikleri sürece bu
          koşulları kabul eder.
        </p>
      </section>

      <section id="iade">
        <h2>İade Politikası</h2>
        <p>
          Satın aldığınız ürünleri, teslimat tarihinden itibaren 14 gün içinde
          iade edebilirsiniz.
        </p>
        <ul>
          <li>
            İade edilecek ürünler kullanılmamış ve ambalajı bozulmamış
            olmalıdır.
          </li>
          <li>İade işlemlerinde fatura ibrazı zorunludur.</li>
          <li>
            Kozmetik ürünlerde hijyen kuralları gereği ambalajı açılmış ürünler
            iade alınmaz.
          </li>
        </ul>
        <p>
          İade işlemleri onaylandıktan sonra ücret iadesi 7-10 iş günü içinde
          yapılır.
        </p>
      </section>
    </div>
  );
};

export default PolicyPage;
