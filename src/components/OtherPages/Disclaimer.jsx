import { Link } from "react-router-dom";

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
            Disclaimer
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Disclaimer Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8 mb-8">
          <div className="prose prose-invert max-w-none">
            <div className="space-y-8">
              {/* General Disclaimer */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  1. General Disclaimer
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  The information contained on CrazyDealsOnline website and all
                  associated services is for general information purposes only.
                  While we endeavor to keep the information up to date and
                  correct, we make no representations or warranties of any kind,
                  express or implied, about the completeness, accuracy,
                  reliability, suitability, or availability with respect to the
                  website or the information, products, services, or related
                  graphics contained on the website for any purpose.
                </p>
              </section>

              {/* Content Accuracy */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  2. Content Accuracy
                </h2>
                <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6 mb-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-yellow-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                        Important Notice
                      </h3>
                      <p className="text-yellow-100">
                        We do not guarantee the accuracy, completeness, or
                        usefulness of any content available through our
                        platform. All reliance you place on such information is
                        strictly at your own risk.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Book Content */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  3. Book Content & Intellectual Property
                </h2>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>
                    CrazyDealsOnline acts as a platform for digital book
                    distribution
                  </li>
                  <li>
                    We do not claim ownership of the intellectual property
                    rights of the books sold
                  </li>
                  <li>
                    All copyrights and intellectual property rights belong to
                    the respective authors and publishers
                  </li>
                  <li>
                    Views expressed in the books are those of the authors and
                    not necessarily of CrazyDealsOnline
                  </li>
                  <li>
                    We are not responsible for the accuracy, legality, or
                    content of the materials provided by publishers
                  </li>
                </ul>
              </section>

              {/* Professional Advice */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  4. No Professional Advice
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  The content available through our service, including but not
                  limited to books, articles, and other materials, is not
                  intended to be a substitute for professional advice. Always
                  seek the advice of qualified professionals regarding:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Medical, health, or mental health concerns</li>
                  <li>Legal advice or legal proceedings</li>
                  <li>Financial planning or investment decisions</li>
                  <li>Educational or career guidance</li>
                  <li>Any other professional domain</li>
                </ul>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  5. Limitation of Liability
                </h2>
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-red-400 mb-3">
                    Liability Exclusion
                  </h3>
                  <p className="text-gray-300 mb-4">
                    In no event will CrazyDealsOnline, its directors, employees,
                    partners, agents, suppliers, or affiliates, be liable for
                    any indirect, incidental, special, consequential, or
                    punitive damages, including without limitation, loss of
                    profits, data, use, goodwill, or other intangible losses,
                    resulting from:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li>
                      Your access to or use of or inability to access or use the
                      service
                    </li>
                    <li>
                      Any conduct or content of any third party on the service
                    </li>
                    <li>Any content obtained from the service</li>
                    <li>
                      Unauthorized access, use, or alteration of your
                      transmissions or content
                    </li>
                  </ul>
                </div>
              </section>

              {/* External Links */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  6. External Links Disclaimer
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  Our service may contain links to external websites that are
                  not provided or maintained by or in any way affiliated with
                  CrazyDealsOnline. Please note that we do not guarantee the
                  accuracy, relevance, timeliness, or completeness of any
                  information on these external websites. We are not responsible
                  for the content or practices of any linked sites.
                </p>
              </section>

              {/* Technical Issues */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  7. Technical Disclaimer
                </h2>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>
                    We do not guarantee that the service will be uninterrupted
                    or error-free
                  </li>
                  <li>
                    We are not responsible for any technical issues beyond our
                    control
                  </li>
                  <li>
                    Service may be temporarily unavailable for maintenance or
                    due to technical difficulties
                  </li>
                  <li>
                    We reserve the right to modify or discontinue any service
                    feature
                  </li>
                  <li>
                    Users are responsible for ensuring their devices meet
                    technical requirements
                  </li>
                </ul>
              </section>

              {/* Fair Use */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  8. Fair Use & Copyright
                </h2>
                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-blue-400 mb-3">
                    Copyright Notice
                  </h3>
                  <p className="text-gray-300 mb-4">
                    All books and digital content available through
                    CrazyDealsOnline are protected by copyright laws. By
                    purchasing and accessing content through our platform, you
                    agree to:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li>
                      Use the content for personal, non-commercial purposes only
                    </li>
                    <li>
                      Not reproduce, distribute, or share purchased content
                      illegally
                    </li>
                    <li>
                      Respect the intellectual property rights of authors and
                      publishers
                    </li>
                    <li>
                      Not engage in piracy or unauthorized sharing of digital
                      content
                    </li>
                  </ul>
                </div>
              </section>

              {/* Pricing & Availability */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  9. Pricing & Availability
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  We reserve the right to change prices and availability of any
                  product at any time without notice. While we strive to provide
                  accurate pricing information, errors may occur. In the event
                  of a pricing error, we reserve the right to cancel any orders
                  placed at the incorrect price.
                </p>
              </section>

              {/* Consent */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  10. Consent & Updates
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  By using our website and services, you hereby consent to our
                  disclaimer and agree to its terms. We may update this
                  Disclaimer from time to time. We will notify you of any
                  changes by posting the new Disclaimer on this page. Changes
                  are effective immediately upon posting.
                </p>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  11. Contact Information
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  If you have any questions about this Disclaimer, please
                  contact us:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mt-2">
                  <li>Email: support@crazydealsonline.in</li>
                  <li>Response Time: Within 24-48 hours</li>
                </ul>
              </section>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">
            Key Disclaimer Points
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-800">
              <h4 className="font-semibold text-purple-400 mb-2">
                User Responsibility
              </h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Use content at your own risk</li>
                <li>• Verify information independently</li>
                <li>• Seek professional advice when needed</li>
                <li>• Respect copyright laws</li>
              </ul>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
              <h4 className="font-semibold text-gray-400 mb-2">
                Platform Role
              </h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• We are a distribution platform</li>
                <li>• No ownership of book content</li>
                <li>• Not responsible for author views</li>
                <li>• Service availability not guaranteed</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <Link to="/" className="hover:text-cyan-400 transition-colors">
              Home
            </Link>
            <Link
              to="/privacy-policy"
              className="hover:text-cyan-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/contact-us"
              className="hover:text-cyan-400 transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/return-policy"
              className="hover:text-cyan-400 transition-colors"
            >
              Return Policy
            </Link>
            <Link
              to="/refund-policy"
              className="hover:text-cyan-400 transition-colors"
            >
              Refund Policy
            </Link>
            <Link
              to="/terms-and-conditions"
              className="hover:text-cyan-400 transition-colors"
            >
              Terms and Conditions
            </Link>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} CrazyDealsOnline. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
