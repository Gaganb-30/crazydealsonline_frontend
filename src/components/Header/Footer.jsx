import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <div>
      <footer className="bg-white border-t border-gray-200 px-8 py-12">
        <div className="grid grid-cols-4 gap-8 mb-8">
          {/*<div>
                        <h4 className="font-bold text-navy mb-4">Get in Touch</h4>
                        <p className="text-sm text-gray-600 mb-2">PO Box Roseburn, Short 1534</p>
                        <p className="text-sm text-gray-600">bookish@email.com</p>
                    </div> */}
          <div>
            <h4 className="font-bold text-navy mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <button
                  onClick={() => navigate("/about-us")}
                  className="hover:text-navy"
                >
                  About
                </button>
              </li>
              <li>
                <button className="hover:text-navy">Blog</button>
              </li>
              <li>
                <button className="hover:text-navy">Brands</button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-navy mb-4">Community</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <button className="hover:text-navy">Forum</button>
              </li>
              <li>
                <button className="hover:text-navy">Advertising</button>
              </li>
              <li>
                <button
                  className="hover:text-navy"
                  onClick={() => navigate("/contact-us")}
                >
                  Contact us
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-navy mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <button
                  className="hover:text-navy"
                  onClick={() => navigate("/privacy-policy")}
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  className="hover:text-navy"
                  onClick={() => navigate("/disclaimer")}
                >
                  Disclaimer
                </button>
              </li>
              <li>
                <button
                  className="hover:text-navy"
                  onClick={() => navigate("/terms-and-conditions")}
                >
                  Terms and Conditions
                </button>
              </li>
              <li>
                <button
                  className="hover:text-navy"
                  onClick={() => navigate("/refund-policy")}
                >
                  Refund Policy
                </button>
              </li>
              <li>
                <button
                  className="hover:text-navy"
                  onClick={() => navigate("/return-policy")}
                >
                  Return Policy
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8 flex justify-between items-center">
          <div className="flex gap-4">
            <button className="text-gray-600 hover:text-navy">Facebook</button>
            <button className="text-gray-600 hover:text-navy">Twitter</button>
            <button className="text-gray-600 hover:text-navy">Instagram</button>
          </div>
          <p className="text-sm text-gray-600">© 2025 - All rights reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
