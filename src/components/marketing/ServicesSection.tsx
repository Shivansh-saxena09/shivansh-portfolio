import { services } from "@/content/services";

export function ServicesSection() {
  return (
    <section className="border-t border-beige-border/70 bg-ivory px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-heading text-3xl text-charcoal sm:text-4xl">Services</h2>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {services.map((service) => (
            <div key={service.title} className="border-l-2 border-terracotta pl-6">
              <h3 className="font-heading text-xl text-charcoal">{service.title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-warm-grey">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
