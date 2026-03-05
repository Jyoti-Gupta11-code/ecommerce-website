import React from "react";

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
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
          </div>

          {/* COMPANY */}
          <div>
            <p className="text-lg font-semibold mb-5">COMPANY</p>
            <ul className="flex flex-col gap-2 text-gray-600 text-sm">
              <li className="hover:text-black cursor-pointer">Home</li>
              <li className="hover:text-black cursor-pointer">About us</li>
              <li className="hover:text-black cursor-pointer">Delivery</li>
              <li className="hover:text-black cursor-pointer">Privacy policy</li>
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
            Copyright 2024 © forever.com - All Rights Reserved.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Footer;




