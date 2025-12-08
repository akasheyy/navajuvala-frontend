import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Library } from "lucide-react";
import { MapPin} from "lucide-react";
const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="bg-hero-gradient py-12 border-b">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">About Navajuvala Vayanashala</h1>
          <p className="text-muted-foreground text-lg">
            A space for learning, reading and community growth.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 max-w-4xl space-y-10">
        {/* About Paragraph */}
        <Card className="shadow-card">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Who We Are</h2>
            <p className="text-muted-foreground leading-relaxed">
              Navajuvala Vayanashala is a community-driven library dedicated to
              promoting reading culture, education, and knowledge-sharing in our locality.
              We believe books are not just pages – they are powerful tools that inspire ideas,
              creativity, and innovation.
            </p>
          </CardContent>
        </Card>

        {/* Mission, Vision, Community Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="shadow-card">
            <CardContent className="p-6 text-center space-y-3">
              <div className="flex justify-center">
                <Library className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Our Mission</h3>
              <p className="text-muted-foreground text-sm">
                To provide free access to knowledge, encourage reading habits, and support
                students and families in the community.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6 text-center space-y-3">
              <div className="flex justify-center">
                <BookOpen className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Our Vision</h3>
              <p className="text-muted-foreground text-sm">
                A community where every person has access to books, literature, and lifelong learning.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6 text-center space-y-3">
              <div className="flex justify-center">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Our Community</h3>
              <p className="text-muted-foreground text-sm">
                We are proud to be a local initiative supported by volunteers, donors,
                and dedicated readers who shape our library.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <Card className="shadow-card">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-2xl font-semibold">Contact Us</h2>
            <p className="text-muted-foreground">
              📍 Pandikkad, Malappuram, Kerala  
              <br />📞 Phone: +91 81138 27842    
              <br />✉️ Email: info@navajuvala.org
            </p>
          </CardContent>
        </Card>
        {/* Location Section */}
            <div className="space-y-3">
              <MapPin className="w-10 h-10 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">Our Location</h3>
              <p className="text-muted-foreground text-lg">
                Tharippadi Rd,<br />
                Tharippadi, Kerala 676521
              </p>

              {/* Google Maps Embed */}
              <iframe
                className="w-full h-64 rounded-lg mt-4"
                src="https://www.google.com/maps?q=454W+H7F,+Tharippadi+Rd,+Tharippadi,+Kerala+676521&output=embed"
                loading="lazy"
              ></iframe>
            </div>
      </div>
    </div>
  );
};

export default About;
