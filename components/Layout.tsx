import React, { useEffect } from 'react'
import Topbar from './Topbar'
import Sidebar from './Sidebar'
import { useRouter } from 'next/router'

export default function Layout({ children }: any) {
    const router = useRouter()
    const handleSession = async () => {
        const checkSession = await localStorage.getItem("session")
        if(!checkSession){
            router.push('/login')
        }
    }
    useEffect(()=>{
        handleSession()
    },[])
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
