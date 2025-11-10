import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  Award,
  Heart,
  Shield,
  Truck,
  Clock,
  Star,
} from "lucide-react";

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { number: "10K+", label: "Happy Customers", icon: Users },
    { number: "50K+", label: "Books Available", icon: BookOpen },
    { number: "95%", label: "Positive Reviews", icon: Star },
    { number: "24/7", label: "Customer Support", icon: Clock },
  ];

  const values = [
    {
      icon: Shield,
      title: "Trust & Quality",
      description:
        "Every book is carefully selected and verified for quality before reaching our customers.",
    },
    {
      icon: Heart,
      title: "Customer First",
      description:
        "Your reading experience is our top priority. We listen and adapt to your needs.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description:
        "Get your books delivered quickly with our efficient shipping partners.",
    },
    {
      icon: Award,
      title: "Best Prices",
      description:
        "We work directly with publishers to bring you the most competitive prices.",
    },
  ];

  // const team = [
  //   {
  //     name: "Sarah Johnson",
  //     role: "Founder & CEO",
  //     image:
  //       "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
  //     description:
  //       "Passionate book lover with 10+ years in publishing industry.",
  //   },
  //   {
  //     name: "Michael Chen",
  //     role: "Head of Operations",
  //     image:
  //       "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
  //     description: "Ensures smooth operations and customer satisfaction.",
  //   },
  //   {
  //     name: "Emily Rodriguez",
  //     role: "Content Curator",
  //     image:
  //       "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
  //     description:
  //       "Literature expert who handpicks the best books for our collection.",
  //   },
  //   {
  //     name: "David Kim",
  //     role: "Customer Experience",
  //     image:
  //       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
  //     description:
  //       "Dedicated to making every customer interaction exceptional.",
  //   },
  // ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div
          className={`relative max-w-7xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About Crazy Deals Online
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Your trusted partner in discovering amazing book deals and literary
            adventures
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Shopping
            </Link>
            <button
              className="border-2 border-white text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:bg-opacity-20 transition-all duration-300"
              onClick={() =>
                document
                  .getElementById("our-story")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Our Story
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="our-story" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Crazy Deals Online was born from a simple yet powerful idea:
                everyone deserves access to amazing books at incredible prices.
                What started as a small online bookstore in 2020 has grown into
                a beloved destination for book lovers across the country.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Our founder noticed that while people loved reading, the high
                cost of books often limited their literary adventures. She
                envisioned a platform where readers could discover new worlds
                without breaking the bank.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Today, we're proud to serve thousands of readers, offering
                carefully curated collections across all genres while
                maintaining our commitment to affordability and quality.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl p-8 text-white h-80 flex items-center justify-center">
                <div className="text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-2xl font-bold italic">
                    "Where every book is an adventure, and every deal is crazy
                    good!"
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-yellow-400 rounded-2xl p-6 w-64 h-64 flex items-center justify-center transform rotate-12 z-10">
                <div className="text-center transform -rotate-12">
                  <div className="text-3xl font-bold text-gray-900">
                    50% OFF
                  </div>
                  <div className="text-gray-700 font-medium">
                    On Best Sellers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at CrazyDealsOnline
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate book lovers behind Crazy Deals Online
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
                />
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg opacity-90 leading-relaxed">
                To make reading accessible and affordable for everyone by
                providing incredible deals on quality books while fostering a
                love for literature and lifelong learning.
              </p>
            </div>
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-lg opacity-90 leading-relaxed">
                To become the most trusted and loved online bookstore, where
                readers of all ages can discover their next favorite book and
                join a vibrant community of book enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Reading Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of happy readers and discover amazing deals on your
            next favorite book.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Explore Books
            </Link>
            <Link
              to="/contact-us"
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            CrazyDealsOnline Bookstore
          </h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Your one-stop destination for amazing book deals and literary
            adventures. Where every page begins a new journey.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 text-sm text-gray-400">
            <span>© {new Date().getFullYear()} CrazyDealsOnline</span>
            <span className="hidden sm:inline">•</span>
            <Link
              to="/privacy-policy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link
              to="/contact-us"
              className="hover:text-white transition-colors"
            >
              Contact Us
            </Link>
          </div>
          <div className="mt-6">
            <p className="text-gray-500 text-sm">
              Made with <span className="text-red-500">❤</span> for the reading
              community
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
