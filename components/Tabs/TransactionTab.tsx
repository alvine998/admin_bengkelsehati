import { useRouter } from 'next/router';
import React, { Fragment, useState } from 'react'

export default function TransactionTab({ children }: any) {
    const [activeTab, setActiveTab] = useState('unpaid');
    const router = useRouter();

    const handleTabClick = (href: any) => {
        router.push(href)
    };
    return (
        <Fragment>
            <div>
                <h1 className='text-xl font-semibold'>Transaksi</h1>
            </div>
            <div className="flex justify-start mt-10">
                <div className="flex">
                    <button
                        className={`px-4 py-2 ${router.pathname?.includes('/main/transaction/unpaid') ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
                        onClick={() => handleTabClick('unpaid')}
                    >
                        Belum Lunas
                    </button>
                    <button
                        className={`px-4 py-2 ${router.pathname?.includes('/main/transaction/paid') ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
                        onClick={() => handleTabClick('paid')}
                    >
                        Lunas
                    </button>
                    {/* <button
                        className={`px-4 py-2 ${activeTab === 3 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                        onClick={() => handleTabClick(3)}
                    >
                        Pending
                    </button> */}
                </div>
            </div>
            {children}
        </Fragment>
    )
}
