import React, { useState } from 'react'

const NewsletterBox = () => {

  // State to store email input
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  // Form submit handler
  const onSubmitHandler = (event) => {
    event.preventDefault()

    if (email === '') {
      setMessage('Please enter your email')
      return
    }

    // Here you can send email to backend later
    console.log("Submitted Email:", email)

    setMessage('Subscribed successfully! 🎉')
    setEmail('') // clear input after submit
  }

  return (
    <div className='text-center py-10'>
      
      <p className='text-2xl font-medium text-gray-800'>
        Subscribe now & get 20% off
      </p>

      <p className='text-gray-400 mt-3'>
        Enter your email to get latest updates and offers.
      </p>

      <form 
        onSubmit={onSubmitHandler} 
        className='w-full sm:w-1/2 flex items-center gap-3 mx-auto mt-6'
      >
        <input
          className='w-full sm:flex-1 outline-none border border-gray-300 px-4 py-2'
          type="email"
          placeholder='Enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type='submit'
          className='bg-black text-white text-xs px-8 py-2'
        >
          SUBSCRIBE
        </button>
      </form>

      {message && (
        <p className='mt-4 text-green-600 font-medium'>
          {message}
        </p>
      )}

    </div>
  )
}

export default NewsletterBox

