"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FiSend } from "react-icons/fi";
import api from "@/lib/api";

const initialForm = { name: "", email: "", subject: "", message: "" };

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/contact", form);
      toast.success("Message sent! We'll get back to you soon.");
      setForm(initialForm);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send message. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="form-control">
          <span className="label-text mb-1 text-sm font-medium">Your Name</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="input input-bordered w-full"
            required
          />
        </label>
        <label className="form-control">
          <span className="label-text mb-1 text-sm font-medium">Email Address</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="input input-bordered w-full"
            required
          />
        </label>
      </div>

      <label className="form-control">
        <span className="label-text mb-1 text-sm font-medium">Subject</span>
        <input
          type="text"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="How can we help?"
          className="input input-bordered w-full"
          required
        />
      </label>

      <label className="form-control">
        <span className="label-text mb-1 text-sm font-medium">Message</span>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us more..."
          className="textarea textarea-bordered h-32 w-full"
          required
        />
      </label>

      <button type="submit" className="btn btn-primary mt-2 gap-2" disabled={isSubmitting}>
        {isSubmitting ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          <FiSend size={16} />
        )}
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}