import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { HiOutlinePencilSquare,HiArrowLeftOnRectangle } from "react-icons/hi2";
import { AiFillHome } from "react-icons/ai";
const Nav = () => {
    const { data: session } = useSession()
    console.log(session)
  return (

    <div className="bg-gray-900 text-white">
      <div className="container mx-auto py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">HIJAZI-STORES</h1>
        <ul className="flex space-x-4">
          <li>
            <a href="/" className="flex items-center text-white hover:text-gray-300">
              <span className="hidden sm:block">HOME</span> {/* Visible on small screens and above */}
              <span className="sm:hidden"><AiFillHome className="inline-block" /></span> {/* Hidden on small screens */}
            </a>
          </li>
          {!session ? (
  <li><a href="/Orders" className="hover:text-gray-300">My Orders</a></li>
) : (
  <li><a href="/Orderswehave" className="hover:text-gray-300">*Orders We Have*</a></li>
)}
          {!session ? (
            <button className='bg-white text-gray-500 p-1 px-3 text-[12px] border-[1px] rounded-full' onClick={() => signIn()}>
              <span className='hidden sm:block'>SIGN IN</span>
              <HiArrowLeftOnRectangle className='sm:hidden text-[17px]' />
            </button>
          ) : (
            <button className='bg-white text-gray-500 p-1 px-3 text-[12px] border-[1px] rounded-full' onClick={() => signOut()}>
              <span className='hidden sm:block'>SIGN OUT</span>
              <HiArrowLeftOnRectangle className='sm:hidden text-[17px]' />
            </button>
          )}
          {session && session.user.name === "Xox Xox" && (
            <li><a href="/Additem" className="hover:text-gray-300">ADD ITEMS</a></li>
          )}
        </ul>
      </div>
      {/* Secondary navigation for TABLETS, PHONES, LAPTOPS, ACCESSORIES */}
      <div className="container mx-auto py-2 border-t border-gray-600">
        <ul className="flex space-x-4 justify-center">
          <li><a href="/Tablet" className="hover:text-gray-300">TABLETS</a></li>
          <li><a href="/Phones" className="hover:text-gray-300">PHONES</a></li>
          <li><a href="/Laptop" className="hover:text-gray-300">LAPTOPS</a></li>
          <li><a href="/Accessories" className="hover:text-gray-300">ACCESSORIES</a></li>
        </ul>
      </div>
    </div>


  )
}

export default Nav
