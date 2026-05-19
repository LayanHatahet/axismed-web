import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Globe, Link2, Share2, Play } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "About AxisMed",    href: "/about" },
    { label: "Courses & Events", href: "/courses" },
    { label: "Media & Production", href: "/media" },
    { label: "Partners",         href: "/partners" },
    { label: "Contact",          href: "/contact" },
  ],
  Programs: [
    { label: "Cadaveric Training",       href: "/courses?type=cadaveric" },
    { label: "Hands-on Workshops",       href: "/courses?type=workshop" },
    { label: "Digital Surgery",          href: "/courses?type=digital" },
    { label: "Industry Events",          href: "/courses?type=industry" },
    { label: "Organize a Course",        href: "/contact?type=partnership" },
  ],
  Resources: [
    { label: "Media Gallery",        href: "/media" },
    { label: "Podcast & Interviews", href: "/media" },
    { label: "Course Catalog",       href: "/courses" },
    { label: "Faculty Network",      href: "/about" },
    { label: "Contact Us",           href: "/contact" },
  ],
};

const socialLinks = [
  { Icon: Globe,   href: "https://instagram.com/axismed",        label: "Instagram" },
  { Icon: Link2,   href: "https://linkedin.com/company/axismed", label: "LinkedIn" },
  { Icon: Share2,  href: "https://twitter.com/axismed",          label: "Twitter/X" },
  { Icon: Play,    href: "https://youtube.com/@axismed",         label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-bg-base border-t border-border">
      {/* CTA strip */}
      <div className="bg-gradient-to-r from-purple-900/40 via-purple-800/30 to-purple-900/40 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to advance your practice?
          </h3>
          <p className="text-text-secondary mb-6 max-w-xl mx-auto">
            Join the region&apos;s premier surgical education and medical innovation platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/courses"
              className="bg-purple-500 hover:bg-purple-400 text-white font-semibold px-7 py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)]"
            >
              Browse All Courses
            </Link>
            <Link
              href="/contact"
              className="border border-border-strong text-white font-medium px-7 py-3 rounded-lg hover:bg-white/5 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5 w-fit group">
              <div className="w-11 h-11 relative shrink-0">
                <Image
                  src="/logo-symbol.png"
                  alt="AxisMed"
                  fill
                  className="object-contain drop-shadow-[0_0_10px_rgba(124,58,237,0.5)] group-hover:drop-shadow-[0_0_16px_rgba(124,58,237,0.7)] transition-all duration-300"
                />
              </div>
              <div>
                <div className="font-display font-bold text-xl tracking-wider">
                  <span className="text-white/70">AXIS</span>
                  <span className="text-purple-400">MED</span>
                </div>
                <div className="text-[9px] text-text-dim tracking-[0.16em] uppercase">
                  Education · Innovation · Global Healthcare
                </div>
              </div>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-sm">
              A regional healthcare education and medical media platform advancing surgical training,
              healthcare innovation, and professional medical engagement across the Middle East.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                <span className="text-text-secondary">Dubai Healthcare City, Dubai, UAE</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <a href="mailto:info@axismed.com" className="text-text-secondary hover:text-white transition-colors">
                  info@axismed.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                <a href="tel:+971501897038" className="text-text-secondary hover:text-white transition-colors">
                  +971 50 189 7038
                </a>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-5">
                {group}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-text-secondary text-sm hover:text-white hover:translate-x-1 transition-all inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-dim text-sm">
            © {new Date().getFullYear()} AxisMed. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-purple-500/20 text-text-muted hover:text-purple-300 transition-all"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs text-text-dim">
            <Link href="/privacy" className="hover:text-text-muted transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-text-muted transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
