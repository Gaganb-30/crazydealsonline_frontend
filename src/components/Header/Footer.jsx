import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <footer className="bg-white border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-8 lg:mb-12">
            {/* Logo Section - Full width on mobile, 2 cols on desktop */}
            <div className="lg:col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
              <img
                src="https://i.postimg.cc/7GhqH8ST/logo.png"
                className="h-20 sm:h-24 lg:h-28 w-auto object-contain mb-4 lg:mb-6"
                border="0"
                alt="CrazyDealsOnline Logo"
              />
              <p className="text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed max-w-md">
                Your one-stop destination for amazing deals and exclusive offers
              </p>

              {/* Social Media Icons - Mobile visible */}
              <div className="flex gap-4 mt-6 lg:hidden">
                <button className="text-gray-500 hover:text-blue-600 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-50">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button className="text-gray-500 hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-50">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </button>
                <button className="text-gray-500 hover:text-pink-600 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-50">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.24 14.865 3.75 13.714 3.75 12.417s.49-2.448 1.376-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.886.875 1.376 2.026 1.376 3.323s-.49 2.448-1.376 3.323c-.875.807-2.026 1.297-3.323 1.297z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Links Sections */}
            <div className="text-center md:text-left">
              <h4 className="font-bold text-navy mb-4 text-lg sm:text-xl">Company</h4>
              <ul className="space-y-3 text-base text-gray-600">
                <li>
                  <button
                    onClick={() => navigate("/about-us")}
                    className="hover:text-navy transition-colors duration-200 w-full text-left py-1"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button className="hover:text-navy transition-colors duration-200 w-full text-left py-1">
                    Blog
                  </button>
                </li>
                <li>
                  <button className="hover:text-navy transition-colors duration-200 w-full text-left py-1">
                    Brands
                  </button>
                </li>
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h4 className="font-bold text-navy mb-4 text-lg sm:text-xl">Community</h4>
              <ul className="space-y-3 text-base text-gray-600">
                <li>
                  <button className="hover:text-navy transition-colors duration-200 w-full text-left py-1">
                    Forum
                  </button>
                </li>
                <li>
                  <button className="hover:text-navy transition-colors duration-200 w-full text-left py-1">
                    Advertising
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-navy transition-colors duration-200 w-full text-left py-1"
                    onClick={() => navigate("/contact-us")}
                  >
                    Contact us
                  </button>
                </li>
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h4 className="font-bold text-navy mb-4 text-lg sm:text-xl">Legal</h4>
              <ul className="space-y-3 text-base text-gray-600">
                <li>
                  <button
                    className="hover:text-navy transition-colors duration-200 w-full text-left py-1"
                    onClick={() => navigate("/privacy-policy")}
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-navy transition-colors duration-200 w-full text-left py-1"
                    onClick={() => navigate("/disclaimer")}
                  >
                    Disclaimer
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-navy transition-colors duration-200 w-full text-left py-1"
                    onClick={() => navigate("/terms-and-conditions")}
                  >
                    Terms and Conditions
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-navy transition-colors duration-200 w-full text-left py-1"
                    onClick={() => navigate("/refund-policy")}
                  >
                    Refund Policy
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-navy transition-colors duration-200 w-full text-left py-1"
                    onClick={() => navigate("/return-policy")}
                  >
                    Return Policy
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 pt-8 flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Social Media Icons - Desktop visible */}
            <div className="hidden lg:flex gap-4">
              <button className="text-gray-500 hover:text-blue-600 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-base">Facebook</span>
              </button>
              <button className="text-gray-500 hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
                <span className="text-base">Twitter</span>
              </button>
              <button className="text-gray-500 hover:text-pink-600 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.24 14.865 3.75 13.714 3.75 12.417s.49-2.448 1.376-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.886.875 1.376 2.026 1.376 3.323s-.49 2.448-1.376 3.323c-.875.807-2.026 1.297-3.323 1.297z" />
                </svg>
                <span className="text-base">Instagram</span>
              </button>
            </div>

            <p className="text-base text-gray-600 text-center lg:text-right order-first lg:order-last">
              © 2025 CrazyDealsOnline - All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;