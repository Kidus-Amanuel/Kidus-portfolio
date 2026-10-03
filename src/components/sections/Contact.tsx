"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export function Contact() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    const { submitContact } = await import("@/app/actions");
    const result = await submitContact(formState);
    if (result.success) {
      setStatus("success");
    } else {
      setStatus("idle");
      alert("Something went wrong connecting to the database.");
    }
  };

  return (
    <section id="contact" className="py-32 px-6 md:px-12 lg:px-24 bg-black border-t border-white/10 relative z-10">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Let's build something.</h2>
          <p className="text-mutedForeground mb-12 max-w-xl text-lg">
            Currently open for remote roles, freelance projects, and talking about AI. Drop your details and I'll get back to you within 24 hours.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {status === "success" ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center p-8 border border-white/20 rounded-3xl bg-white/5 text-center h-full min-h-[300px]">
                <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center mb-6">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-2xl font-display font-bold mb-2">Message Sent!</h3>
                <p className="text-mutedForeground">Thanks for reaching out, {formState.name}. I'll be in touch shortly.</p>
              </motion.div>
            ) : (
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">Name</label>
                  <input type="text" required value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} className="w-full bg-transparent border-b border-white/30 py-2 focus:outline-none focus:border-white transition-colors" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">Email</label>
                  <input type="email" required value={formState.email} onChange={e => setFormState({...formState, email: e.target.value})} className="w-full bg-transparent border-b border-white/30 py-2 focus:outline-none focus:border-white transition-colors" placeholder="jane@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">Message</label>
                  <textarea required value={formState.message} onChange={e => setFormState({...formState, message: e.target.value})} className="w-full bg-transparent border-b border-white/30 py-2 focus:outline-none focus:border-white transition-colors resize-none h-24" placeholder="How can I help you?"></textarea>
                </div>
                <button disabled={status === "submitting"} className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full p-[1px] font-medium focus:outline-none w-full sm:w-auto disabled:opacity-70">
                  <span className="absolute inset-[-1000%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#e5e7eb_50%,#000000_100%)]" />
                  <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-white backdrop-blur-3xl transition-colors hover:bg-white/10">
                    {status === "submitting" ? "Sending..." : "Send Message"}
                  </span>
                </button>
              </form>
            )}
            
            <div className="space-y-10 md:pl-12">
              <div>
                <h3 className="text-xs font-medium opacity-50 uppercase tracking-widest mb-4">Connect</h3>
                <ul className="space-y-4">
                  <li><a href="mailto:kidus@example.com" className="text-lg hover:opacity-70 transition-opacity">Email me directly</a></li>
                  <li><a href="https://linkedin.com/in/kidus" target="_blank" rel="noreferrer" className="text-lg hover:opacity-70 transition-opacity">LinkedIn</a></li>
                  <li><a href="#" className="text-lg hover:opacity-70 transition-opacity">Upwork</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-medium opacity-50 uppercase tracking-widest mb-4">Resume</h3>
                <a href="/KIDUS%20AMANUEL%20CVs.pdf" target="_blank" rel="noopener noreferrer" className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full p-[1px] font-medium focus:outline-none">
                  <span className="absolute inset-[-1000%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#e5e7eb_50%,#000000_100%)]" />
                  <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-white backdrop-blur-3xl transition-colors hover:bg-white/10 text-sm">
                    Download CV (.pdf)
                  </span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
