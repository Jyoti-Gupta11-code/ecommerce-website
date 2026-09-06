import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row border border-gray-400'>
      
      {/* Hero Left Side */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
        <div className='text-[#414141] px-4 sm:px-0'>

          <div className='flex items-center gap-2'>
            <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
            <p className='font-medium text-sm md:text-base tracking-wide'>NEW SEASON COLLECTION</p>
          </div>

          <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>
            Latest Arrivals
          </h1>

          <p className='text-gray-600 text-xs sm:text-sm max-w-md mb-4'>
            Discover the latest styles designed for your everyday look.
          </p>

          <Link to='/collection' className='flex items-center gap-2 cursor-pointer w-fit group'>
            <p className='font-semibold text-sm md:text-base group-hover:underline'>SHOP NOW</p>
            <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>
          </Link>

        </div>
      </div>
       {/* Hero Right Side */}
<img
  className="w-full sm:w-1/2"
  src={assets.hero_img}
  alt="Hero Image"
/>

    </div>
  )
}

export default Hero

