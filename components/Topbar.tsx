import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { ImExit } from 'react-icons/im'

export default function Topbar() {
    const router = useRouter();
    const [session, setSession] = useState<any>()
    const getSession = async () => {
        const result: any = await localStorage.getItem("session")
        setSession(JSON.parse(result))
    }
    const removeSession = async () => {
        localStorage.removeItem('session')
        router.push('/login')
    }
    useEffect(() => {
        getSession()
    }, [])
    return (
        <div className='bg-green-400 w-full md:h-16 text-white'>
            <div className='flex justify-end px-10 gap-4 md:pt-5 items-center'>
                <span>{session?.name?.toUpperCase()}</span>
                <button type='button' onClick={() => {
                    removeSession()
                }}>
                    <ImExit className='text-red-400 hover:text-red-500 text-lg' />
                </button>
            </div>
        </div>
    )
}
