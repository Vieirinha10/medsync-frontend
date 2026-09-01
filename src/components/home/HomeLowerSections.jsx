import HomeCommunitySections from './HomeCommunitySections';
import HomeEcosystemSections from './HomeEcosystemSections';
import HomePricingSections from './HomePricingSections';

const HomeLowerSections = ({
  formattedStudentCount,
  medicalSpecialtyCount,
  ACADEMIC_INSTITUTIONS,
  TRUST_PILLARS,
}) => (
  <>
    <HomeCommunitySections
      formattedStudentCount={formattedStudentCount}
      medicalSpecialtyCount={medicalSpecialtyCount}
      ACADEMIC_INSTITUTIONS={ACADEMIC_INSTITUTIONS}
    />
    <HomeEcosystemSections TRUST_PILLARS={TRUST_PILLARS} />
    <HomePricingSections />
  </>
);

export default HomeLowerSections;
