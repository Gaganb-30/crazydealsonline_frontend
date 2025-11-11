import { Link } from "react-router-dom";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Terms Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8 mb-8">
          <div className="prose prose-invert max-w-none">
            <div className="space-y-8">
              {/* Agreement */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  1. Agreement to Terms
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  By accessing and using CrazyDealsOnline ("the Platform"), you
                  accept and agree to be bound by these Terms and Conditions. If
                  you disagree with any part of these terms, you may not access
                  our platform or use our services.
                </p>
              </section>

              {/* Eligibility */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  2. Eligibility
                </h2>
                <div className="bg-teal-900/20 border border-teal-700 rounded-lg p-6 mb-4">
                  <h3 className="text-xl font-semibold text-teal-400 mb-3">
                    Age Requirement
                  </h3>
                  <p className="text-gray-300">
                    You must be at least 13 years old to use our platform. If
                    you are under 18, you may only use the platform with the
                    consent and supervision of a parent or legal guardian.
                  </p>
                </div>
              </section>

              {/* Account Registration */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  3. Account Registration
                </h2>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>
                    You must provide accurate and complete registration
                    information
                  </li>
                  <li>
                    You are responsible for maintaining the confidentiality of
                    your account credentials
                  </li>
                  <li>
                    You agree to accept responsibility for all activities under
                    your account
                  </li>
                  <li>
                    We reserve the right to refuse service, terminate accounts,
                    or remove content at our discretion
                  </li>
                  <li>
                    You must notify us immediately of any unauthorized use of
                    your account
                  </li>
                </ul>
              </section>

              {/* Purchases & Payments */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  4. Purchases & Payments
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-cyan-400 mb-2">
                      Payment Terms
                    </h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                      <li>
                        All prices are in INR (Indian Rupees) unless otherwise
                        specified
                      </li>
                      <li>
                        Payment must be completed before access to digital
                        content is granted
                      </li>
                      <li>
                        We use third-party payment processors (Razorpay) for
                        secure transactions
                      </li>
                      <li>
                        You agree to provide current, complete, and accurate
                        purchase information
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-cyan-400 mb-2">
                      Order Confirmation
                    </h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                      <li>
                        Orders are subject to availability and confirmation
                      </li>
                      <li>
                        We reserve the right to refuse or cancel any order
                      </li>
                      <li>
                        Digital content is delivered immediately upon successful
                        payment
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Intellectual Property */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  5. Intellectual Property Rights
                </h2>
                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-blue-400 mb-3">
                    Copyright Notice
                  </h3>
                  <p className="text-gray-300 mb-4">
                    All content available through CrazyDealsOnline, including
                    but not limited to:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li>Digital books, e-books, and publications</li>
                    <li>Platform design, logos, and graphics</li>
                    <li>Software code and applications</li>
                    <li>Documentation and marketing materials</li>
                  </ul>
                  <p className="text-gray-300 mt-4">
                    Are protected by copyright and intellectual property laws.
                    You may not reproduce, distribute, modify, or create
                    derivative works without explicit permission.
                  </p>
                </div>
              </section>

              {/* User License */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  6. User License
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Upon purchase, we grant you a limited, non-exclusive,
                  non-transferable license to:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>
                    Access and use purchased digital content for personal,
                    non-commercial purposes
                  </li>
                  <li>
                    Download content to your personal devices for offline access
                  </li>
                  <li>Maintain a personal library of purchased materials</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  This license does not permit redistribution, public
                  performance, or commercial use.
                </p>
              </section>

              {/* Prohibited Activities */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  7. Prohibited Activities
                </h2>
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-red-400 mb-3">
                    Strictly Prohibited
                  </h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li>Sharing account credentials with others</li>
                    <li>
                      Redistributing, reselling, or sharing purchased content
                    </li>
                    <li>
                      Reverse engineering, decompiling, or disassembling any
                      software
                    </li>
                    <li>
                      Using automated systems, bots, or scrapers to access the
                      platform
                    </li>
                    <li>
                      Uploading malicious code or engaging in hacking attempts
                    </li>
                    <li>Impersonating others or providing false information</li>
                    <li>Violating any applicable laws or regulations</li>
                  </ul>
                </div>
              </section>

              {/* User Content */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  8. User-Generated Content
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  By submitting content (reviews, comments, etc.) to our
                  platform, you grant us a worldwide, non-exclusive,
                  royalty-free license to use, modify, and display such content.
                  You represent that you own or have the necessary rights to any
                  content you submit.
                </p>
              </section>

              {/* Termination */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  9. Termination
                </h2>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>
                    We may terminate or suspend your account for violations of
                    these terms
                  </li>
                  <li>
                    Upon termination, your right to use the platform will
                    immediately cease
                  </li>
                  <li>
                    Termination does not affect any rights or obligations that
                    arose prior to termination
                  </li>
                  <li>
                    You may terminate your account at any time by contacting
                    support
                  </li>
                </ul>
              </section>

              {/* Disclaimer of Warranties */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  10. Disclaimer of Warranties
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  The platform and all content are provided "as is" without
                  warranties of any kind, either express or implied. We do not
                  warrant that the platform will be uninterrupted, error-free,
                  or completely secure. Your use of the platform is at your sole
                  risk.
                </p>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  11. Limitation of Liability
                </h2>
                <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-6">
                  <p className="text-gray-300">
                    To the fullest extent permitted by law, CrazyDealsOnline
                    shall not be liable for any indirect, incidental, special,
                    consequential, or punitive damages, including without
                    limitation, loss of profits, data, use, goodwill, or other
                    intangible losses, resulting from your access to or use of
                    or inability to access or use the platform.
                  </p>
                </div>
              </section>

              {/* Governing Law */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  12. Governing Law
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  These Terms shall be governed and construed in accordance with
                  the laws of India, without regard to its conflict of law
                  provisions. Any disputes shall be subject to the exclusive
                  jurisdiction of the courts located in India.
                </p>
              </section>

              {/* Changes to Terms */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  13. Changes to Terms
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  We reserve the right to modify or replace these Terms at any
                  time. If a revision is material, we will provide at least 30
                  days' notice prior to any new terms taking effect. What
                  constitutes a material change will be determined at our sole
                  discretion.
                </p>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  14. Contact Information
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  For any questions about these Terms and Conditions, please
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
            Key Terms Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-teal-900/20 p-4 rounded-lg border border-teal-800">
              <h4 className="font-semibold text-teal-400 mb-2">Your Rights</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Access purchased content for personal use</li>
                <li>• Cancel orders within 48 hours</li>
                <li>• Request account termination</li>
                <li>• Receive support for technical issues</li>
              </ul>
            </div>
            <div className="bg-cyan-900/20 p-4 rounded-lg border border-cyan-800">
              <h4 className="font-semibold text-cyan-400 mb-2">
                Your Responsibilities
              </h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Maintain account security</li>
                <li>• Use content for personal purposes only</li>
                <li>• Respect intellectual property rights</li>
                <li>• Follow platform rules and guidelines</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Acceptance Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6 mb-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            Acceptance of Terms
          </h3>
          <p className="text-gray-300">
            By using CrazyDealsOnline, you acknowledge that you have read,
            understood, and agree to be bound by these Terms and Conditions.
          </p>
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
              to="/disclaimer"
              className="hover:text-cyan-400 transition-colors"
            >
              Disclaimer
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

export default TermsAndConditions;
