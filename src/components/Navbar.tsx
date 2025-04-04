"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { HiTrendingUp } from "react-icons/hi";
import { FaHome } from "react-icons/fa";
import { RiCopperCoinFill } from "react-icons/ri";
import { MdOutlineCurrencyExchange } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

const Navbar = ({ user }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className={`fixed border-b w-full z-50 ${isScrolled ? 'bg-gray-900 backdrop-blur-md' : 'bg-gray-900'} transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <RiCopperCoinFill className="text-white text-2xl mr-1" />
              <span className="text-white text-xl font-light">coindash<span className="text-white">.</span></span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-1 text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                <FaHome className="text-sm" />
                <span>Home</span>
              </Link>
              
              <Link href="/trending" className="flex items-center space-x-1 text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                <HiTrendingUp className="text-sm" />
                <span>Trending</span>
              </Link>

              <Link href="/currency-converter" className="flex items-center space-x-1 text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                <MdOutlineCurrencyExchange className="text-sm" />
                <span>ConvertCurrency</span>
              </Link>

              <Link href="/news-feed" className="flex items-center space-x-1 text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                <MdOutlineCurrencyExchange className="text-sm" />
                <span>News</span>
              </Link>
            </div>
          </div>
          
          {/* User account */}
          <div className="hidden md:block">
            <div className="relative">
              <button 
                onClick={toggleDropdown}
                className="flex items-center bg-[#1A2235] border border-[#2D3748] text-white rounded-full px-4 py-1.5 focus:outline-none"
              >
                <span className="mr-2 text-sm">user</span>
                <FaUserCircle className="text-white text-lg" />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1A2235] border border-[#2D3748] rounded-md shadow-lg py-1 z-10">
                  <button className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#2D3748] hover:text-white">
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleDropdown}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d={isDropdownOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isDropdownOpen && (
        <div className="md:hidden bg-[#1A2235] border-t border-[#2D3748]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              href="/"
              className="flex items-center space-x-2 text-gray-300 hover:bg-[#2D3748] hover:text-white  px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsDropdownOpen(false)}
            >
              <FaHome />
              <span>Home</span>
            </Link>
            
            <Link 
              href="/trending"
              className="flex items-center space-x-2 text-gray-300 hover:bg-[#2D3748] hover:text-white  px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsDropdownOpen(false)}
            >
              <HiTrendingUp />
              <span>Trending</span>
            </Link>
            
            <Link 
              href="/currency-converter"
              className="flex items-center space-x-2 text-gray-300 hover:bg-[#2D3748] hover:text-white  px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsDropdownOpen(false)}
            >
              <MdOutlineCurrencyExchange />
              <span>ConvertCurrency</span>
            </Link>
            
            <div className="border-t border-[#2D3748] pt-2 mt-2">
              <button className="flex items-center space-x-2 text-gray-300 hover:bg-[#2D3748] hover:text-white  px-3 py-2 rounded-md text-base font-medium">
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;