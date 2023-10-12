import Input from '@/components/Input';
import { CONFIG } from '@/config';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';

export default function Login() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false)
    const handleLogin = async (e: any) => {
        e?.preventDefault()
        setLoading(true)
        const formData: any = Object.fromEntries(new FormData(e.target))
        try {
            const payload = {
                ...formData
            }
            console.log(payload);
            const result = await axios.post(CONFIG.base_url_api + `/admin/login`, payload, {
                headers: { "bearer-token": 'bengkelsehati51' }
            })
            localStorage.setItem('session', JSON.stringify(result.data.result))
            Swal.fire({
                text: "Berhasil Login",
                icon: "success"
            })
            setLoading(false)
            router.push('/main/dashboard')
        } catch (error) {
            setLoading(false)
            console.log(error);
            Swal.fire({
                text: "Gagal Login",
                icon: "error"
            })
        }
    }

    const handleSession = async () => {
        const checkSession = await localStorage.getItem("session")
        if (checkSession) {
            router.push('/main/dashboard')
        }
    }
    useEffect(() => {
        handleSession()
    }, [])

    return (
        <div className='flex h-[100vh]'>
            <div className='md:block hidden w-full bg-green-500'>
                <div className='flex justify-center items-center md:mt-52'>
                    <img src='https://firebasestorage.googleapis.com/v0/b/bengkel-muslimah.appspot.com/o/LOGO%20BS%20PNG.png?alt=media&token=40acc36e-3a9b-4bf9-87ed-f0b920afa528' className='md:w-48 md:h-48' />
                </div>
            </div>
            <div className='bg-white w-full'>
                <div className='p-5 flex flex-col justify-center items-center md:mt-32'>
                    <h1 className='font-semibold text-xl text-center'>LOGIN ADMIN BENGKEL MUSLIMAH</h1>
                    <form onSubmit={handleLogin}>
                        <div className='w-full md:w-[300px] mt-10'>
                            <Input label='' placeholder='Email' name='email' />
                            <Input label='' placeholder='Password' type='password' name='password' />
                            <button type='submit' disabled={loading} className='md:mt-4 w-full h-10 bg-green-500 hover:bg-green-600 rounded-lg justify-center items-center text-center text-white'>
                                {loading ? "Menunggu..." : "Masuk"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
