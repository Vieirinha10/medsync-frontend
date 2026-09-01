import HomeCommunitySections from './HomeCommunitySections';
import HomeEcosystemSections from './HomeEcosystemSections';
import HomeFeedbackSection from './HomeFeedbackSection';
import HomePricingSections from './HomePricingSections';

const HomeLowerSections = ({
  formattedStudentCount,
  activeFeedbackStep,
  setActiveFeedbackStep,
  activeFeedback,
  FEEDBACK_STEPS,
  REAL_TESTIMONIALS,
  ACADEMIC_INSTITUTIONS,
  TRUST_PILLARS,
}) => (
  <>
    <HomeFeedbackSection
      activeFeedbackStep={activeFeedbackStep}
      setActiveFeedbackStep={setActiveFeedbackStep}
      activeFeedback={activeFeedback}
      FEEDBACK_STEPS={FEEDBACK_STEPS}
    />
    <HomeCommunitySections
      formattedStudentCount={formattedStudentCount}
      REAL_TESTIMONIALS={REAL_TESTIMONIALS}
      ACADEMIC_INSTITUTIONS={ACADEMIC_INSTITUTIONS}
    />
    <HomeEcosystemSections TRUST_PILLARS={TRUST_PILLARS} />
    <HomePricingSections />
  </>
);

export default HomeLowerSections;
