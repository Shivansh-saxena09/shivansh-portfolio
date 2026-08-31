import { services } from "@/content/services";
import { Container } from "@/components/ui/Container";

export function ServicesSection() {
  return (
    <section className="border-t border-beige-border/70 bg-ivory py-20">
      <Container>
        <h2 className="font-heading text-3xl text-charcoal sm:text-4xl">Services</h2>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl border border-beige-border bg-cream px-6 py-7 shadow-[0_1px_3px_rgba(43,38,34,0.05)] transition-shadow duration-300 hover:shadow-[0_16px_32px_-16px_rgba(43,38,34,0.18)]"
            >
              <div className="h-1 w-10 rounded-full bg-terracotta" />
              <h3 className="mt-5 font-heading text-xl text-charcoal">{service.title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-warm-grey">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
