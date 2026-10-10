import Link from "next/link";
import {
  ArrowRight,
  Check,
  ImageIcon,
  MessageSquareText,
  Sparkles,
  WandSparkles
} from "lucide-react";
import { MarketingShell } from "@/client/components/marketing-shell";

const features = [
  { icon: MessageSquareText, title: "AI Chat", text: "Smart conversations for ideas, research and creation.", href: "/chat" },
  { icon: ImageIcon, title: "AI Image", text: "Turn prompts into stunning visuals in seconds.", href: "/image" },
  { icon: WandSparkles, title: "AI Content", text: "Create captions, scripts and marketing copy.", href: "/content" }
];

const plans = [
  { name: "Free", price: "₹0", detail: "100 credits / month", features: ["AI Chat", "AI Content", "Limited image generation"], cta: "Start Free" },
  { name: "Creator", price: "₹499", detail: "1,000 credits / month", features: ["AI Chat, Image & Content", "More generations", "Priority processing"], cta: "Start Creating", featured: true },
  { name: "Pro", price: "₹999", detail: "3,500 credits / month", features: ["Advanced generation", "Priority processing", "Future advanced features"], cta: "Go Pro" }
];

export default function Home() {
  return (
    <MarketingShell>
      <main className="mediazy-page">
        <section className="mediazy-hero">
          <div className="mediazy-orb mediazy-orb-one" />
          <div className="mediazy-orb mediazy-orb-two" />
          <div className="mediazy-wrap mediazy-hero-grid">
            <div className="relative z-10">
              <span className="eyebrow"><Sparkles size={14} /> AI Creative Workspace</span>
              <h1>Create. Imagine.<br /><span>Generate.</span></h1>
              <p className="hero-copy">AI chat, image generation and content creation in one creative workspace.</p>
              <div className="hero-actions">
                <Link href="/signup" className="mz-button">Start Creating <ArrowRight size={17} /></Link>
                <Link href="#tools" className="mz-button mz-button-quiet">Explore Tools</Link>
              </div>
              <div className="creator-proof"><div className="avatars"><i>R</i><i>A</i><i>J</i><i>S</i></div><strong>10K+</strong><span>creators and businesses</span></div>
            </div>
            <div className="hero-visual" aria-label="Mediazy creative preview">
              <div className="visual-top"><span><Sparkles size={14} /> AI Image Studio</span><span className="live-dot">Live</span></div>
              <div className="visual-art"><div className="planet" /><div className="astronaut">✦</div><div className="star star-a" /><div className="star star-b" /></div>
              <div className="visual-tag tag-chat"><MessageSquareText size={14} /> AI Chat</div>
              <div className="visual-tag tag-image"><ImageIcon size={14} /> AI Image</div>
              <div className="visual-tag tag-content"><WandSparkles size={14} /> AI Content</div>
            </div>
          </div>
        </section>

        <section id="tools" className="mediazy-wrap tool-section">
          <div className="section-intro"><span className="eyebrow">ONE WORKSPACE, ENDLESS IDEAS</span><h2>Your creative flow, amplified.</h2><p>Use the right AI tool without breaking your momentum.</p></div>
          <div className="feature-grid">
            {features.map(({ icon: Icon, title, text, href }) => <Link href={href} key={title} className="feature-card"><span className="feature-icon"><Icon size={22} /></span><h3>{title}</h3><p>{text}</p><span className="card-arrow"><ArrowRight size={17} /></span></Link>)}
          </div>
        </section>

        <section className="how-section"><div className="mediazy-wrap"><div className="section-intro center"><span className="eyebrow">SIMPLE BY DESIGN</span><h2>From a thought to a finished idea.</h2></div><div className="steps"><Step number="01" title="Describe" text="Tell Mediazy what you want to make." /><Step number="02" title="Generate" text="Choose a tool and let AI do the heavy lifting." /><Step number="03" title="Create" text="Refine, save and share your best work." /></div></div></section>

        <section className="mediazy-wrap pricing-section" id="pricing"><div className="pricing-heading"><div><span className="eyebrow">SIMPLE PRICING</span><h2>Choose your creative pace.</h2></div><span className="billing-toggle"><b>Monthly</b><em>Yearly · Save 20%</em></span></div><div className="pricing-grid">{plans.map((plan) => <article key={plan.name} className={`plan-card ${plan.featured ? "plan-featured" : ""}`}>{plan.featured && <span className="recommended">Most popular</span>}<h3>{plan.name}</h3><p className="price"><strong>{plan.price}</strong><span>/month</span></p><p className="plan-detail">{plan.detail}</p><ul>{plan.features.map((feature) => <li key={feature}><Check size={15} />{feature}</li>)}</ul><Link href="/signup" className={`mz-button ${plan.featured ? "" : "mz-button-quiet"}`}>{plan.cta}</Link></article>)}</div></section>
      </main>
    </MarketingShell>
  );
}

function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return <article className="step"><span>{number}</span><h3>{title}</h3><p>{text}</p></article>;
}
