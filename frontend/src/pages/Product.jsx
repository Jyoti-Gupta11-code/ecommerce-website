import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

// ✅ ADD THIS
import { toast } from "react-toastify";

const Product = () => {

  const { id } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);

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

      // ✅ ERROR TOAST
      toast.error("Please select a size");

      return;
    }

    setError("");

    addToCart(productData._id, size);

    // ✅ SUCCESS TOAST (alert remove)
    toast.success("Item added to cart");
  };

  return productData ? (
    <div className="pt-10">

      <div className="flex gap-12 sm:flex-row flex-col">

        {/* Images */}
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

        {/* Info */}
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

          {/* Size */}
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

          {/* Button */}
          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            ADD TO CART
          </button>

        </div>

      </div>

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