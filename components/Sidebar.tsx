import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { FaTachometerAlt, FaBuilding, FaBookmark, FaUserTie } from 'react-icons/fa'
import { FaBuildingColumns, FaMoneyBill1Wave, FaTicket, FaUser, FaUserCheck } from 'react-icons/fa6'
import { GrTransaction } from 'react-icons/gr'
export default function Sidebar() {
    const router = useRouter();
    const navigations = [
        {
            name: "Dashboard",
            href: "/main/dashboard",
            active: router.pathname?.includes('dashboard'),
            icon: <FaTachometerAlt className='text-xl' />
        },
        {
            name: "Lokasi",
            href: "/main/place",
            active: router.pathname?.includes('place'),
            icon: <FaBuilding className='text-xl' />
        },
        // {
        //     name: "Banner",
        //     href: "/main/banner",
        //     active: router.pathname?.includes('banner'),
        //     icon: <FaBookmark className='text-xl' />
        // },
        {
            name: "Voucher",
            href: "/main/voucher",
            active: router.pathname?.includes('voucher'),
            icon: <FaTicket className='text-xl' />
        },
        {
            name: "Pembayaran",
            href: "/main/purchase",
            active: router.pathname?.includes('purchase'),
            icon: <FaBuildingColumns className='text-xl' />
        },
        {
            name: "Pegawai",
            href: "/main/employee",
            active: router.pathname?.includes('employee'),
            icon: <FaUserCheck className='text-xl' />
        },
        {
            name: "Transaksi",
            href: "/main/transaction/unpaid",
            active: router.pathname?.includes('transaction'),
            icon: <GrTransaction className='text-xl' />
        },
        {
            name: "Pengguna Aplikasi",
            href: "/main/user",
            active: router.pathname?.includes('user'),
            icon: <FaUser className='text-xl' />
        },
        {
            name: "Pengguna Admin",
            href: "/main/admin",
            active: router.pathname?.includes('admin'),
            icon: <FaUserTie className='text-xl' />
        },
    ]

    return (
        <div className='bg-white md:w-1/4'>
            <div className='bg-green-400 h-16'>
                <div className='md:pt-2'>
                    <img src='https://firebasestorage.googleapis.com/v0/b/bengkel-muslimah.appspot.com/o/LOGO%20BS%20PNG.png?alt=media&token=40acc36e-3a9b-4bf9-87ed-f0b920afa528' className='md:w-16 md:h-12 md:ml-20' />
                </div>
            </div>

            <div className='md:mt-5'>
                {
                    navigations?.map((val: any, i: number) => (
                        <div key={i} className={`hover:bg-gray-400 ${val.active && 'bg-gray-400'} w-full md:p-2 md:pl-5 duration-150 h-auto mt-1`}>
                            <Link href={val?.href} className='flex gap-3 items-center'>
                                {val?.icon && val?.icon}
                                <p>{val?.name}</p>
                            </Link>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
