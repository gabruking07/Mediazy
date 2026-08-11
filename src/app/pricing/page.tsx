import Link from "next/link";
import { Check } from "lucide-react";
import { MarketingShell } from "@/client/components/marketing-shell";
const plans = [
  { name: "Free", price: "₹0", detail: "100 credits / month", features: ["AI Chat", "AI Content", "Limited image generation"] },
  { name: "Creator", price: "₹499", detail: "1,000 credits / month", features: ["AI Chat", "AI Image", "AI Content", "Priority processing"] },
  { name: "Pro", price: "₹999", detail: "3,500 credits / month", features: ["Advanced generation", "Priority processing", "Future advanced features"] }
];
export default function PricingPage() { return <MarketingShell><main className="pricing-page"><span className="eyebrow">SIMPLE, TRANSPARENT PRICING</span><h1>Make more room for great ideas.</h1><p>Pick a plan that fits your creative rhythm. Upgrade whenever you need.</p><div className="billing-toggle"><b>Monthly</b><em>Yearly · Save 20%</em></div><div className="pricing-grid">{plans.map((plan, i) => <article key={plan.name} className={`plan-card ${i === 1 ? "plan-featured" : ""}`}>{i === 1 && <span className="recommended">Most popular</span>}<h2>{plan.name}</h2><p className="price"><strong>{plan.price}</strong><span>/month</span></p><p className="plan-detail">{plan.detail}</p><ul>{plan.features.map(feature => <li key={feature}><Check size={15} />{feature}</li>)}</ul><Link href="/signup" className={`mz-button ${i === 1 ? "" : "mz-button-quiet"}`}>{i === 0 ? "Start Free" : i === 1 ? "Start Creating" : "Go Pro"}</Link></article>)}</div></main></MarketingShell>; }
