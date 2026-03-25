import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import {
  CheckCircle,
  Loader2,
  MapPin,
  Menu,
  Phone,
  Shield,
  Star,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "./hooks/useActor";

// ── Scroll-reveal hook ────────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        }
      },
      { threshold: 0.12 },
    );
    const els = document.querySelectorAll(".animate-fade-up, .animate-fade-in");
    for (const el of els) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);
}

// ── Pill CTA button ───────────────────────────────────────────────────────────
function PillButton({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
  "data-ocid": dataOcid,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "white" | "outline";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  "data-ocid"?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold px-7 py-3 text-base transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 disabled:pointer-events-none";
  const variants = {
    primary: "text-white hover:opacity-90",
    white: "bg-white hover:bg-brand-mint-lighter",
    outline: "border-2 bg-transparent hover:bg-brand-mint-lighter",
  };

  const inlineStyles: React.CSSProperties =
    variant === "primary"
      ? { backgroundColor: "#03A9F4" }
      : variant === "white"
        ? { color: "#03A9F4" }
        : { borderColor: "#03A9F4", color: "#03A9F4" };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-ocid={dataOcid}
      style={inlineStyles}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

// ── Scroll to quote helper ────────────────────────────────────────────────────
function scrollToQuote() {
  document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  useScrollReveal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [heroSubmitted, setHeroSubmitted] = useState(false);
  const { actor } = useActor();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    serviceType: "",
    message: "",
  });

  const [heroForm, setHeroForm] = useState({
    name: "",
    phone: "",
    email: "",
    serviceType: "",
    message: "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const id = crypto.randomUUID();
      await actor.submitQuoteRequest(
        id,
        form.name,
        form.email,
        form.phone,
        form.serviceType,
        form.message,
      );
    },
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Quote request sent! We'll be in touch within the hour.");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const heroMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const id = crypto.randomUUID();
      await actor.submitQuoteRequest(
        id,
        heroForm.name,
        heroForm.email,
        heroForm.phone,
        heroForm.serviceType,
        heroForm.message,
      );
    },
    onSuccess: () => {
      setHeroSubmitted(true);
      toast.success("Quote request sent! We'll be in touch within the hour.");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.serviceType) {
      toast.error("Please fill in all required fields.");
      return;
    }
    mutation.mutate();
  }

  function handleHeroSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !heroForm.name ||
      !heroForm.phone ||
      !heroForm.email ||
      !heroForm.serviceType
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    heroMutation.mutate();
  }

  const navLinks = [
    { label: "Services", href: "#services" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Offer", href: "#offer" },
    { label: "Contact", href: "#quote" },
  ];

  return (
    <div className="min-h-screen font-montserrat overflow-x-hidden">
      <Toaster position="top-center" />

      {/* ── Utility Bar ── */}
      <div className="bg-brand-mint-light py-1.5 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-xs text-muted-foreground">
          <span className="hidden sm:block" />
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3" />
              <a
                href="tel:1300123456"
                className="hover:text-brand-teal font-medium transition-colors"
              >
                Call 1300 123 456
              </a>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              Serving Sydney, Melbourne, Brisbane &amp; more
            </span>
          </div>
        </div>
      </div>

      {/* ── Sticky Header ── */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-white border-b border-border shadow-sm">
        {/* ── Top Info Bar ── */}
        <div className="w-full bg-[#E1F5FE] border-b border-[#B3E5FC]">
          <div className="max-w-6xl mx-auto px-4 py-1.5 flex items-center justify-between gap-4">
            <a
              href="tel:0483948750"
              className="flex items-center gap-1.5 text-xs text-gray-700 hover:text-[#03A9F4] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#03A9F4] shrink-0" />
              <span>Call 0483 948 750</span>
            </a>
            <span className="text-xs text-gray-600 text-right">
              <span className="hidden sm:inline">
                Serving Brisbane, Perth, Melbourne, Sydney, Adelaide, Canberra,
                Gold Coast and Sunshine Coast
              </span>
              <span className="sm:hidden">Serving major Australian cities</span>
            </span>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <img
              src="https://res.cloudinary.com/dxqa2ywnx/image/upload/v1774399266/logo_02a8f4_1_igbxuh.svg"
              alt="Optima Cleaners"
              className="h-10 w-auto object-contain"
              style={{ maxWidth: 180 }}
            />
          </div>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                data-ocid={`nav.${link.label.toLowerCase().replace(/ /g, "-")}.link`}
                className="text-sm font-medium text-muted-foreground hover:text-brand-teal transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right CTA */}
          <div className="flex items-center gap-2">
            <PillButton
              onClick={scrollToQuote}
              className="hidden sm:inline-flex text-sm px-5 py-2"
              data-ocid="header.book_now.primary_button"
            >
              Book Now
            </PillButton>
            <button
              type="button"
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              data-ocid="header.menu.toggle"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden border-t border-border bg-white px-4 py-4 flex flex-col gap-3"
            data-ocid="header.mobile_menu.panel"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                data-ocid={`nav.mobile.${link.label.toLowerCase().replace(/ /g, "-")}.link`}
                className="text-sm font-semibold text-foreground py-2 border-b border-border last:border-0"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <PillButton
              onClick={() => {
                scrollToQuote();
                setMenuOpen(false);
              }}
              className="w-full mt-2"
            >
              Book Your Easter Clean
            </PillButton>
          </div>
        )}
      </header>

      <main className="pt-[104px]">
        {/* ── Hero Section ── */}
        <section
          className="relative min-h-[88vh] flex flex-col overflow-hidden"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dxqa2ywnx/image/upload/v1774400450/Spring_Cleaning_Regular_Cleaning_rx6omm.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Subtle left-side gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(0,60,100,0.13) 0%, rgba(0,60,100,0.07) 40%, transparent 65%)",
            }}
          />

          {/* Easter egg decorations */}
          <div className="absolute top-8 right-8 opacity-30 pointer-events-none select-none hidden lg:block">
            <svg
              width="220"
              height="220"
              viewBox="0 0 220 220"
              fill="none"
              role="presentation"
              aria-hidden="true"
            >
              <ellipse
                cx="60"
                cy="80"
                rx="38"
                ry="52"
                fill="#F3E2A6"
                opacity="0.8"
                transform="rotate(-15 60 80)"
              />
              <ellipse
                cx="60"
                cy="80"
                rx="38"
                ry="14"
                fill="#F1C6AA"
                opacity="0.6"
                transform="rotate(-15 60 80)"
              />
              <ellipse
                cx="150"
                cy="140"
                rx="28"
                ry="38"
                fill="#CFE7D6"
                opacity="0.8"
                transform="rotate(10 150 140)"
              />
              <ellipse
                cx="150"
                cy="140"
                rx="28"
                ry="10"
                fill="#DDEFEA"
                opacity="0.7"
                transform="rotate(10 150 140)"
              />
              <ellipse
                cx="170"
                cy="60"
                rx="20"
                ry="28"
                fill="#F1C6AA"
                opacity="0.7"
                transform="rotate(20 170 60)"
              />
              <circle cx="95" cy="170" r="8" fill="#F3E2A6" opacity="0.9" />
              <circle cx="115" cy="185" r="5" fill="#CFE7D6" opacity="0.9" />
              <circle cx="80" cy="190" r="6" fill="#F1C6AA" opacity="0.9" />
            </svg>
          </div>
          <div className="absolute bottom-20 left-4 opacity-20 pointer-events-none select-none hidden md:block">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              role="presentation"
              aria-hidden="true"
            >
              <ellipse
                cx="40"
                cy="60"
                rx="28"
                ry="40"
                fill="#F3E2A6"
                opacity="0.9"
                transform="rotate(-10 40 60)"
              />
              <ellipse
                cx="85"
                cy="45"
                rx="20"
                ry="30"
                fill="#CFE7D6"
                opacity="0.9"
                transform="rotate(15 85 45)"
              />
            </svg>
          </div>

          {/* Hero content — 2-column grid */}
          <div className="relative z-10 flex-1 flex items-center">
            <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                {/* LEFT: existing content + trust points */}
                <div>
                  <div className="animate-fade-up inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
                    🐣 Limited-Time Easter Offer – Ends Soon
                  </div>

                  <h1
                    className="animate-fade-up text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4"
                    style={{
                      transitionDelay: "0.1s",
                      textShadow:
                        "0 2px 16px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.4)",
                    }}
                  >
                    Easter Cleaning Sale –{" "}
                    <span className="text-yellow-200">Get Your Home Ready</span>{" "}
                    Before Guests Arrive
                  </h1>

                  <p
                    className="animate-fade-up text-lg sm:text-xl text-white/90 mb-8 leading-relaxed"
                    style={{
                      transitionDelay: "0.2s",
                      textShadow:
                        "0 1px 10px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.3)",
                    }}
                  >
                    Save up to <strong className="text-white">$150</strong> on
                    Easter cleaning bundles. Oven, BBQ, carpet and deep cleaning
                    for busy homes.
                  </p>

                  <div
                    className="animate-fade-up"
                    style={{ transitionDelay: "0.3s" }}
                  >
                    <PillButton
                      onClick={scrollToQuote}
                      variant="white"
                      className="text-base px-8 py-4 shadow-xl animate-pulse-soft"
                      data-ocid="hero.book_easter_clean.primary_button"
                    >
                      🐰 Book Your Easter Clean
                    </PillButton>
                  </div>

                  {/* Trust points */}
                  <div className="flex flex-col gap-2 mt-6">
                    {[
                      {
                        icon: <Star className="w-4 h-4" />,
                        text: "5-star rated service",
                      },
                      {
                        icon: <Shield className="w-4 h-4" />,
                        text: "Fully insured",
                      },
                      {
                        icon: <Users className="w-4 h-4" />,
                        text: "Trusted by Australian households",
                      },
                    ].map((tp) => (
                      <div
                        key={tp.text}
                        className="flex items-center gap-2 text-white text-sm font-medium drop-shadow"
                      >
                        <span
                          className="bg-white rounded-full p-0.5"
                          style={{ color: "#03A9F4" }}
                        >
                          {tp.icon}
                        </span>
                        {tp.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT: quote form card */}
                <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-7 flex flex-col gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Get Your Free Quote
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      We respond within the hour. No obligation.
                    </p>
                  </div>

                  {heroSubmitted ? (
                    <div
                      className="text-center py-6"
                      data-ocid="hero.quote.success_state"
                    >
                      <div className="text-4xl mb-3">🎉</div>
                      <p className="font-bold text-gray-900">
                        Quote Request Sent!
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        We'll be in touch within the hour.
                      </p>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleHeroSubmit}
                      className="flex flex-col gap-3"
                      data-ocid="hero.quote.panel"
                    >
                      <div>
                        <Label
                          htmlFor="hero-name"
                          className="text-xs font-semibold"
                        >
                          Full Name *
                        </Label>
                        <Input
                          id="hero-name"
                          type="text"
                          placeholder="Jane Smith"
                          value={heroForm.name}
                          onChange={(e) =>
                            setHeroForm((p) => ({ ...p, name: e.target.value }))
                          }
                          required
                          className="rounded-xl mt-1"
                          data-ocid="hero.name.input"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="hero-phone"
                          className="text-xs font-semibold"
                        >
                          Phone Number *
                        </Label>
                        <Input
                          id="hero-phone"
                          type="tel"
                          placeholder="0400 000 000"
                          value={heroForm.phone}
                          onChange={(e) =>
                            setHeroForm((p) => ({
                              ...p,
                              phone: e.target.value,
                            }))
                          }
                          required
                          className="rounded-xl mt-1"
                          data-ocid="hero.phone.input"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="hero-email"
                          className="text-xs font-semibold"
                        >
                          Email Address *
                        </Label>
                        <Input
                          id="hero-email"
                          type="email"
                          placeholder="jane@example.com"
                          value={heroForm.email}
                          onChange={(e) =>
                            setHeroForm((p) => ({
                              ...p,
                              email: e.target.value,
                            }))
                          }
                          required
                          className="rounded-xl mt-1"
                          data-ocid="hero.email.input"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="hero-service"
                          className="text-xs font-semibold"
                        >
                          Service *
                        </Label>
                        <Select
                          value={heroForm.serviceType}
                          onValueChange={(v) =>
                            setHeroForm((p) => ({ ...p, serviceType: v }))
                          }
                        >
                          <SelectTrigger
                            id="hero-service"
                            className="rounded-xl mt-1"
                            data-ocid="hero.service.select"
                          >
                            <SelectValue placeholder="Select a service..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="oven-bbq">
                              Oven &amp; BBQ Bundle (from $99)
                            </SelectItem>
                            <SelectItem value="full-home">
                              Full Home Easter Bundle (from $199)
                            </SelectItem>
                            <SelectItem value="complete-spring">
                              Complete Spring Clean (from $349)
                            </SelectItem>
                            <SelectItem value="carpet-steam">
                              Carpet Steam Cleaning
                            </SelectItem>
                            <SelectItem value="couch-upholstery">
                              Couch / Upholstery Cleaning
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label
                          htmlFor="hero-notes"
                          className="text-xs font-semibold"
                        >
                          Notes (optional)
                        </Label>
                        <Textarea
                          id="hero-notes"
                          placeholder="Any useful details..."
                          value={heroForm.message}
                          onChange={(e) =>
                            setHeroForm((p) => ({
                              ...p,
                              message: e.target.value,
                            }))
                          }
                          rows={2}
                          className="rounded-xl mt-1"
                          data-ocid="hero.notes.textarea"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={heroMutation.isPending}
                        style={{ backgroundColor: "#03A9F4" }}
                        className="w-full text-white font-semibold rounded-full py-3 text-sm transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 mt-1 shadow-md"
                        data-ocid="hero.quote.submit_button"
                      >
                        {heroMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send My Quote Request"
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Floating bottom pill */}
          <div className="relative z-10 flex justify-center pb-0">
            <div className="bg-white text-brand-teal font-bold text-sm sm:text-base px-8 py-4 rounded-t-3xl shadow-lg flex items-center gap-3 mx-4">
              <span className="text-xl">🎉</span>
              Save up to $150 this Easter&nbsp;&nbsp;|&nbsp;&nbsp;Flexible
              booking times available
            </div>
          </div>
        </section>

        {/* ── Trust Badges Row ── */}
        <section className="bg-white py-10 border-b border-border">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center animate-fade-up">
              {[
                {
                  icon: <Star className="w-7 h-7 text-brand-teal" />,
                  label: "5-Star Rated Service",
                  sub: "Consistently top-rated by customers",
                },
                {
                  icon: <Shield className="w-7 h-7 text-brand-teal" />,
                  label: "Fully Insured",
                  sub: "Complete peace of mind, always",
                },
                {
                  icon: <Users className="w-7 h-7 text-brand-teal" />,
                  label: "Trusted by 500+ Households",
                  sub: "Across major Australian cities",
                },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex flex-col items-center gap-2 py-4 px-6 rounded-2xl hover:bg-brand-mint-lighter transition-colors"
                >
                  <div className="w-14 h-14 rounded-2xl bg-brand-mint-light flex items-center justify-center">
                    {badge.icon}
                  </div>
                  <div className="font-bold text-foreground text-sm sm:text-base">
                    {badge.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {badge.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Problem Section ── */}
        <section className="bg-brand-mint-lighter py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 animate-fade-up">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                Sound familiar before a big visit?
              </h2>
              <p className="text-muted-foreground text-base max-w-xl mx-auto">
                Easter means guests, big meals, and a busy home. It's easy to
                overlook the build-up — but your guests won't.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-up">
              {[
                {
                  emoji: "🍳",
                  title: "Oven Grease Build-Up",
                  desc: "Baked-on grease that won't budge no matter how long you scrub.",
                },
                {
                  emoji: "🔥",
                  title: "BBQ Residue",
                  desc: "Last summer's grime still sitting there, ready to be noticed.",
                },
                {
                  emoji: "🧹",
                  title: "Dusty, Stained Carpets",
                  desc: "Holding months of dust, pet hair, and hidden stains.",
                },
                {
                  emoji: "🍽️",
                  title: "Kitchen Deep Clean Overdue",
                  desc: "Hidden grime in every corner, behind appliances, under benches.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-white rounded-2xl p-5 flex gap-4 items-start shadow-xs hover:shadow-md transition-shadow border border-border"
                >
                  <span className="text-3xl mt-0.5">{card.emoji}</span>
                  <div>
                    <div className="font-bold text-foreground mb-1">
                      {card.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {card.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8 animate-fade-up">
              <button
                type="button"
                onClick={scrollToQuote}
                data-ocid="problem.get_quote.link"
                className="text-brand-teal font-semibold hover:underline text-sm cursor-pointer"
              >
                We handle all of this →
              </button>
            </div>
          </div>
        </section>

        {/* ── Services / Pricing Section ── */}
        <section id="services" className="bg-brand-cream py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 animate-fade-up">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                What's Included in Our Easter Bundles
              </h2>
              <p className="text-muted-foreground">
                Everything you need to get your home guest-ready
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up">
              {/* Card 1 – Blue */}
              <div
                className="rounded-3xl p-6 flex flex-col gap-4 shadow-xs hover:shadow-md transition-shadow"
                style={{ backgroundColor: "oklch(var(--card-mint))" }}
              >
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-brand-teal mb-2">
                    Bundle 1
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    Oven &amp; BBQ Bundle
                  </h3>
                </div>
                <ul className="flex flex-col gap-2 flex-1">
                  {[
                    "Oven deep clean",
                    "BBQ clean & degrease",
                    "Rangehood clean",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-brand-teal shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-baseline gap-2">
                  <span className="text-muted-foreground line-through text-sm">
                    From $149
                  </span>
                  <span className="text-2xl font-extrabold text-brand-teal">
                    Now from $99
                  </span>
                </div>
                <PillButton
                  onClick={scrollToQuote}
                  variant="outline"
                  className="w-full"
                  data-ocid="services.bundle1.primary_button"
                >
                  Get a Quote
                </PillButton>
              </div>

              {/* Card 2 – Yellow (highlighted) */}
              <div
                className="rounded-3xl p-6 flex flex-col gap-4 shadow-lg ring-2 ring-brand-teal relative"
                style={{ backgroundColor: "oklch(var(--card-yellow))" }}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span
                    className="text-white text-xs font-bold rounded-full px-4 py-1"
                    style={{ backgroundColor: "#03A9F4" }}
                  >
                    ⭐ MOST POPULAR
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-xs font-bold uppercase tracking-widest text-brand-teal mb-2">
                    Bundle 2
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    Full Home Easter Bundle
                  </h3>
                </div>
                <ul className="flex flex-col gap-2 flex-1">
                  {[
                    "Everything in Bundle 1",
                    "Carpet steam cleaning",
                    "Kitchen deep clean",
                    "Bathroom refresh",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-brand-teal shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-baseline gap-2">
                  <span className="text-muted-foreground line-through text-sm">
                    From $349
                  </span>
                  <span className="text-2xl font-extrabold text-brand-teal">
                    Now from $199
                  </span>
                </div>
                <PillButton
                  onClick={scrollToQuote}
                  className="w-full"
                  data-ocid="services.bundle2.primary_button"
                >
                  Get a Quote
                </PillButton>
              </div>

              {/* Card 3 – Peach */}
              <div
                className="rounded-3xl p-6 flex flex-col gap-4 shadow-xs hover:shadow-md transition-shadow"
                style={{ backgroundColor: "oklch(var(--card-peach))" }}
              >
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-brand-teal mb-2">
                    Bundle 3
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    Complete Spring Clean
                  </h3>
                </div>
                <ul className="flex flex-col gap-2 flex-1">
                  {[
                    "Everything in Bundle 2",
                    "Couch/upholstery cleaning",
                    "Window cleaning",
                    "Full home deep clean",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-brand-teal shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-baseline gap-2">
                  <span className="text-muted-foreground line-through text-sm">
                    From $499
                  </span>
                  <span className="text-2xl font-extrabold text-brand-teal">
                    Now from $349
                  </span>
                </div>
                <PillButton
                  onClick={scrollToQuote}
                  variant="outline"
                  className="w-full"
                  data-ocid="services.bundle3.primary_button"
                >
                  Get a Quote
                </PillButton>
              </div>
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section id="how-it-works" className="bg-white py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-up">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                Simple, Stress-Free Cleaning
              </h2>
              <p className="text-muted-foreground">
                Three easy steps to a spotless home
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 animate-fade-up">
              {[
                {
                  emoji: "📋",
                  step: "Step 1",
                  title: "Request a Quote",
                  desc: "Fill in the form below — we'll respond within the hour.",
                },
                {
                  emoji: "📅",
                  step: "Step 2",
                  title: "Choose Your Time",
                  desc: "Pick a time that works for you. We're flexible.",
                },
                {
                  emoji: "✨",
                  step: "Step 3",
                  title: "We Handle the Clean",
                  desc: "Sit back, relax, and let our team do the work.",
                },
              ].map((s) => (
                <div
                  key={s.title}
                  className="flex flex-col items-center text-center gap-3"
                >
                  <div className="w-16 h-16 rounded-2xl bg-brand-mint-light flex items-center justify-center text-3xl shadow-xs">
                    {s.emoji}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-brand-teal">
                    {s.step}
                  </div>
                  <div className="font-bold text-lg text-foreground">
                    {s.title}
                  </div>
                  <div className="text-sm text-muted-foreground">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Trust / About Section ── */}
        <section className="bg-brand-mint-lighter py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 animate-fade-up">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                Trusted by Hundreds of Australian Households
              </h2>
              <p className="text-muted-foreground">
                We take pride in delivering consistent, professional results
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-fade-up">
              {[
                {
                  emoji: "🏠",
                  title: "Local & Trusted",
                  desc: "Proudly serving Australian homes for years. Part of your community.",
                },
                {
                  emoji: "👷",
                  title: "Experienced Technicians",
                  desc: "Trained professionals you can trust inside your home.",
                },
                {
                  emoji: "🌿",
                  title: "Safe & Eco-Friendly",
                  desc: "Products safe for kids and pets. Tough on grime, gentle on your home.",
                },
                {
                  emoji: "📍",
                  title: "Major Cities Covered",
                  desc: "Sydney, Melbourne, Brisbane, Perth & more.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-2xl p-5 flex gap-4 items-start shadow-xs border border-border"
                >
                  <span className="text-3xl mt-0.5">{item.emoji}</span>
                  <div>
                    <div className="font-bold text-foreground mb-1">
                      {item.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Offer Section ── */}
        <section
          id="offer"
          className="py-16 px-4"
          style={{ background: "oklch(var(--brand-teal))" }}
        >
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Don't Miss This Easter Offer
            </h2>
            <p className="text-white/80 mb-8 text-base">
              Limited spots available — book before they're gone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              {[
                { emoji: "💰", text: "Save up to $150" },
                { emoji: "📅", text: "Flexible booking times" },
                { emoji: "⏳", text: "Limited Easter promotion" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-4 flex-1 justify-center"
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="font-bold text-white text-sm">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
            <PillButton
              onClick={scrollToQuote}
              variant="white"
              className="text-base px-10 py-4 shadow-xl"
              data-ocid="offer.book_now.primary_button"
            >
              Book Your Easter Clean Now
            </PillButton>
          </div>
        </section>

        {/* ── Quote Form Section ── */}
        <section id="quote" className="bg-white py-16 px-4">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8 animate-fade-up">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                Get Your Free Quote
              </h2>
              <p className="text-muted-foreground">
                We respond within the hour. No obligation.
              </p>
            </div>

            {submitted ? (
              <div
                className="rounded-3xl bg-brand-mint-light border border-border p-10 text-center animate-fade-in in-view"
                data-ocid="quote.success_state"
              >
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Quote Request Sent!
                </h3>
                <p className="text-muted-foreground text-sm">
                  Thank you! Our team will be in touch within the hour to
                  confirm your booking.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 animate-fade-up"
                data-ocid="quote.form.panel"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="name" className="text-sm font-semibold">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Jane Smith"
                      value={form.name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, name: e.target.value }))
                      }
                      required
                      data-ocid="quote.name.input"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="phone" className="text-sm font-semibold">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0400 000 000"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, phone: e.target.value }))
                      }
                      required
                      data-ocid="quote.phone.input"
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email" className="text-sm font-semibold">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    required
                    data-ocid="quote.email.input"
                    className="rounded-xl"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="service" className="text-sm font-semibold">
                    Service *
                  </Label>
                  <Select
                    value={form.serviceType}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, serviceType: v }))
                    }
                  >
                    <SelectTrigger
                      id="service"
                      className="rounded-xl"
                      data-ocid="quote.service.select"
                    >
                      <SelectValue placeholder="Select a bundle..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oven-bbq">
                        Oven &amp; BBQ Bundle (from $99)
                      </SelectItem>
                      <SelectItem value="full-home">
                        Full Home Easter Bundle (from $199)
                      </SelectItem>
                      <SelectItem value="complete-spring">
                        Complete Spring Clean (from $349)
                      </SelectItem>
                      <SelectItem value="carpet-steam">
                        Carpet Steam Cleaning
                      </SelectItem>
                      <SelectItem value="couch-upholstery">
                        Couch / Upholstery Cleaning
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="message" className="text-sm font-semibold">
                    Notes (optional)
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us anything useful — address, timing preferences, specific areas..."
                    value={form.message}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, message: e.target.value }))
                    }
                    rows={3}
                    data-ocid="quote.message.textarea"
                    className="rounded-xl"
                  />
                </div>

                <PillButton
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full py-4 text-base mt-2"
                  data-ocid="quote.submit.submit_button"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    "Send My Quote Request"
                  )}
                </PillButton>

                <p className="text-center text-xs text-muted-foreground mt-1">
                  🔒 We never share your details. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer
        style={{ background: "oklch(var(--brand-teal))" }}
        className="py-12 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col gap-3">
              <img
                src="https://res.cloudinary.com/dxqa2ywnx/image/upload/v1774399266/logo_02a8f4_1_igbxuh.svg"
                alt="Optima Cleaners"
                className="h-8 w-auto object-contain brightness-0 invert"
                style={{ maxWidth: 160 }}
              />
              <p className="text-white/70 text-sm max-w-xs">
                Trusted by hundreds of Australian households. Safe,
                professional, and always on time.
              </p>
            </div>

            <div>
              <div className="font-bold text-white mb-3 text-sm uppercase tracking-wider">
                Quick Links
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Services", href: "#services" },
                  { label: "How It Works", href: "#how-it-works" },
                  { label: "Get a Quote", href: "#quote" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    data-ocid={`footer.${link.label.toLowerCase().replace(/ /g, "-")}.link`}
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div className="font-bold text-white mb-3 text-sm uppercase tracking-wider">
                Contact
              </div>
              <div className="flex flex-col gap-2 text-sm text-white/70">
                <a
                  href="tel:1300123456"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" /> 1300 123 456
                </a>
                <span className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  Sydney · Melbourne · Brisbane · Perth
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/50">
            <span>
              © {new Date().getFullYear()} Optima Cleaners. All rights reserved.
              | Sydney | Melbourne | Brisbane | Perth
            </span>
            <span>
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/80 transition-colors underline"
              >
                caffeine.ai
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
