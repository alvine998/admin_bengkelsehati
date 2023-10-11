import Input from '@/components/Input'
import Layout from '@/components/Layout'
import useModal, { Modal } from '@/components/Modal'
import { CONFIG } from '@/config'
import { Admin } from '@/types/admin'
import axios from 'axios'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import DataTable, { ExpanderComponentProps } from 'react-data-table-component'
import Swal from 'sweetalert2'
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
import { User } from '@/types/user'

export async function getServerSideProps(context: any) {
    try {
        const { search, page } = context.query;
        const filters = {

        }
        const result = await axios.get(CONFIG.base_url_api + `/users?pagination=true&search=${search || ""}&page=${page - 1 || 0}`, {
            headers: { "bearer-token": 'bengkelsehati51' }
        })
        return {
            props: {
                table: {
                    ...result.data,
                    data: result.data.items.rows || [],
                    total_items: result.data.items.count || 0
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export default function User({ table }: any) {
    const router = useRouter();
    const [show, setShow] = useState<boolean>(false)
    const [modal, setModal] = useModal<any>()

    const [loading, setLoading] = useState<boolean>(false)

    const save = async (e: any) => {
        e?.preventDefault()
        const formData: any = Object.fromEntries(new FormData(e.target))
        setLoading(true)
        try {
            const payload = {
                ...formData,
                password: !formData?.password ? modal.data.password : formData?.password
            }
            const result = modal.key == 'create' ? await axios.post(CONFIG.base_url_api + '/user', payload, {
                headers: { "bearer-token": 'bengkelsehati51' }
            }) : await axios.patch(CONFIG.base_url_api + '/user', payload, {
                headers: { "bearer-token": 'bengkelsehati51' }
            })
            Swal.fire({
                text: "Berhasil menyimpan data",
                icon: 'success'
            })
            setModal({ ...modal, open: false })
            router.push('')
            setLoading(false)
        } catch (error: any) {
            console.log(error);
            Swal.fire({
                text: `${error.response.data.error_message}`,
                icon: 'error'
            })
            setLoading(false)
        }
    }

    const remove = async (e: any) => {
        e?.preventDefault()
        const formData: any = Object.fromEntries(new FormData(e.target))
        setLoading(true)
        try {
            const result = await axios.delete(CONFIG.base_url_api + `/user?id=${formData?.id}`, {
                headers: { "bearer-token": 'bengkelsehati51' }
            })
            Swal.fire({
                text: "Berhasil menghapus data",
                icon: 'success'
            })
            setModal({ ...modal, open: false })
            router.push('')
            setLoading(false)
        } catch (error) {
            console.log(error);
            Swal.fire({
                text: "Gagal menghapus data",
                icon: 'error'
            })
            setLoading(false)
        }
    }

    const columns: any = [
        {
            name: "Nama",
            right: false,
            selector: (row: User) => row?.name
        },
        {
            name: "No Handphone",
            right: false,
            selector: (row: User) => row?.phone
        },
        {
            name: "Email",
            right: false,
            selector: (row: User) => row?.email
        },
        {
            name: "Kode Referal",
            right: false,
            selector: (row: User) => row?.ref_code
        },
        {
            name: "Aksi",
            right: false,
            selector: (row: User) => <>
                <button type='button' onClick={() => {
                    setModal({ ...modal, open: true, data: row, key: "update" })
                }} >
                    <FaPencilAlt className='text-green-500 w-7' />
                </button>
                <button type='button' onClick={() => {
                    setModal({ ...modal, open: true, data: row, key: "delete" })
                }}>
                    <FaTrashAlt className='text-red-500 w-7' />
                </button>
            </>
        }
    ]

    useEffect(() => {
        setShow(typeof window !== 'undefined')
    }, [])
    // const ExpandedComponent: React.FC<ExpanderComponentProps<any>> = ({ data }) => {
    //     return (
    //         <div className='p-10'>
    //             <div className=' flex gap-5'>
    //                 <p>Tempat Lahir :</p>
    //                 <p>{data?.birth_place}</p>
    //             </div>
    //             <div className='flex gap-5'>
    //                 <p>Tanggal Lahir :</p>
    //                 <p>{moment(data?.birth_date).format("DD-MM-YYYY")}</p>
    //             </div>
    //             <div className='flex gap-5'>
    //                 <p>Klasifikasi :</p>
    //                 <p>{data?.clasification}</p>
    //             </div>
    //             <div className='flex gap-5'>
    //                 <p>Jenis Personel :</p>
    //                 <p>{data?.personel_type}</p>
    //             </div>
    //             <div className='flex gap-5'>
    //                 <p>Nama Instansi :</p>
    //                 <p>{data?.instance}</p>
    //             </div>
    //         </div>
    //     )
    // }
    return (
        <Layout>
            <div>
                <h1 className='text-xl font-semibold'>Pengguna Aplikasi</h1>
            </div>
            <div className='mt-5'>
                <div>
                    <div>
                        <button
                            type='button'
                            onClick={() => {
                                setModal({ ...modal, open: true, data: null, key: "create" })
                            }}
                            className='md:mt-4 w-full h-9 bg-green-500 hover:bg-green-600 rounded-lg justify-center items-center text-center text-white'>
                            Tambah Data
                        </button>
                    </div>
                    <Input label='' placeholder='Cari disini...' onChange={(e) => { router.push(`?search=${e.target.value}`) }} />
                </div>
                {
                    show ?
                        <DataTable
                            columns={columns}
                            data={table.data}
                            striped={true}
                            responsive={true}
                            pagination={true}
                            paginationServer={true}
                            paginationDefaultPage={1}
                            paginationPerPage={table.total_pages}
                            paginationTotalRows={table.total_items}
                            onChangePage={(pageData: any) => {
                                router?.push(`?page=${pageData}`)
                            }}
                            progressPending={loading}
                            // expandableRows
                            // expandableRowsComponent={ExpandedComponent}
                            highlightOnHover
                            pointerOnHover
                        /> : ""
                }
            </div>
            {
                modal.key == 'create' || modal.key == 'update' ?
                    <Modal
                        open={modal.open}
                        setOpen={() => { setModal({ ...modal, open: false }) }}
                        title={modal.key == 'create' ? 'Tambah Data Pengguna Aplikasi' : 'Ubah Data Pengguna Aplikasi'}
                    >
                        <form onSubmit={save}>
                            <input type="text" className='hidden' value={modal?.data?.id} name='id' />
                            <Input label='Nama' placeholder='Masukkan Nama' name='name' defaultValue={modal?.data?.name || ""} required />
                            <Input label='Email' placeholder='Masukkan Email' name='email' type='email' defaultValue={modal?.data?.email || ""} required />
                            <Input label='No Handphone' placeholder='Masukkan No Handphone' name='phone' type='number' defaultValue={modal?.data?.phone || ""} required />
                            <Input label='Password' placeholder='Masukkan Password' name='password' type='password' defaultValue={""} required={modal.key === 'create'} />
                            <button disabled={loading} className='md:mt-4 w-full h-9 bg-green-500 hover:bg-green-600 rounded-lg justify-center items-center text-center text-white'>
                                {loading ? "Menyimpan..." : "Simpan"}
                            </button>
                        </form>
                    </Modal> : ""
            }
            {
                modal.key == 'delete' ?
                    <Modal
                        open={modal.open}
                        setOpen={() => { setModal({ ...modal, open: false }) }}
                        title='Hapus Data Pengguna Aplikasi'
                    >
                        <form onSubmit={remove}>
                            <input type="text" className='hidden' value={modal.data.id} name='id' />
                            <p className='text-center'>Apakah anda yakin ingin menghapus admin {modal.data.name}?</p>
                            <button disabled={loading} className='md:mt-4 w-full h-9 bg-red-500 hover:bg-red-600 rounded-lg justify-center items-center text-center text-white'>
                                {loading ? "Menghapus..." : "Hapus"}
                            </button>
                        </form>
                    </Modal> : ""
            }
        </Layout>
    )
}
