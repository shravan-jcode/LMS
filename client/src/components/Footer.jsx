import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, Linkedin, Twitter, Zap, ArrowRight, } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

// Footer links data
const FOOTER_LINKS = [
  {
    title: "Explore",
    links: [
      { name: "Courses" },
      { name: "My Learning" },
      { name: "Categories" },
      { name: "Certificates" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us" },
      { name: "Careers" },
      { name: "Blog" },
      { name: "Contact Us" },
    ],
  },
  {
    title: "Support & Legal",
    links: [
      { name: "Help Center" },
      { name: "Privacy Policy" },
      { name: "Terms of Service" },
      { name: "FAQ" },
    ],
  },
];

const Footer = () => {
  // Handler for placeholder links
  const handleComingSoon = (name) => {
    toast.info(`${name} page is coming soon!`);
  };

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-y-12 gap-x-10">
          {/* Brand & Social */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={26} className="text-teal-600 dark:text-teal-400" />
              <h2 className="font-extrabold text-2xl text-gray-900 dark:text-white">
                LearnSphere
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 max-w-xs">
              Empower your future with <strong>knowledge</strong>. Master new skills and grow your career.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-3 text-sm">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => handleComingSoon(link.name)}
                      className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left w-full"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Instructor & Newsletter */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Teach with us
            </h3>
           <Button asChild className="w-full mb-8 bg-teal-600 dark:bg-teal-700 hover:bg-teal-700 dark:hover:bg-teal-600 text-white transition-all duration-300 rounded-lg shadow-md hover:shadow-lg">
  <Link to="/instructor/signup" className="flex items-center justify-center gap-2">
    Become an Instructor <ArrowRight size={16} />
  </Link>
</Button>

            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Newsletter
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              Get the latest course updates and offers directly to your inbox.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus-visible:ring-teal-500 rounded-lg h-10"
              />
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg h-10 px-4" aria-label="Subscribe to newsletter">
                <Zap size={16} />
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <Separator className="bg-gray-300 dark:bg-gray-800 mt-16 mb-6" />
        <div className="text-center md:flex md:justify-between md:items-center text-gray-600 dark:text-gray-400 text-xs md:text-sm">
          <p className="order-2 md:order-1 mb-4 md:mb-0">
            © {new Date().getFullYear()} <span className="font-semibold text-gray-800 dark:text-gray-200">LearnSphere</span> | All rights reserved.
          </p>
          <div className="flex justify-center md:justify-end order-1 md:order-2 space-x-4">
            <button onClick={() => handleComingSoon("Site Map")} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              Site Map
            </button>
            <button onClick={() => handleComingSoon("Security")} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              Security
            </button>
            <button onClick={() => handleComingSoon("Accessibility")} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              Accessibility
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
