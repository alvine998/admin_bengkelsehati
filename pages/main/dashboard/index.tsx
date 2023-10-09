import Charts from '@/components/Charts';
import Layout from '@/components/Layout';
import React from 'react'

export async function getServerSideProps(context: any) {
    try {
        // const result = await firebase
        return {
            props: {
                table: []
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export default function Dasboard() {
    return (
        <Layout>
            <div className='px-20 pt-10'>
                <div className='w-full bg-green-400 p-5 rounded-lg'>
                    <h1 className='text-white text-2xl font-semibold font-sans'>Selamat Datang di Dashboard Aplikasi Bengkel Muslimah</h1>
                </div>
                <div>
                    <Charts/>
                </div>
            </div>
        </Layout>
    )
}
