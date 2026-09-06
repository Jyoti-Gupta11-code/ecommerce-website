import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {

  const { products, search ,showSearch } = useContext(ShopContext);

  const [searchParams] = useSearchParams();

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevent');
  const [voiceQuery, setVoiceQuery] = useState('');
  const [priceMin, setPriceMin] = useState(null);
  const [priceMax, setPriceMax] = useState(null);

  // Read URL search params set by Voice Assistant
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlSubCategory = searchParams.get('subCategory');
    const urlQuery = searchParams.get('query');
    const urlPriceMin = searchParams.get('priceMin');
    const urlPriceMax = searchParams.get('priceMax');
    const urlSort = searchParams.get('sort');

    if (urlCategory) setCategory([urlCategory]); else setCategory([]);
    if (urlSubCategory) setSubCategory([urlSubCategory]); else setSubCategory([]);
    setVoiceQuery(urlQuery || '');
    setPriceMin(urlPriceMin ? Number(urlPriceMin) : null);
    setPriceMax(urlPriceMax ? Number(urlPriceMax) : null);
    if (urlSort) setSortType(urlSort);
  }, [searchParams]);


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

    // Existing manual search
    if(showSearch && search){
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    // Voice search query (from URL params)
    if (voiceQuery) {
      const normalize = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
      const queryTokens = normalize(voiceQuery).split(' ')
        .map(w => w.endsWith('s') ? w.slice(0, -1) : w)
        .filter(w => w.length > 1 || w === 't'); // Keep meaningful tokens
        
      if (queryTokens.length > 0) {
        productsCopy = productsCopy.filter(item => {
          const itemStr = normalize(item.name + ' ' + item.description);
          const itemTokens = itemStr.split(' ').map(w => w.endsWith('s') ? w.slice(0, -1) : w);
          
          let matchCount = 0;
          queryTokens.forEach(qt => {
            if (itemTokens.includes(qt) || itemStr.includes(qt)) {
              matchCount++;
            }
          });
          
          // Match if at least 50% of the query keywords are found in the product
          return matchCount / queryTokens.length >= 0.5;
        });
      }
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

    // Price range filter (from URL params)
    if (priceMin != null) {
      productsCopy = productsCopy.filter(item => item.price >= priceMin);
    }
    if (priceMax != null) {
      productsCopy = productsCopy.filter(item => item.price <= priceMax);
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
  }, [category, subCategory, search, showSearch, products, voiceQuery, priceMin, priceMax] );

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

          {filterProducts.length > 0 ? (
            filterProducts.map((item, index) => (

              <ProductItem
                key={index}
                id={item._id}
                name={item.name}
                price={item.price}
                image={item.image}
              />

            ))
          ) : (
            <div className="col-span-full py-16 text-center text-gray-500">
              <p className="text-xl font-medium text-gray-700 mb-2">No products found</p>
              <p className="text-sm text-gray-500">Try adjusting your filters or search keywords to find what you're looking for.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Collection;


