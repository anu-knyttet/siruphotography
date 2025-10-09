"use client";

import { useState, useRef } from "react";
import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";
import Button from "@/components/button";
import Input from "@/components/input";
import Textarea from "@/components/textarea";
import ReCAPTCHA from "react-google-recaptcha";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatusMessage(null);

    // Run reCAPTCHA
    const token = await recaptchaRef.current?.executeAsync();
    console.log("Received token:", token);
    recaptchaRef.current?.reset();
    if (!token) {
      setStatusMessage("Captcha verification failed.");
      return;
    }

    // Call serverless API
    const res = await fetch("/api/resendEmailer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, token }),
    });

    if (res.ok) {
      setSubmitted(true);
      setStatusMessage(null);
    } else {
      const data = await res.json();
      setStatusMessage(data.error || "Something went wrong. Please try again.");
    }
  }

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
      <section className="px-6 py-20">
        <div className="bg-secondary/30 shadow-lg mx-auto p-0 border border-primary/10 rounded-lg max-w-4xl overflow-hidden">
          <div className="flex md:flex-row flex-col">
            {/* Left */}
            <div className="flex flex-col flex-1 justify-center gap-8 bg-background p-8 border-primary/10 md:border-r border-b md:border-b-0">
              <InfoBlock icon={MapPinIcon} label="Office" value="Nagdhunga-8, Pokhara 33700" />
              <InfoBlock icon={PhoneIcon} label="Call for Booking" value="9856023289 / 9849904917" />
              <InfoBlock icon={MailIcon} label="Email" value="info@sirubhurtel.com, srijanabhurtel@gmail.com" />
            </div>

            {/* Right */}
            <div className="flex-1 p-8">
              {submitted ? (
                <div className="py-16 text-center">
                  <h2 className="mb-4 font-GFS-didot text-primary text-3xl">Thank you!</h2>
                  <p className="text-muted-foreground text-lg">
                    Your message has been sent. I&apos;ll be in touch soon.
                  </p>
                  <Button onClick={() => setSubmitted(false)}>Send Another Message</Button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <InputField label="Name" name="name" value={form.name} onChange={handleChange} />
                  <InputField label="Email" name="email" value={form.email} onChange={handleChange} type="email" />
                  <TextareaField label="Message" name="message" value={form.message} onChange={handleChange} rows={6} />

                  {/* reCAPTCHA */}
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY!}
                    size="invisible"
                    badge="bottomleft"
                  />

                  {/* Status message */}
                  {statusMessage && <p className="font-medium text-red-600 text-center">{statusMessage}</p>}

                  <div className="flex justify-center">
                    <Button type="submit">Send Message</Button>
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

// --- Helpers ---
function InputField({ label, name, value, onChange, type = "text" }: any) {
  return (
    <div>
      <label htmlFor={name} className="block mb-2 font-medium text-primary">
        {label}
      </label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="bg-background px-4 py-3 border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary w-full text-foreground"
        placeholder={label}
      />
    </div>
  );
}

function TextareaField({ label, name, value, onChange, rows }: any) {
  return (
    <div>
      <label htmlFor={name} className="block mb-2 font-medium text-primary">
        {label}
      </label>
      <Textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className="bg-background px-4 py-3 border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary w-full text-foreground"
        placeholder={label}
      />
    </div>
  );
}

function InfoBlock({ icon: Icon, label, value }: any) {
  return (
    <div>
      <h2 className="mb-2 font-GFS-didot text-primary text-2xl">{label}</h2>
      <div className="flex items-center gap-3 text-muted-foreground">
        <Icon className="w-5 h-5 text-primary" />
        <span>{value}</span>
      </div>
    </div>
  );
}
