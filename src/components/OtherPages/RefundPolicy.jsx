import { Link } from "react-router-dom";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-500 mb-4">
            Refund Policy
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Policy Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8 mb-8">
          <div className="prose prose-invert max-w-none">
            <div className="space-y-8">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  1. Refund Overview
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  At CrazyDealsOnline, we want you to be completely satisfied
                  with your purchase. This refund policy outlines the
                  circumstances under which refunds are provided and the process
                  for requesting them.
                </p>
              </section>

              {/* Eligible Refunds */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  2. Eligible Refunds
                </h2>
                <div className="space-y-6">
                  <div className="bg-emerald-900/20 border border-emerald-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-emerald-400 mb-3">
                      ✅ Refunds Available For:
                    </h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                      <li>
                        <strong>Order Cancellations:</strong> Full refund for
                        orders cancelled within 48 hours of placement
                      </li>
                      <li>
                        <strong>Duplicate Payments:</strong> Refund for
                        accidental duplicate transactions
                      </li>
                      <li>
                        <strong>Failed Deliveries:</strong> Refund if order
                        cannot be delivered due to technical issues
                      </li>
                      <li>
                        <strong>Incorrect Charges:</strong> Refund for billing
                        errors or incorrect amounts charged
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Non-Refundable */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  3. Non-Refundable Items
                </h2>
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-red-400 mb-3">
                    ❌ No Refunds For:
                  </h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li>Orders cancelled after 48 hours of placement</li>
                    <li>
                      Digital content that has been accessed, downloaded, or
                      delivered
                    </li>
                    <li>Change of mind after purchase</li>
                    <li>Products that have been partially used or accessed</li>
                    <li>
                      Orders where delivery was successful and content was
                      accessible
                    </li>
                  </ul>
                </div>
              </section>

              {/* Refund Process */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  4. Refund Process
                </h2>
                <div className="bg-gray-700/50 rounded-lg p-6 mb-4">
                  <ol className="list-decimal list-inside text-gray-300 space-y-3 ml-4">
                    <li className="pb-2">
                      <strong>Request Submission:</strong> Submit refund request
                      through your account or via email
                    </li>
                    <li className="pb-2">
                      <strong>Verification:</strong> We verify eligibility based
                      on our policy terms
                    </li>
                    <li className="pb-2">
                      <strong>Approval:</strong> Eligible refunds are approved
                      within 24-48 hours
                    </li>
                    <li className="pb-2">
                      <strong>Processing:</strong> Refund is processed to your
                      original payment method
                    </li>
                    <li>
                      <strong>Completion:</strong> Refund appears in your
                      account within 5-10 business days
                    </li>
                  </ol>
                </div>
              </section>

              {/* Refund Timeline */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  5. Refund Timeline
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                    <div className="text-emerald-400 font-bold text-lg">
                      24-48 Hours
                    </div>
                    <div className="text-gray-300 text-sm">
                      Request Verification
                    </div>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                    <div className="text-emerald-400 font-bold text-lg">
                      1-2 Days
                    </div>
                    <div className="text-gray-300 text-sm">
                      Refund Processing
                    </div>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                    <div className="text-emerald-400 font-bold text-lg">
                      5-10 Days
                    </div>
                    <div className="text-gray-300 text-sm">Bank Processing</div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  Note: The time it takes for the refund to reflect in your
                  account depends on your bank or payment provider.
                </p>
              </section>

              {/* Payment Methods */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  6. Refund Methods
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Refunds are issued to the original payment method used during
                  purchase:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>
                    <strong>Credit/Debit Cards:</strong> Refunded to the same
                    card (5-10 business days)
                  </li>
                  <li>
                    <strong>UPI Payments:</strong> Refunded to the same UPI ID
                    (3-5 business days)
                  </li>
                  <li>
                    <strong>Net Banking:</strong> Refunded to the same bank
                    account (5-7 business days)
                  </li>
                  <li>
                    <strong>Digital Wallets:</strong> Refunded to the same
                    wallet (2-3 business days)
                  </li>
                </ul>
              </section>

              {/* Partial Refunds */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  7. Partial Refunds
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  In certain circumstances, partial refunds may be issued:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mt-2">
                  <li>
                    Bundled products where only part of the content is
                    undeliverable
                  </li>
                  <li>Promotional pricing errors</li>
                  <li>Partial order cancellations (if applicable)</li>
                </ul>
              </section>

              {/* Technical Issues */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  8. Technical Issues & Refunds
                </h2>
                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-blue-400 mb-3">
                    Technical Support First
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Before requesting a refund for technical issues:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li>Contact our support team for troubleshooting</li>
                    <li>Allow us to resolve access or download issues</li>
                    <li>We may provide alternative formats or solutions</li>
                    <li>
                      Refund is considered only if issue cannot be resolved
                    </li>
                  </ul>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  9. Refund Requests
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  To request a refund or for refund-related inquiries:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mt-2">
                  <li>Email: support@crazydealsonline.in</li>
                  <li>Subject: "Refund Request - [Your Order Number]"</li>
                  <li>
                    Include: Order number, purchase date, and reason for refund
                  </li>
                  <li>Response time: Within 24 hours</li>
                </ul>
              </section>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">
            Important Refund Notes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-900/20 p-4 rounded-lg border border-emerald-800">
              <h4 className="font-semibold text-emerald-400 mb-2">
                Refund Rights
              </h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• 48-hour cancellation window</li>
                <li>• Full refund for eligible requests</li>
                <li>• Original payment method refund</li>
                <li>• Transparent processing timeline</li>
              </ul>
            </div>
            <div className="bg-amber-900/20 p-4 rounded-lg border border-amber-800">
              <h4 className="font-semibold text-amber-400 mb-2">Please Note</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Bank processing times may vary</li>
                <li>• Provide correct order details</li>
                <li>• Contact support for urgent issues</li>
                <li>• Keep payment receipts handy</li>
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
              to="/terms-and-conditions"
              className="hover:text-cyan-400 transition-colors"
            >
              Terms and Conditions
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

export default RefundPolicy;
