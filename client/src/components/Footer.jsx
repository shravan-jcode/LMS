import React from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, Linkedin, Twitter, Zap, ArrowRight } from "lucide-react";

// Data structure for cleaner link management
const FOOTER_LINKS = [
  {
    title: "Explore",
    links: [
      { name: "Courses", to: "/course/search?query" },
      { name: "My Learning", to: "/my-learning" },
      { name: "Categories", to: "/categories" },
      { name: "Certificates", to: "/certificates" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", to: "/about" },
      { name: "Careers", to: "/careers" },
      { name: "Blog", to: "/blog" },
      { name: "Contact Us", to: "/contact" },
    ],
  },
  {
    title: "Support & Legal",
    links: [
      { name: "Help Center", to: "/help" },
      { name: "Privacy Policy", to: "/privacy" },
      { name: "Terms of Service", to: "/terms" },
      { name: "FAQ", to: "/faq" },
    ],
  },
];

const Footer = () => {
  return (
    // ✨ FIX APPLIED HERE: Changed bg-gray-50 to bg-gray-100 and dark:bg-gray-950 to dark:bg-gray-900.
    // Also removed the top border to prevent a sharp visual break.
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Grid: 5 columns on desktop for better link distribution */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-y-12 gap-x-10"> 
          
          {/* 1. Brand & Social */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={26} className="text-teal-600 dark:text-teal-400" />
              <h2 className="font-extrabold text-2xl text-gray-900 dark:text-white">
                LearnSphere
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 max-w-xs">
              Empower your future with **knowledge**. Master new skills and grow your career.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* 2, 3, 4. Link Columns (mapped from data) */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-3 text-sm">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.to}
                      className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* 5. Instructor & Newsletter (last column) */}
          <div className="col-span-2 md:col-span-1">
            {/* Instructor Link - Highlighted CTA */}
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Teach with us
            </h3>
            <Button asChild 
              // COLOR FIX: Ensures the Instructor button is Teal
              className="w-full mb-8 bg-teal-600 dark:bg-teal-700 hover:bg-teal-700 dark:hover:bg-teal-600 text-white transition-all duration-300 rounded-lg shadow-md hover:shadow-lg">
                <Link to="/instructor/signup" className="flex items-center justify-center gap-2">
                  Become an Instructor <ArrowRight size={16} />
                </Link>
            </Button>
            
            {/* Newsletter */}
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Newsletter
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              Get the latest course updates and offers directly to your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2"
            >
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus-visible:ring-teal-500 rounded-lg h-10"
              />
              <Button 
                type="submit"
                // COLOR FIX: Ensures the Newsletter button is Teal
                className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg h-10 px-4"
                aria-label="Subscribe to newsletter"
              >
                <Zap size={16} /> 
              </Button>
            </form>
          </div>
        </div>

        {/* --- */}

        {/* Bottom Section: Separator and Copyright */}
        {/* We'll keep the mt-16 on the separator for visual spacing before the footer bottom line */}
        <Separator className="bg-gray-300 dark:bg-gray-800 mt-16 mb-6" />
        <div className="text-center md:flex md:justify-between md:items-center text-gray-600 dark:text-gray-400 text-xs md:text-sm">
          <p className="order-2 md:order-1 mb-4 md:mb-0">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              LearnSphere
            </span>{" "}
            | All rights reserved.
          </p>
          <div className="flex justify-center md:justify-end order-1 md:order-2 space-x-4">
              {/* Additional quick links for legal bottom bar */}
              <Link to="/sitemap" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                Site Map
              </Link>
              <Link to="/security" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                Security
              </Link>
            <Link to="/accessibility" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                Accessibility
              </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;