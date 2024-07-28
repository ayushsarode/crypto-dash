"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { HiTrendingUp } from "react-icons/hi";
import { FaHome } from "react-icons/fa";
import { FaNewspaper } from "react-icons/fa6";
import { RiCopperCoinFill } from "react-icons/ri";
import { MdOutlineCurrencyExchange } from "react-icons/md";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { user, getUser } = useKindeBrowserClient();
  const alsoUser = getUser();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLinkClick = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div
      className={`navbar  shadow-[0_1px_0_0_rgba(255,255,255,0.3)] border-white ${
        isScrolled ? "backdrop-blur-lg" : ""
      } sticky top-0 z-50`}
    >
      <div className="navbar-start">
        <div className="dropdown ">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost  lg:hidden"
            onClick={handleDropdownToggle}
          >
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
            className={`menu menu-sm dropdown-content h-[20rem] p-8 bg-black border-[1px] rounded-box z-[1] mt-8 mx-auto w-[25rem] shadow-lg ${
              isDropdownOpen ? "" : "hidden"
            }`}
          >
            <li className="text-lg ">
              <Link
                href={"/"}
                onClick={handleLinkClick}
                className="text-lg p-2 "
              >
                <FaHome /> Home
              </Link>
            </li>
            <li>
              <Link
                href={"/trending"}
                onClick={handleLinkClick}
                className="text-lg p-2 "
              >
                Trending
              </Link>
            </li>

            <li>
              <Link
                href={"/currency-converter"}
                onClick={handleLinkClick}
                className="text-lg p-2 "
              >
                <MdOutlineCurrencyExchange /> ConvertCurrency
              </Link>
            </li>
          </ul>
        </div>
        <Link
          href={"/"}
          className="btn btn-ghost text-[1.5rem] font-extralight text-white"
        >
          <RiCopperCoinFill className="text-4xl" />
          coindash.
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-[1.1rem] text-white">
          <li>
            <Link href={"/"}>
              <FaHome />
              Home
            </Link>
          </li>
          <li>
            <Link href={"/trending"}>
              <HiTrendingUp className="font-extra-bold text-xl" /> Trending
            </Link>
          </li>

          <li>
            <Link href={"/currency-converter"}>
              <MdOutlineCurrencyExchange />
              ConvertCurrency
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <ul className="menu menu-horizontal gap-4 px-1 items-center text-[1.1rem] bg-none">
        <li>
      {user ? (
        <span className="text-white">{user.given_name} {user.family_name} <span className="text-white text-3xl"><FaUserCircle /></span></span> 
      ) : (

        <LoginLink className="btn rounded-full px-5 bg-white text-black text-[1rem] hover:bg-white">
          Sign in <FaUserPlus />
        </LoginLink>
      )}
    </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
