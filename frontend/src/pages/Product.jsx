import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {

  const { id } = useParams();
  const { products, currency } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const product = products.find((item) => item._id === id);

    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  }, [id, products]);

  const handleAddToCart = () => {
    if (!size) {
      setError("Please select a size");
      return;
    }

    setError("");
    alert("Item added to cart");
  };

  return productData ? (
    <div className="pt-10">

      {/* ================= Product Section ================= */}
      <div className="flex gap-12 sm:flex-row flex-col">

        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">

          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-scroll sm:w-[20%] w-full">
            {productData.image.map((item, index) => (
              <img
                key={index}
                src={item}
                onClick={() => setImage(item)}
                className="w-[24%] sm:w-full cursor-pointer border hover:border-black"
                alt=""
              />
            ))}
          </div>

          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>

        </div>

        {/* Product Info */}
        <div className="flex-1">

          <h1 className="font-medium text-2xl mt-2">
            {productData.name}
          </h1>

          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_dull_icon} alt="" className="w-3.5" />
            <p className="pl-2">(122)</p>
          </div>

          <p className="mt-5 text-3xl font-medium">
            {currency}{productData.price}
          </p>

          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>

          {/* Size Selection */}
          <div className="flex flex-col gap-4 my-8">
            <p className="font-medium">Select Size</p>

            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  key={index}
                  className={`border py-2 px-4 transition-all duration-200 ${
                    item === size
                      ? "bg-black text-white border-orange-500"
                      : "bg-gray-100 hover:border-black"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            ADD TO CART
          </button>

          <hr className="mt-8 sm:w-4/5" />

          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>

        </div>
      </div>

      {/* ================= Description & Review Section ================= */}

      <div className="mt-20">

        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>

        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            An e-commerce website is an online platform that facilitates the buying and selling of products.
          </p>
          <p>
            E-commerce websites typically display products or services along with detailed descriptions,
            prices, images and allow customers to purchase them online.
          </p>
        </div>

      </div>

      {/* ================= Related Products ================= */}

      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />

    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
      