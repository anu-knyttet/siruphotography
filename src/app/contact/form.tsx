"use client";

import { useState, useRef, ChangeEvent } from "react";
import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";
import Button from "@/components/button";
import Input from "@/components/input";
import Textarea from "@/components/textarea";
import ReCAPTCHA from "react-google-recaptcha";

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function InputField({ label, name, value, onChange, type = "text" }: InputFieldProps) {
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

interface TextareaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}

function TextareaField({ label, name, value, onChange, rows }: TextareaFieldProps) {
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

interface InfoBlockProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

function InfoBlock({ icon: Icon, label, value }: InfoBlockProps) {
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

export default function ContactForm() {
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
                <p className="text-muted-foreground text-lg">Your message has been sent. I&apos;ll be in touch soon.</p>
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
  );
}
