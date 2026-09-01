import { FiBookOpen, FiShield } from 'react-icons/fi';
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
  ACADEMIC_INSTITUTIONS,
}) => {
  const reversedInstitutions = [...ACADEMIC_INSTITUTIONS].reverse();

  return (
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

      {/* BLOCO 6: REDE ACADÊMICA */}
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
          <span className="academic-signal academic-signal-one" />
          <span className="academic-signal academic-signal-two" />

          <div className="academic-marquee-row">
            <div className="academic-marquee-track">
              {[...ACADEMIC_INSTITUTIONS, ...ACADEMIC_INSTITUTIONS].map((institution, index) => (
                <AcademicInstitutionCard institution={institution} key={`forward-${institution.acronym}-${index}`} />
              ))}
            </div>
          </div>

          <div className="academic-marquee-row is-reverse">
            <div className="academic-marquee-track">
              {[...reversedInstitutions, ...reversedInstitutions].map((institution, index) => (
                <AcademicInstitutionCard institution={institution} key={`reverse-${institution.acronym}-${index}`} />
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
};

export default HomeCommunitySections;
