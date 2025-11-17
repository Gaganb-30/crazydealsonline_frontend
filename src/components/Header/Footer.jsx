import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <div>
      <footer className="bg-white border-t border-gray-200 px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
          {/* Logo Section - Takes 2 columns on desktop for more prominence */}
          <div className="lg:col-span-2 flex flex-col items-center lg:items-start">
            <img
              src="https://i.postimg.cc/7GhqH8ST/logo.png"
              className="h-30 lg:h-35 w-auto object-contain mb-4"
              border="0"
              alt="logo"
            />
            <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-2 text-center lg:text-left">
              CrazyDealsOnline
            </h2>
            <p className="text-gray-600 text-lg text-center lg:text-left max-w-md">
              Your one-stop destination for amazing deals and exclusive offers
            </p>
          </div>

          {/* Links Sections - Take 1 column each */}
          <div>
            <h4 className="font-bold text-navy mb-4 text-lg">Company</h4>
            <ul className="space-y-3 text-base text-gray-600">
              <li>
                <button
                  onClick={() => navigate("/about-us")}
                  className="hover:text-navy transition-colors duration-200 w-full text-left"
                >
                  About
                </button>
              </li>
              <li>
                <button className="hover:text-navy transition-colors duration-200 w-full text-left">
                  Blog
                </button>
              </li>
              <li>
                <button className="hover:text-navy transition-colors duration-200 w-full text-left">
                  Brands
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-navy mb-4 text-lg">Community</h4>
            <ul className="space-y-3 text-base text-gray-600">
              <li>
                <button className="hover:text-navy transition-colors duration-200 w-full text-left">
                  Forum
                </button>
              </li>
              <li>
                <button className="hover:text-navy transition-colors duration-200 w-full text-left">
                  Advertising
                </button>
              </li>
              <li>
                <button
                  className="hover:text-navy transition-colors duration-200 w-full text-left"
                  onClick={() => navigate("/contact-us")}
                >
                  Contact us
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-navy mb-4 text-lg">Legal</h4>
            <ul className="space-y-3 text-base text-gray-600">
              <li>
                <button
                  className="hover:text-navy transition-colors duration-200 w-full text-left"
                  onClick={() => navigate("/privacy-policy")}
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  className="hover:text-navy transition-colors duration-200 w-full text-left"
                  onClick={() => navigate("/disclaimer")}
                >
                  Disclaimer
                </button>
              </li>
              <li>
                <button
                  className="hover:text-navy transition-colors duration-200 w-full text-left"
                  onClick={() => navigate("/terms-and-conditions")}
                >
                  Terms and Conditions
                </button>
              </li>
              <li>
                <button
                  className="hover:text-navy transition-colors duration-200 w-full text-left"
                  onClick={() => navigate("/refund-policy")}
                >
                  Refund Policy
                </button>
              </li>
              <li>
                <button
                  className="hover:text-navy transition-colors duration-200 w-full text-left"
                  onClick={() => navigate("/return-policy")}
                >
                  Return Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex gap-6">
            <button className="text-gray-600 hover:text-navy transition-colors duration-200 text-base">
              Facebook
            </button>
            <button className="text-gray-600 hover:text-navy transition-colors duration-200 text-base">
              Twitter
            </button>
            <button className="text-gray-600 hover:text-navy transition-colors duration-200 text-base">
              Instagram
            </button>
          </div>
          <p className="text-base text-gray-600">
            © 2025 CrazyDealsOnline - All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
