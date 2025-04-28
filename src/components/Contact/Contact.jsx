import "./Contact.css";

const Contact = () => {
  return (
    <section className="contact">
      <div className="contact-top">
        <div className="contact-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3057.714856601749!2d32.61829347618013!3d39.970127471514964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d330b19fab209b%3A0xf3732525d9d12183!2s%C3%9Cn-Ko%20Kozmetik!5e0!3m2!1str!2str!4v1745801163902!5m2!1str!2str"
            height="500"
            style={{ border: "0" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <div className="contact-bottom">
        <div className="container">
          <div className="contact-elements" style={{ justifyContent: "center" }}>
            <div className="contact-info">
              <div className="contact-info-item">
                <div className="contact-info-texts">
                  <strong> ÜNKO Kozmetik</strong>
                  <p className="contact-street">
                
                  Eryaman, 2. Cd. AVM Eryaman D:11/9, 06824 Etimesgut/Ankara
                  </p>
                  <a href="tel:+9005525395910">Telefon: +905525395910</a>
                  <a href="mailto:contact@example.com">
                    Email: info@ünkokozmetik.com
                  </a>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-texts">
                  <strong> Açık Saatler</strong>
                  <p className="contact-date">Pazartesi-Cumartesi : 9.00 - 18.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;