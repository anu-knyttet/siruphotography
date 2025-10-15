import ContactForm from "./form";

export const metadata = {
  title: "Contact - Siru Photography",
  description: "Get in touch with Siru Bhurtel for photography sessions, inquiries, or collaborations.",
};

export default function ContactPage() {
  return (
    <main className="bg-background min-h-screen text-foreground">
      {/* Hero Section */}
      <section className="relative px-6 py-8 overflow-hidden text-center">
        <div className="absolute inset-0 bg-secondary/30" />
        <div className="z-10 relative mx-auto max-w-4xl">
          <p className="mb-6 font-medium text-primary text-sm uppercase tracking-[0.15em]">Contact</p>
          <h1 className="mb-8 font-GFS-didot font-light text-primary text-4xl md:text-6xl text-balance leading-tight">
            Get In Touch
          </h1>
          <div className="bg-primary mx-auto mb-8 w-24 h-px" />
          <p className="mx-auto max-w-2xl text-muted-foreground text-lg leading-relaxed">
            Have a question, want to book a session, or just want to say hello? Fill out the form below and I’ll get
            back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <ContactForm />
    </main>
  );
}
