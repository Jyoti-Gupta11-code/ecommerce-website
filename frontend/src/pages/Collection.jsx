import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {

  const { products, search ,showSearch } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevent')


  // CATEGORY TOGGLE
  const toggleCategory = (e) => {

    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value));
    } 
    else {
      setCategory(prev => [...prev, e.target.value]);
    }

  };

  // SUBCATEGORY TOGGLE
  const toggleSubCategory = (e) => {

    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev =>
        prev.filter(item => item !== e.target.value)
      );
    } 
    else {
      setSubCategory(prev => [
        ...prev,
        e.target.value
      ]);
    }

  };

  // APPLY FILTER
  const applyFilter = () => {

    let productsCopy = products.slice();
    if(showSearch && search){
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    // Category Filter
    if (category.length > 0) {
      productsCopy = productsCopy.filter(item =>
        category.includes(item.category)
      );
    }

    // SubCategory Filter
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item =>
        subCategory.includes(item.subCategory)
      );
    }

    setFilterProducts(productsCopy);
  };

 const sortProduct = () => {

  let fpCopy = filterProducts.slice();

  switch (sortType) {
    case 'low-high':
      setFilterProducts(fpCopy.sort((a,b)=>(a.price - b.price)));
      break;

    case 'high-low':
      setFilterProducts(fpCopy.sort((a,b)=>(b.price - a.price)));
      break;

    default:
      applyFilter();
      break;
  }
}

  // FILTER CHANGE
  useEffect(() => {
    applyFilter();
  }, [category, subCategory,search,showSearch]);

  useEffect(()=>{
    sortProduct()
  }, [sortType])



  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">

      {/* FILTER OPTIONS */}
      <div className="min-w-60">

        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS

          <img
            src={assets.dropdown_icon}
            alt=""
            className={`h-2 transition-transform ${showFilter ? "rotate-90" : ""}`}
          />

        </p>


        {/* CATEGORY */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"}`}>

          <p className="mb-3 text-sm font-medium">CATEGORIES</p>

          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">

            <label className="flex gap-2">
              <input type="checkbox" value="Men" onChange={toggleCategory}/>
              Men
            </label>

            <label className="flex gap-2">
              <input type="checkbox" value="Women" onChange={toggleCategory}/>
              Women
            </label>

            <label className="flex gap-2">
              <input type="checkbox" value="Kids" onChange={toggleCategory}/>
              Kids
            </label>

          </div>

        </div>


        {/* TYPE */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"}`}>

          <p className="mb-3 text-sm font-medium">TYPE</p>

          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">

            <label className="flex gap-2">
              <input type="checkbox" value="Topwear" onChange={toggleSubCategory}/>
              Topwear
            </label>

            <label className="flex gap-2">
              <input type="checkbox" value="Bottomwear" onChange={toggleSubCategory}/>
              Bottomwear
            </label>

            <label className="flex gap-2">
              <input type="checkbox" value="Winterwear" onChange={toggleSubCategory}/>
              Winterwear
            </label>

          </div>

        </div>

      </div>


      {/* RIGHT SIDE */}
      <div className="flex-1">

        <div className="flex justify-between text-base sm:text-2xl mb-4">

          <Title text1={"ALL"} text2={"COLLECTIONS"} />

          <select  onChange ={(e) =>setSortType(e.target.value)}className="border-2 border-gray-300 text-sm px-2">

            <option value="relavent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>

          </select>

        </div>


        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">

          {filterProducts.map((item, index) => (

            <ProductItem
              key={index}
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.image}
            />

          ))}

        </div>

      </div>

    </div>
  );
};

export default Collection;


