import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-gray-100 mt-20">

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">

          {/* LEFT SECTION */}
          <div>
            <h1 className="text-2xl font-bold mb-5">
              FOREVER<span className="text-pink-500">.</span>
            </h1>
            <p className="text-gray-600 text-sm leading-6">
              Forever is your destination for timeless fashion and contemporary style.
              We craft premium-quality apparel designed for everyday comfort, confidence,
              and modern living.
            </p>
          </div>

          {/* COMPANY */}
          <div>
            <p className="text-lg font-semibold mb-5">COMPANY</p>
            <ul className="flex flex-col gap-2 text-gray-600 text-sm">
              <li><Link to="/" onClick={() => window.scrollTo(0,0)} className="hover:text-black">Home</Link></li>
              <li><Link to="/collection" onClick={() => window.scrollTo(0,0)} className="hover:text-black">Collection</Link></li>
              <li><Link to="/about" onClick={() => window.scrollTo(0,0)} className="hover:text-black">About us</Link></li>
              <li><Link to="/contact" onClick={() => window.scrollTo(0,0)} className="hover:text-black">Contact</Link></li>
            </ul>
          </div>

          {/* GET IN TOUCH */}
          <div>
            <p className="text-lg font-semibold mb-5">GET IN TOUCH</p>
            <ul className="flex flex-col gap-2 text-gray-600 text-sm">
              <li>+1-212-456-7890</li>
              <li>contact@foreveryou.com</li>
            </ul>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="mt-10">
          <hr />
          <p className="py-5 text-sm text-center text-gray-500">
            Copyright 2026 © forever.com - All Rights Reserved.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Footer;




