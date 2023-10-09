import React from 'react'

export default function Topbar() {
    return (
        <div className='bg-green-400 w-full md:h-10 text-white'>
            <div className='flex justify-end px-10 gap-2 md:pt-2 items-center'>
                <span>Admin 1</span>
                <a className='text-red-500 hover:text-red-600 cursor-pointer' >Logout</a>
            </div>
        </div>
    )
}
