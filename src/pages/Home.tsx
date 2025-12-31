import React from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen, Users, Library, MapPin, Phone,
  Mail, ArrowRight, ExternalLink, GraduationCap,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-primary/20">
      <Navbar />

      {/* ================= HERO SECTION (Reduced Top Padding) ================= */}
      <section className="relative pt-12 pb-16 overflow-hidden border-b border-slate-100 dark:border-slate-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-primary text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              Digital Archive 2024
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
              നവജ്വാല <span className="text-primary">വായനശാല</span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              Bridging generations through the power of literature. Explore Malappuram's
              premier community library.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <Button asChild size="lg" className="rounded-xl px-8 h-12 font-bold shadow-md">
                <Link to="/search">
                  Browse Collection <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                onClick={scrollToContact}
                size="lg"
                variant="outline"
                className="rounded-xl px-8 h-12 font-bold bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 hover:bg-slate-50"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BENTO GRID (Solid Backgrounds) ================= */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <Card className="md:col-span-8 overflow-hidden border-none bg-primary text-white shadow-lg">
            <CardContent className="p-8 flex flex-col justify-between h-full space-y-12">
              <Library className="w-10 h-10 text-white/80" />
              <div>
                <h3 className="text-2xl font-bold mb-2">Our Mission</h3>
                <p className="text-primary-foreground/90 text-lg max-w-md leading-snug">
                  Providing free access to global knowledge and supporting local students with modern resources.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-4 border-2 border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-900 shadow-sm">
            <CardContent className="p-8 flex flex-col items-center text-center justify-center h-full space-y-4">
              <div className="w-14 h-14 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold">Community Driven</h3>
              <p className="text-sm text-slate-500">Built by the people, for the people of Pandikkad.</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-12 border-2 border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-900 shadow-sm">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-lg bg-slate-900 dark:bg-primary flex items-center justify-center text-white">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Our Vision</h3>
                  <p className="text-slate-500 text-sm">A literate community thriving through lifelong learning.</p>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </section>

      {/* ================= CONTACT SECTION (Solid & Clean) ================= */}
      <section id="contact" className="bg-slate-50 dark:bg-slate-950 py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-black">Get in Touch</h2>
                <div className="h-1 w-12 bg-primary" />
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Ready to join or have questions? Contact our team directly.
                </p>
              </div>

              <div className="grid gap-3">
                <a href="tel:+918113827842" className="flex items-center gap-4 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary transition-colors">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">Phone</span>
                    <span className="font-bold">+91 81138 27842</span>
                  </div>
                </a>

                <a href="mailto:contact@navajuvala.com" className="flex items-center gap-4 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary transition-colors">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">Email</span>
                    <span className="font-bold">contact@navajuvala.com</span>
                  </div>
                </a>
              </div>
            </div>

            <Card className="overflow-hidden border-none rounded-xl shadow-xl">
              <div className="p-5 bg-white dark:bg-slate-900 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <MapPin className="text-primary w-5 h-5" />
                  <span className="font-bold text-sm">Tharippadi Rd, Pandikkad</span>
                </div>
              </div>
              <div className="h-64 w-full bg-slate-200">
                <iframe
                  className="w-full h-full"
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
      <footer className="border-t border-slate-200 dark:border-slate-900 py-10">
        <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} Navajuvala Vayanashala. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
