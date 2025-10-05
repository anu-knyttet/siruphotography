"use client";

import { useState } from "react";
import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Integrate with email API or backend here
    setSubmitted(true);
  }

  return (
    <main className="bg-background min-h-screen text-foreground">
      {/* Hero Section */}
      <section className="relative px-6 py-8 overflow-hidden text-center">
        <div className="absolute inset-0 bg-secondary/30" />
        <div className="z-10 relative mx-auto max-w-4xl">
          <p className="mb-6 font-medium text-primary text-sm uppercase tracking-[0.15em]">Contact</p>
          <h1 className="mb-8 font-serif font-light text-primary text-4xl md:text-6xl text-balance leading-tight">
            Get In Touch
          </h1>
          <div className="bg-primary mx-auto mb-8 w-24 h-px" />
          <p className="mx-auto max-w-2xl text-muted-foreground text-lg leading-relaxed">
            Have a question, want to book a session, or just want to say hello? Fill out the form below and I’ll get
            back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info + Form Split */}
      <section className="px-6 py-20">
        <div className="bg-secondary/30 shadow-lg mx-auto p-0 rounded-lg max-w-3xl overflow-hidden">
          <div className="flex md:flex-row flex-col">
            {/* Left: Office Info */}
            <div className="flex flex-col flex-1 justify-center gap-8 bg-background p-8 border-primary/10 md:border-r border-b md:border-b-0">
              <div>
                <h2 className="mb-2 font-serif text-primary text-2xl">Office</h2>
                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPinIcon className="mt-1 w-5 h-5 text-primary" />
                  <span>Nagdhunga-8, Pokhara 33700</span>
                </div>
              </div>
              <div>
                <h2 className="mb-2 font-serif text-primary text-2xl">Call for Booking</h2>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <PhoneIcon className="w-5 h-5 text-primary" />
                  <span>9856023289 / 9849904917</span>
                </div>
              </div>
              <div>
                <h2 className="mb-2 font-serif text-primary text-2xl">Email</h2>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MailIcon className="w-5 h-5 text-primary" />
                  <span>info@sirubhurtel.com, srijanabhurtel@gmail.com</span>
                </div>
              </div>
            </div>
            {/* Right: Contact Form */}
            <div className="flex-1 p-8">
              {submitted ? (
                <div className="py-16 text-center">
                  <h2 className="mb-4 font-serif text-primary text-3xl">Thank you!</h2>
                  <p className="text-muted-foreground text-lg">Your message has been sent. I’ll be in touch soon.</p>
                  <button
                    className="hover:bg-primary/10 mt-6 px-4 py-2 border border-primary w-max text-primary active:scale-95 transition duration-200"
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="space-y-8" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="name" className="block mb-2 font-medium text-primary">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      className="bg-background px-4 py-3 border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary w-full text-foreground"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 font-medium text-primary">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="bg-background px-4 py-3 border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary w-full text-foreground"
                      placeholder="you@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block mb-2 font-medium text-primary">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={form.message}
                      onChange={handleChange}
                      className="bg-background px-4 py-3 border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary w-full text-foreground"
                      placeholder="How can I help you?"
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="hover:bg-primary/10 px-4 py-2 border border-primary w-max text-primary active:scale-95 transition duration-200"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
