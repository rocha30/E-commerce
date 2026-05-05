import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/CustomerCare.css";

const PAGE_CONTENT = {
  contact: {
    title: "Contact Us",
    subtitle: "We are available to support your purchase and after-sales needs.",
    blocks: [
      { label: "Email", value: "support@exquisittime.com" },
      { label: "Phone", value: "+1 (555) 901-2244" },
      { label: "Working Hours", value: "Monday to Friday, 9:00 AM - 6:00 PM" },
    ],
  },
  shipping: {
    title: "Shipping Info",
    subtitle: "Secure and tracked delivery for every order.",
    blocks: [
      { label: "Standard Shipping", value: "3-5 business days" },
      { label: "Express Shipping", value: "1-2 business days" },
      { label: "Coverage", value: "Domestic and selected international destinations" },
    ],
  },
  returns: {
    title: "Returns",
    subtitle: "Simple return process if your order is not what you expected.",
    blocks: [
      { label: "Return Window", value: "Up to 30 calendar days after delivery" },
      { label: "Condition", value: "Original packaging and no visible wear" },
      { label: "Refund", value: "Processed within 5-10 business days after inspection" },
    ],
  },
  warranty: {
    title: "Warranty",
    subtitle: "Coverage designed to protect your investment in fine timepieces.",
    blocks: [
      { label: "Coverage Time", value: "24 months from purchase date" },
      { label: "Includes", value: "Manufacturing defects and movement issues" },
      { label: "Excludes", value: "Damage from misuse, impacts, or unauthorized repairs" },
    ],
  },
  "size-guide": {
    title: "Size Guide",
    subtitle: "Find the ideal fit for your wrist before placing an order.",
    blocks: [
      { label: "Recommended Fit", value: "Add 1-1.5 cm over wrist circumference" },
      { label: "Bracelet Adjustment", value: "Free adjustment with first purchase" },
      { label: "Support", value: "Contact us for model-by-model guidance" },
    ],
  },
};

export default function CustomerCarePage({ pageKey }) {
  const content = PAGE_CONTENT[pageKey] || PAGE_CONTENT.contact;

  return (
    <>
      <Navbar />
      <main className="care-container">
        <section className="care-hero">
          <h1>{content.title}</h1>
          <p>{content.subtitle}</p>
        </section>

        <section className="care-grid">
          {content.blocks.map((item) => (
            <article className="care-card" key={item.label}>
              <h3>{item.label}</h3>
              <p>{item.value}</p>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
