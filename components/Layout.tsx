import React from 'react'
import Topbar from './Topbar'
import Sidebar from './Sidebar'

export default function Layout({ children }: any) {
    return (
        <div className='flex md:flex-row flex-col w-full'>
            <Sidebar />
            <div className='w-full'>
                <Topbar />
                <div className='p-5'>
                    {children}
                </div>
            </div>
        </div>
    )
}
