import { FiBookOpen, FiCheck, FiShield, FiUsers } from 'react-icons/fi';
import StatMorph from '../StatMorph';

const AcademicInstitutionCard = ({ institution }) => (
  <article className="academic-institution-card">
    <span className={`academic-institution-logo${institution.logo ? '' : ' is-wordmark'}`}>
      {institution.logo ? (
        <img src={institution.logo} alt="" loading="lazy" decoding="async" />
      ) : (
        institution.acronym
      )}
    </span>
    <span className="academic-institution-copy">
      <strong>{institution.acronym}</strong>
      <small>{institution.name}</small>
    </span>
    <span className="academic-institution-meta">{institution.state}</span>
  </article>
);

const HomeCommunitySections = ({
  formattedStudentCount,
  REAL_TESTIMONIALS,
  ACADEMIC_INSTITUTIONS,
}) => (
  <>
      {/* BLOCO 5: PROVA OBJETIVA & COMUNIDADE ACADÊMICA */}
      <section className="solid-proof-morph" aria-label="Números do MedSync">
        <StatMorph
          items={[
            { value: '80', label: 'casos clínicos' },
            { value: '150', label: 'desafios visuais' },
            { value: formattedStudentCount, label: 'estudantes MedSync' },
            { value: '19', label: 'áreas médicas contempladas' },
          ]}
        />
      </section>

      {/* BLOCO 6: DEPOIMENTOS REAIS DE ESTUDANTES */}
      <section className="home-testimonials-section home-reveal" data-home-reveal aria-labelledby="testimonials-title">
        <header className="solid-section-heading">
          <span className="section-eyebrow-tag">
            <FiUsers aria-hidden="true" />
            EXPERIÊNCIA REAL DE ESTUDANTES
          </span>
          <h2 id="testimonials-title">Quem pratica no MedSync sente a diferença no plantão.</h2>
          <p>Relatos de estudantes e internos que utilizam a plataforma como laboratório de decisão médica.</p>
        </header>

        <div className="testimonials-grid">
          {REAL_TESTIMONIALS.map((testimonial) => (
            <article className="testimonial-card" key={testimonial.name}>
              <div className="testimonial-header">
                <span className="testimonial-avatar">{testimonial.initials}</span>
                <div>
                  <strong>{testimonial.name}</strong>
                  <small>{testimonial.role} · {testimonial.institution}</small>
                </div>
              </div>
              <p className="testimonial-quote">“{testimonial.quote}”</p>
              <div className="testimonial-footer">
                <span className="testimonial-tag">{testimonial.tag}</span>
                <span className="testimonial-verified"><FiCheck /> Aluno verificado</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* BLOCO 7: REDE ACADÊMICA */}
      <section className="home-academic-network home-reveal" data-home-reveal aria-labelledby="academic-network-title">
        <div className="academic-network-heading">
          <span className="section-eyebrow-tag">
            <FiBookOpen aria-hidden="true" />
            ORIGEM DOS ESTUDANTES
          </span>
          <h2 id="academic-network-title">Uma comunidade médica em formação.</h2>
          <p>
            Estudantes de diversas instituições encontram no MedSync um espaço comum para
            praticar raciocínio clínico e transformar estudo em decisão.
          </p>
        </div>

        <p className="academic-network-accessible-list">
          Instituições representadas: {ACADEMIC_INSTITUTIONS.map(({ acronym }) => acronym).join(', ')}.
        </p>

        <div className="academic-network-stage" aria-hidden="true">
          <div className="academic-marquee-row">
            <div className="academic-marquee-track">
              {[...ACADEMIC_INSTITUTIONS, ...ACADEMIC_INSTITUTIONS].map((institution, index) => (
                <AcademicInstitutionCard institution={institution} key={`forward-${institution.acronym}-${index}`} />
              ))}
            </div>
          </div>
        </div>

        <p className="academic-network-disclaimer">
          <FiShield aria-hidden="true" />
          <span>A exibição indica a origem acadêmica de usuários cadastrados e não representa vínculo ou parceria institucional.</span>
        </p>
      </section>
  </>
);

export default HomeCommunitySections;
