import React from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen, Users, Library, MapPin, Phone,
  Mail, ArrowRight, GraduationCap, Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-primary/20">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_50%,rgba(var(--primary-rgb),0.05)_0%,transparent_100%)]" />
        
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Digital Archive 2024
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-none mb-6">
            നവജ്വാല <br />
            <span className="text-primary italic">വായനശാല</span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Bridging generations through the power of literature. Explore Malappuram's 
            premier community library in the heart of Pandikkad.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="rounded-full px-10 h-14 text-base font-bold shadow-xl shadow-primary/20">
              <Link to="/search">
                Browse Collection <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              onClick={scrollToContact}
              size="lg"
              variant="outline"
              className="rounded-full px-10 h-14 text-base font-bold border-slate-200 dark:border-slate-800"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* ================= BENTO GRID SECTION ================= */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Main Mission Card */}
          <Card className="md:col-span-7 bg-primary border-none shadow-2xl shadow-primary/10">
            <CardContent className="p-10 flex flex-col justify-between h-full min-h-[320px]">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Library className="w-6 h-6 text-white" />
              </div>
              <div className="text-white">
                <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
                <p className="text-primary-foreground/90 text-lg leading-relaxed max-w-md">
                  Providing free access to global knowledge and supporting local students with modern resources and a peaceful study environment.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Vision & Community Cards */}
          <div className="md:col-span-5 grid gap-6">
            <Card className="bg-slate-50 dark:bg-slate-900 border-none">
              <CardContent className="p-8 flex items-start gap-5">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Community Driven</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Built and sustained by the people of Pandikkad for over two decades.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 dark:bg-slate-800 border-none text-white">
              <CardContent className="p-8 flex items-start gap-5">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/10 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-white">Educational Excellence</h3>
                  <p className="text-slate-400 text-sm">Empowering students through specialized reference sections and workshops.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <section id="contact" className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-4xl font-black tracking-tight">Visit Us Today</h2>
                <div className="h-1.5 w-16 bg-primary rounded-full" />
                <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                  Whether you're looking for a quiet place to study or want to donate books, our doors are always open.
                </p>
              </div>

              <div className="space-y-4">
                <ContactLink 
                  href="tel:+918113827842" 
                  icon={<Phone />} 
                  label="Phone" 
                  value="+91 81138 27842" 
                />
                <ContactLink 
                  href="mailto:contact@navajuvala.com" 
                  icon={<Mail />} 
                  label="Email" 
                  value="contact@navajuvala.com" 
                />
              </div>
            </div>

            <Card className="overflow-hidden border-none shadow-2xl">
              <div className="bg-white dark:bg-slate-900 p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="text-primary w-4 h-4" />
                  </div>
                  <span className="font-bold">Tharippadi Rd, Pandikkad</span>
                </div>
              </div>
              <div className="h-80 w-full bg-slate-100 dark:bg-slate-800">
                <iframe
                  className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                  src="https://www.google.com/maps?q=454W+H7F,+Tharippadi+Rd,+Tharippadi,+Kerala+676521&output=embed" // Replace with actual embed
                  loading="lazy"
                  title="Library Location"
                />
              </div>
            </Card>

          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-black text-xl tracking-tighter">
            NAV<span className="text-primary">AJUVALA</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Navajuvala Vayanashala. All rights reserved.
          </p>
          
        </div>
      </footer>
    </div>
  );
};

// Helper Component for Contact Links
const ContactLink = ({ href, icon, label, value }: { href: string; icon: React.ReactNode; label: string; value: string }) => (
  <a href={href} className="group flex items-center gap-5 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-primary transition-all duration-300">
    <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
      {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
    </div>
    <div className="flex flex-col">
      <span className="text-xs uppercase font-bold text-slate-400 group-hover:text-white/70 tracking-widest">{label}</span>
      <span className="font-bold text-lg group-hover:text-white transition-colors">{value}</span>
    </div>
  </a>
);

export default Home;