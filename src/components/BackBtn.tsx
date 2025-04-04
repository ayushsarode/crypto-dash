import React from 'react'
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

function BackBtn() {
  return (
    <div className='hover:text-[1.2rem]'>

              <Link href={"/"} className="btn btn-ghost text-[.9rem] font-extralight text-white border-white hover:border-white hover:bg-black ">
          <FaArrowLeft  className="text-md" />
          Go back
        </Link>

    </div>
  )
}

export default BackBtn
