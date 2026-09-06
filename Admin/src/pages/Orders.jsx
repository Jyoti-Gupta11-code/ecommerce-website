import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {
    if (!token) return null

    try {
      const response = await axios.post(
        backendUrl + '/api/order/list',
        {},
        { headers: { token } }
      )
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: event.target.value },
        { headers: { token } }
      )
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  return (
    <div className='px-4 sm:px-8 py-6'>
      <h3 className='text-xl font-medium mb-4'>Order Page</h3>
      <div>
        {orders.map((order, index) => (
          <div
            key={index}
            className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-4 items-start border border-gray-200 rounded-md p-5 my-4 text-sm text-gray-700 bg-white shadow-sm'
          >
            {/* Parcel Icon */}
            <img src={assets.parcel_icon} alt="" className='w-14' />

            {/* Items + Address */}
            <div>
              <div className='mb-2'>
                {order.items.map((item, idx) => {
                  if (idx === order.items.length - 1) {
                    return (
                      <p key={idx} className='py-0.5'>
                        {item.name} x {item.quantity} <span className='italic'>{item.size}</span>
                      </p>
                    )
                  } else {
                    return (
                      <p key={idx} className='py-0.5'>
                        {item.name} x {item.quantity} <span className='italic'>{item.size}</span> ,
                      </p>
                    )
                  }
                })}
              </div>

              {/* Customer Name */}
              <p className='font-semibold mt-3 mb-1'>
                {order.address.firstName + ' ' + order.address.lastName}
              </p>

              {/* Address */}
              <div className='text-gray-500 text-xs leading-5'>
                <p>{order.address.street + ','}</p>
                <p>
                  {order.address.city + ', ' +
                    order.address.state + ', ' +
                    order.address.country + ', ' +
                    order.address.zipcode}
                </p>
              </div>

              {/* Phone */}
              <p className='text-xs text-gray-500 mt-1'>{order.address.phone}</p>
            </div>

            {/* Order Meta */}
            <div className='text-sm'>
              <p className='text-sm sm:text-[15px]'>Items : {order.items.length}</p>
              <p className='mt-3'>Method : {order.paymentMethod}</p>
              <p>Payment : {order.payment ? 'Done' : 'Pending'}</p>
              <p>Date : {new Date(order.date).toLocaleDateString()}</p>
            </div>

            {/* Amount */}
            <p className='text-sm sm:text-[15px] font-medium'>
              {currency}{order.amount}
            </p>

            {/* Status Dropdown */}
            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              className='p-2 font-semibold border border-gray-300 rounded text-sm w-full'
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>

          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders