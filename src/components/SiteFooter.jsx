import { Link } from 'react-router-dom';
import { FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { FiArrowUpRight, FiHeart } from 'react-icons/fi';

const footerGroups = [
  {
    title: 'Explore',
    links: [
      { label: 'Casos clínicos', to: '/casos' },
      { label: 'Desafios visuais', to: '/desafios' },
      { label: 'Meu painel', to: '/dashboard' },
      { label: 'Planos', to: '/assinatura' },
    ],
  },
  {
    title: 'MedSync',
    links: [
      { label: 'Sobre o MedSync', to: '/sobre' },
      { label: 'Nossos diferenciais', to: '/diferenciais' },
      { label: 'Seja nosso embaixador', to: '/embaixadores' },
    ],
  },
  {
    title: 'Transparência',
    links: [
      { label: 'Termos de Uso', to: '/termos' },
      { label: 'Política de Privacidade', to: '/privacidade' },
    ],
  },
];

const SiteFooter = () => (
  <footer className="site-footer">
    <div className="site-footer-glow" aria-hidden="true" />
    <div className="site-footer-content">
      <div className="site-footer-main">
        <section className="footer-brand" aria-label="MedSync">
          <Link to="/" className="footer-wordmark">
            <span className="footer-brand-symbol" aria-hidden="true"><FiHeart /></span>
            <strong>MEDSYNC</strong>
          </Link>
          <p>
            Prática clínica guiada para estudantes de medicina que querem transformar
            conhecimento em decisões mais seguras.
          </p>
          <span className="footer-education-notice">
            Plataforma educacional. Não substitui avaliação, diagnóstico ou conduta médica.
          </span>

          <div className="footer-socials" aria-label="Redes sociais do MedSync">
            <a
              href="https://www.instagram.com/medsync.educacional/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram do MedSync"
            >
              <FaInstagram aria-hidden="true" />
              <span>Instagram</span>
              <FiArrowUpRight aria-hidden="true" />
            </a>
            <a
              href="https://www.tiktok.com/@medsync.edu?is_from_webapp=1&sender_device=pc"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok do MedSync"
            >
              <FaTiktok aria-hidden="true" />
              <span>TikTok</span>
              <FiArrowUpRight aria-hidden="true" />
            </a>
            <span className="footer-social-disabled" aria-label="WhatsApp do MedSync em breve" aria-disabled="true">
              <FaWhatsapp aria-hidden="true" />
              <span>WhatsApp</span>
              <small>Em breve</small>
            </span>
          </div>
        </section>

        <nav className="footer-navigation" aria-label="Links do rodapé">
          {footerGroups.map((group) => (
            <div className="footer-link-group" key={group.title}>
              <h2>{group.title}</h2>
              {group.links.map((link) => <Link key={link.to} to={link.to}>{link.label}</Link>)}
            </div>
          ))}
        </nav>
      </div>

      <div className="site-footer-bottom">
        <div>
          <p>Copyright © {new Date().getFullYear()} MedSync. Todos os direitos reservados.</p>
          <span>MEDSYNC TECNOLOGIA EM SAUDE INOVA SIMPLES I.S. - ME · CNPJ 63.108.735/0001-53</span>
        </div>
        <p className="footer-made-with">Feito com <FiHeart aria-label="cuidado" /> para quem aprende medicina.</p>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
