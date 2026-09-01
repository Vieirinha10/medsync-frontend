const HomeSpecialtiesMarquee = ({ specialties }) => (
  <section className="specialty-marquee-section" aria-label="Especialidades médicas disponíveis">
    <p className="specialty-marquee-accessible">
      Especialidades disponíveis: {specialties.join(', ')}.
    </p>
    <div className="specialty-marquee-track" aria-hidden="true">
      {[...specialties, ...specialties].map((specialty, index) => (
        <span className="specialty-marquee-item" key={`spec-${specialty}-${index}`}>
          <strong>{specialty}</strong>
          <span className="specialty-divider">/</span>
        </span>
      ))}
    </div>
  </section>
);

export default HomeSpecialtiesMarquee;
