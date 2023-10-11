import { useRouter } from 'next/router'
import React from 'react'
import {ImExit} from 'react-icons/im'

export default function Topbar() {
    const router = useRouter();
    return (
        <div className='bg-green-400 w-full md:h-16 text-white'>
            <div className='flex justify-end px-10 gap-4 md:pt-5 items-center'>
                <span>Admin 1</span>
                <button type='button' onClick={()=>{
                    router.push('/login')
                }}>
                    <ImExit className='text-red-400 hover:text-red-500 text-lg' />
                </button>
            </div>
        </div>
    )
}
