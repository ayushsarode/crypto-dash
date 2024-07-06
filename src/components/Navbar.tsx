import Link from "next/link";
import React, { useContext } from "react";
Link;
import { FaUserPlus } from "react-icons/fa";


const Navbar = () => {



  return (
    
    <div className="navbar  shadow-[0_1px_0_0_rgba(255,255,255,0.4)] border-white">
      
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content border-[1.px] rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link href={"#"}>Home</Link>
            </li>

            <li>
              <Link href={"#"}>Features</Link>
            </li>

            <li>
              <Link href={"#"}>Pricing</Link>
            </li>
            <li>
              <Link href={"#"}>Blog</Link>
            </li>
          </ul>
        </div>
        <Link href={"#"} className="btn btn-ghost text-[1.5rem]">
          CryptoDash
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1  text-[1.1rem]">
          <li>
            <Link href={"/home"}>Home</Link>
          </li>

          <li>
            <Link href={"#"}>Features</Link>
          </li>

          <li>
            <Link href={"#"}>Pricing</Link>
          </li>
          <li>
            <Link href={"#"}>Blog</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end ">
        <ul className="menu menu-horizontal gap-4 px-1 items-center text-[1.1rem] bg-none">
          <li className="">
            <select className="text-center">
              <option value="inr" className="">
                INR
              </option>
              <option value="usd" className="">
                USD
              </option>
            </select> 
          </li>
          <li>
            <Link
              href={"#"}
              className="btn rounded-full px-6 bg-white text-black text-[1rem] hover:bg-white "
            >
              Sign Up <FaUserPlus />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;