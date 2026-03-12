import React, { createContext, useState } from "react";
import { products } from "../assets/assets";

// 1️⃣ Create Context
export const ShopContext = createContext();

// 2️⃣ Create Provider Component
const ShopContextProvider = (props) => {

  const currency = "$";
  const delivery_fee = 10;
  const [search ,setSearch] = useState('');
  const[showSearch , setShowSearch] = useState(false)

  // 3️⃣ Global value object
  const value = {
    products,
    currency,
    delivery_fee ,
    search , setSearch , showSearch , setShowSearch
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
