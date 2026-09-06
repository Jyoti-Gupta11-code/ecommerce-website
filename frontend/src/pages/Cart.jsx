import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";

const Cart = () => {

  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  // Convert cartItems object into array
  useEffect(() => {
    if (products.length > 0){
          const tempData = [];

    for (const items in cartItems) {
      for (const item in cartItems[items]) {

        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item]
          });
        }

      }
    }

    setCartData(tempData);

    }



  }, [cartItems,products]);

  return (
    <div className="border-t pt-14">

      {/* Page Title */}
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      {/* Cart Items */}
      {cartData.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl font-medium text-gray-700 mb-2">Your cart is empty</p>
          <p className="text-sm text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <button
            onClick={() => navigate("/collection")}
            className="bg-black text-white text-xs sm:text-sm px-8 py-3 hover:bg-gray-800 transition-colors uppercase tracking-wider"
          >
            Explore Collection
          </button>
        </div>
      ) : (
        <>
          <div>
            {cartData.map((item, index) => {

              const productData = products.find(
                (product) => product._id.toString() === item._id.toString()
              );

              // Safety check
              if (!productData) return null;

              return (
                <div
                  key={index}
                  className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_1fr_1fr]"
                >

                  {/* Product Info */}
                  <div className="flex items-start gap-6">

                    <img
                      className="w-16 sm:w-20"
                      src={productData?.image?.[0]}
                      alt={productData.name}
                    />

                    <div>
                      <p className="text-xs sm:text-lg font-medium">
                        {productData.name}
                      </p>

                      <div className="flex items-center gap-5 mt-2">
                        <p>{currency}{productData.price}</p>

                        <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                          {item.size}
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Quantity Input */}
                  <div className="flex items-center">
                    <input
                      className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => {
                        const value = e.target.value;

                        if (value === "" || Number(value) <= 0) return;

                        updateQuantity(item._id, item.size, Number(value));
                      }}
                    />
                  </div>

                  {/* Delete Button */}
                  <div className="flex items-center justify-end">
                    <img
                      onClick={() => updateQuantity(item._id, item.size, 0)}
                      className="w-4 mr-4 sm:w-5 cursor-pointer"
                      src={assets.bin_icon}
                      alt="delete"
                    />
                  </div>

                </div>
              );
            })}
          </div>

          {/* Cart Total Section */}
          <div className="flex justify-end my-20">
            <div className="w-full sm:w-[410px]">
              <CartTotal />

              <div className="w-full text-end">
                <button
                  onClick={() => navigate("/place-order")}
                  className="bg-black text-white text-sm my-8 px-8 py-3"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>

            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default Cart;