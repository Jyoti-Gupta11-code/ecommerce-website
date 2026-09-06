
import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({ }) => {

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Men")
  const [subCategory, setSubCategory] = useState("Topwear")
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])

  // Submit Handler
  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData()

      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)
      formData.append("sizes", JSON.stringify(sizes))

      image1 && formData.append("image1", image1)
      image2 && formData.append("image2", image2)
      image3 && formData.append("image3", image3)
      image4 && formData.append("image4", image4)

     const response = await axios.post(
  backendUrl + "/api/product/add",
  formData,
  {
    headers: {
      token: localStorage.getItem("token")
    }
  }
)

      if (response.data.success) {
        toast.success(response.data.message)

        setName("")
        setDescription("")
        setPrice("")
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setSizes([])
        setBestseller(false)
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <form 
      onSubmit={onSubmitHandler}
      className='flex flex-col w-full items-start gap-3'
    >

      {/* Upload Images */}
      <div>
        <p className='mb-2'>Upload Image</p>

        <div className='flex gap-2'>
          {[image1, image2, image3, image4].map((img, index) => (
            <label key={index} htmlFor={`image${index}`}>
              <img 
                className='w-20'
                src={!img ? assets.upload_area : URL.createObjectURL(img)} 
                alt="" 
              />
              <input 
                type="file"
                id={`image${index}`}
                hidden
                onChange={(e) => {
                  const file = e.target.files[0]
                  if (index === 0) setImage1(file)
                  if (index === 1) setImage2(file)
                  if (index === 2) setImage3(file)
                  if (index === 3) setImage4(file)
                }}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Product Name */}
      <div className='w-full'>
        <p className='mb-2'>Product name</p>
        <input 
          className='w-full max-w-[500px] px-3 py-2 border'
          type="text"
          placeholder='Type here'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Description */}
      <div className='w-full'>
        <p className='mb-2'>Product description</p>
        <textarea 
          className='w-full max-w-[500px] px-3 py-2 border'
          placeholder='Write content here'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      {/* Category Section */}
      <div className='flex flex-wrap gap-4'>

        <div>
          <p className='mb-2'>Category</p>
          <select 
            className='px-3 py-2 border'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Sub Category</p>
          <select 
            className='px-3 py-2 border'
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Price (₹)</p>
          <input 
            className='px-3 py-2 border'
            type="number"
            placeholder='799'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

      </div>

      {/* Sizes */}
      <div>
        <p className='mb-2'>Product Sizes</p>

        <div className='flex gap-3'>

          <p
            onClick={() =>
              setSizes(prev =>
                prev.includes("S")
                  ? prev.filter(item => item !== "S")
                  : [...prev, "S"]
              )
            }
            className={`${sizes.includes("S") ? 'bg-pink-100' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}
          >
            S
          </p>

          <p
            onClick={() =>
              setSizes(prev =>
                prev.includes("M")
                  ? prev.filter(item => item !== "M")
                  : [...prev, "M"]
              )
            }
            className={`${sizes.includes("M") ? 'bg-pink-100' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}
          >
            M
          </p>

          <p
            onClick={() =>
              setSizes(prev =>
                prev.includes("L")
                  ? prev.filter(item => item !== "L")
                  : [...prev, "L"]
              )
            }
            className={`${sizes.includes("L") ? 'bg-pink-100' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}
          >
            L
          </p>

          <p
            onClick={() =>
              setSizes(prev =>
                prev.includes("XL")
                  ? prev.filter(item => item !== "XL")
                  : [...prev, "XL"]
              )
            }
            className={`${sizes.includes("XL") ? 'bg-pink-100' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}
          >
            XL
          </p>

          <p
            onClick={() =>
              setSizes(prev =>
                prev.includes("XXL")
                  ? prev.filter(item => item !== "XXL")
                  : [...prev, "XXL"]
              )
            }
            className={`${sizes.includes("XXL") ? 'bg-pink-100' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}
          >
            XXL
          </p>

        </div>
      </div>

      {/* Bestseller */}
      <div className='flex gap-2 mt-2'>
        <input 
          type="checkbox"
          id="bestseller"
          checked={bestseller}
          onChange={() => setBestseller(prev => !prev)}
        />
        <label htmlFor="bestseller" className='cursor-pointer'>
          Add to Bestseller
        </label>
      </div>

      {/* Submit */}
      <button 
        type="submit"
        className='w-28 py-3 mt-4 bg-black text-white'
      >
        ADD
      </button>

    </form>
  )
}

export default Add

