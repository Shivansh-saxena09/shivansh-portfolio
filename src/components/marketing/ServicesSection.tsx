import { getServices } from "@/lib/data/services";
import { SplitText } from "@/components/motion/SplitText";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ServicePictogram } from "@/components/marketing/ServicePictogram";

export async function ServicesSection() {
  const services = await getServices();

  return (
    <section className="border-t border-beige-border/70 bg-ivory py-20">
      <Container>
        <h2 className="mo-split font-heading text-3xl text-charcoal sm:text-4xl"><SplitText text={"Services"} /></h2>

        {/* Mobile: same swipeable card pattern as the case-study grid
            above — four similar cards read better as a one-at-a-time
            carousel than a tall stack. Desktop: unchanged grid. */}
        <Reveal className="relative mt-10 sm:mt-0">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-ivory to-transparent sm:hidden"
          />
          <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:mt-10 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
            {services.map((service, i) => (
              <div
                key={service.id}
                className="w-[72vw] shrink-0 snap-start rounded-2xl border border-beige-border bg-cream px-6 py-7 shadow-[0_1px_3px_rgba(43,38,34,0.05)] transition-shadow duration-300 hover:shadow-[0_16px_32px_-16px_rgba(43,38,34,0.18)] sm:w-auto sm:shrink"
              >
                <ServicePictogram title={service.title} index={i} />
                <h3 className="mt-5 font-heading text-xl text-charcoal">{service.title}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-warm-grey">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
