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
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '@/config/firebase'
import { Purchase } from '@/types/purchase'

export async function getServerSideProps(context: any) {
    try {
        const { search, page } = context.query;
        const filters = {

        }
        const result = await axios.get(CONFIG.base_url_api + `/purchases?pagination=true&search=${search || ""}&page=${page - 1 || 0}`, {
            headers: { "bearer-token": 'bengkelsehati51' }
        })
        console.log(result.data);
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

export default function Bank({ table }: any) {
    const router = useRouter();
    const [show, setShow] = useState<boolean>(false)
    const [modal, setModal] = useModal<any>()
    const [selectType, setSelectType] = useState('bank')
    const [imageData, setImageData] = useState<any>()
    const handleUpload = (e: any) => {
        const preview = e.target.files[0]
        const fileName = preview?.name
        const storageRef = ref(storage, `/files/${fileName}`);
        uploadBytes(storageRef, preview)
            .then(async (snapshot) => {
                console.log('Image uploaded successfully!');
                const url = await getDownloadURL(storageRef)
                setImageData({ url: url })
            })
            .catch((error) => {
                console.error('Error uploading image: ', error);
            });
    }

    const [loading, setLoading] = useState<boolean>(false)

    const save = async (e: any) => {
        e?.preventDefault()
        const formData: any = Object.fromEntries(new FormData(e.target))
        setLoading(true)
        try {
            const payload = {
                ...formData,
                image: imageData?.url || null
            }
            const result = modal.key == 'create' ? await axios.post(CONFIG.base_url_api + '/purchase', payload, {
                headers: { "bearer-token": 'bengkelsehati51' }
            }) : await axios.patch(CONFIG.base_url_api + '/purchase', payload, {
                headers: { "bearer-token": 'bengkelsehati51' }
            })
            Swal.fire({
                text: "Berhasil menyimpan data",
                icon: 'success'
            })
            setModal({ ...modal, open: false })
            setImageData(null)
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
            const result = await axios.delete(CONFIG.base_url_api + `/purchase?id=${formData?.id}`, {
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
            selector: (row: Purchase) => row?.name
        },
        {
            name: "No Rekening",
            right: false,
            selector: (row: Purchase) => row?.account_number || "-"
        },
        {
            name: "Nama Pemilik",
            right: false,
            selector: (row: Purchase) => row?.account_name || "-"
        },
        {
            name: "Tipe",
            right: false,
            selector: (row: Purchase) => row?.type?.toUpperCase()
        },
        {
            name: "Foto",
            right: false,
            selector: (row: Purchase) => row?.image ? <a href={row.image} target='_blank' className='text-blue-500' >Lihat</a> : "-"
        },
        {
            name: "Aksi",
            right: false,
            selector: (row: Purchase) => <>
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
    return (
        <Layout>
            <div>
                <h1 className='text-xl font-semibold'>Pembayaran</h1>
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
                        title={modal.key == 'create' ? 'Tambah Data Pembayaran' : 'Ubah Data Pembayaran'}
                    >
                        <form onSubmit={save}>
                            <input type="text" className='hidden' value={modal?.data?.id} name='id' />
                            <div>
                                <label htmlFor="status">Jenis Pembayaran</label>
                                <div id='status' className='flex gap-5'>
                                    <div className='flex gap-2'>
                                        <input type='radio' defaultChecked={modal?.data?.type === "bank" || selectType === "bank"} onChange={(e) => {
                                            setSelectType(e.target.value)
                                        }} value={'bank'} name='type' />
                                        <span>BANK</span>
                                    </div>
                                    <div className='flex gap-2'>
                                        <input type='radio' defaultChecked={modal?.data?.type === "qris"} onChange={(e) => {
                                            setSelectType(e.target.value)
                                        }} value={'qris'} name='type' />
                                        <span>QRIS</span>
                                    </div>
                                    <div className='flex gap-2'>
                                        <input type='radio' defaultChecked={modal?.data?.type === "dana"} onChange={(e) => {
                                            setSelectType(e.target.value)
                                        }} value={'dana'} name='type' />
                                        <span>DANA</span>
                                    </div>
                                </div>
                            </div>
                            {
                                selectType == 'bank' &&
                                <>
                                    <Input label='Nama Bank' placeholder='Masukkan Nama Bank' name='name' defaultValue={modal?.data?.name || ""} required />
                                    <Input label='Nama Pemilik Rekening' placeholder='Masukkan Nama Pemilik Rekening' name='account_name' defaultValue={modal?.data?.account_name || ""} required />
                                    <Input label='No Rekening' placeholder='Masukkan No Rekening' name='account_number' type='number' defaultValue={modal?.data?.account_number || ""} required />
                                </>
                            }
                            {
                                selectType == 'qris' &&
                                <>
                                    <Input label='Nama Usaha' placeholder='Masukkan Nama Usaha' name='name' defaultValue={modal?.data?.name || ""} required />
                                    {/* <Input label='Nama Pemilik Rekening' placeholder='Masukkan Nama Pemilik Rekening' name='accouont_name' defaultValue={modal?.data?.accouont_name || ""} required /> */}
                                    <Input label='No QRIS' placeholder='Masukkan No QRIS' name='account_number' type='number' defaultValue={modal?.data?.account_number || ""} required />
                                    <Input label='Gambar QRIS' accept='image/*' name='image' type='file' defaultValue={modal?.data?.image || ""} onChange={(e) => { handleUpload(e) }} required />
                                    <div className='flex items-center justify-center'>
                                        {
                                            imageData &&
                                            <img src={imageData.url} className='w-[300px] md:h-[300px]' alt='image-qris' />
                                        }
                                    </div>
                                </>
                            }
                            {
                                selectType == 'dana' &&
                                <>
                                    <Input label='Nama Pemilik' placeholder='Masukkan Nama Pemilik' name='name' defaultValue={modal?.data?.name || ""} required />
                                    {/* <Input label='Nama Pemilik Rekening' placeholder='Masukkan Nama Pemilik Rekening' name='accouont_name' defaultValue={modal?.data?.accouont_name || ""} required /> */}
                                    <Input label='No Dana' placeholder='Masukkan No Dana' name='account_number' type='number' defaultValue={modal?.data?.account_number || ""} required />
                                </>
                            }
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
                        title='Hapus Data Pembayaran'
                    >
                        <form onSubmit={remove}>
                            <input type="text" className='hidden' value={modal.data.id} name='id' />
                            <p className='text-center'>Apakah anda yakin ingin menghapus data {modal.data.name}?</p>
                            <button disabled={loading} className='md:mt-4 w-full h-9 bg-red-500 hover:bg-red-600 rounded-lg justify-center items-center text-center text-white'>
                                {loading ? "Menghapus..." : "Hapus"}
                            </button>
                        </form>
                    </Modal> : ""
            }
        </Layout>
    )
}
