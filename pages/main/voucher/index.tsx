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
import { Voucher } from '@/types/voucher'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '@/config/firebase'

export async function getServerSideProps(context: any) {
    try {
        const { search, page } = context.query;
        const filters = {

        }
        const result = await axios.get(CONFIG.base_url_api + `/vouchers?pagination=true&search=${search || ""}&page=${page - 1 || 0}`, {
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

export default function Voucher({ table }: any) {
    const router = useRouter();
    const [show, setShow] = useState<boolean>(false)
    const [modal, setModal] = useModal<any>()

    const [loading, setLoading] = useState<boolean>(false)
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

    const save = async (e: any) => {
        e?.preventDefault()
        const formData: any = Object.fromEntries(new FormData(e.target))
        setLoading(true)
        try {
            const payload = {
                ...formData,
                banner: imageData?.url || null
            }
            const result = modal.key == 'create' ? await axios.post(CONFIG.base_url_api + '/voucher', payload, {
                headers: { "bearer-token": 'bengkelsehati51' }
            }) : await axios.patch(CONFIG.base_url_api + '/voucher', payload, {
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
            const result = await axios.delete(CONFIG.base_url_api + `/voucher?id=${formData?.id}`, {
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
            width: '250px',
            selector: (row: Voucher) => row?.name
        },
        {
            name: "Jenis Voucher",
            right: false,
            width: '150px',
            selector: (row: Voucher) => row?.type?.toUpperCase()
        },
        {
            name: "Jam Berlaku",
            right: false,
            width: '200px',
            selector: (row: Voucher) => row?.time_start ? `${row?.time_start} s/d ${row?.time_end}` : '-'
        },
        {
            name: "Kuota",
            right: false,
            selector: (row: Voucher) => row?.quota
        },
        {
            name: "Banner",
            right: false,
            selector: (row: Voucher) => row?.banner ? <a href={row.banner} target='_blank' className='text-blue-500' >Lihat</a> : "-"
        },
        {
            name: "Persentase",
            right: false,
            selector: (row: Voucher) => row?.percentage + "%"
        },
        {
            name: "Masa Berlaku",
            right: false,
            width: '150px',
            selector: (row: Voucher) => moment(row?.expired_at).format("DD-MM-YYYY HH:mm")
        },
        {
            name: "Aksi",
            right: false,
            selector: (row: Voucher) => <>
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

    const ExpandedComponent: React.FC<ExpanderComponentProps<Voucher>> = ({ data }) => {
        return (
            <div className='p-10'>
                <div className=' flex gap-5'>
                    <p>Maksimal Penggunaan :</p>
                    <p>{data?.max_used}</p>
                </div>
                <div className='flex gap-5'>
                    <p>Minimal Pembayaran :</p>
                    <p>{data?.min}</p>
                </div>
            </div>
        )
    }
    return (
        <Layout>
            <div>
                <h1 className='text-xl font-semibold'>Voucher</h1>
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
                            customStyles={{
                                table: {
                                    style: { overflow: 'auto' }
                                }
                            }}
                            progressPending={loading}
                            expandableRows
                            expandableRowsComponent={ExpandedComponent}
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
                        title={modal.key == 'create' ? 'Tambah Data Voucher' : 'Ubah Data Voucher'}
                    >
                        <form onSubmit={save}>
                            <input type="text" className='hidden' value={modal?.data?.id} name='id' />
                            <div>
                                <label htmlFor="status">Jenis Voucher</label>
                                <div id='status' className='flex gap-5'>
                                    <div className='flex gap-2'>
                                        <input type='radio' defaultChecked={modal?.data?.type === "cashback" || true} value={'cashback'} name='type' />
                                        <span>Cashback</span>
                                    </div>
                                    <div className='flex gap-2'>
                                        <input type='radio' defaultChecked={modal?.data?.type === "discount"} value={'discount'} name='type' />
                                        <span>Diskon</span>
                                    </div>
                                    <div className='flex gap-2'>
                                        <input type='radio' defaultChecked={modal?.data?.type === "gift"} value={'gift'} name='type' />
                                        <span>Hadiah</span>
                                    </div>
                                </div>
                            </div>
                            <Input label='Nama' placeholder='Masukkan Nama' name='name' defaultValue={modal?.data?.name || ""} required />
                            <div className='flex md:flex-row flex-col gap-2'>
                                <Input label='Kuota' placeholder='Masukkan Kuota' name='quota' type='number' defaultValue={modal?.data?.quota || ""} required />
                                <Input label='Kode Voucher' placeholder='Masukkan Kode Voucher' name='code' type='text' defaultValue={modal?.data?.code || ""} required />
                            </div>
                            <div className='flex md:flex-row flex-col gap-2'>
                                <Input label='Minimal Pembayaran' placeholder='Masukkan Minimal Pembayaran' name='min' type='number' defaultValue={modal?.data?.min || ""} />
                                <Input label='Maksimal Penggunaan' placeholder='Masukkan Maksimal Penggunaan' name='max_used' type='number' defaultValue={modal?.data?.max_used || ""} />
                            </div>
                            <div className='flex md:flex-row flex-col gap-2'>
                                <Input label='Batas Rupiah' placeholder='Masukkan Batas Rupiah' name='max' type='number' defaultValue={modal?.data?.max || ""} />
                                <Input label='Persentase' placeholder='Masukkan Persentase' name='percentage' type='number' defaultValue={modal?.data?.percentage || ""} required />
                            </div>
                            <div className='flex md:flex-row flex-col gap-2'>
                                <Input label='Waktu Mulai' name='time_start' type='time' defaultValue={modal?.data?.time_start || ""} />
                                <Input label='Waktu Berakhir' name='time_end' type='time' defaultValue={modal?.data?.time_end || ""} />
                            </div>
                            <Input label='Masa Berlaku' name='expired_at' type='date' defaultValue={modal?.data?.expired_at || ""} />
                            <Input label='Banner' accept='image/*' name='banner' type='file' defaultValue={modal?.data?.banner || ""} onChange={(e) => { handleUpload(e) }} />
                            <div className='flex items-center justify-center'>
                                {
                                    imageData &&
                                    <img src={imageData.url} className='w-[300px] md:h-[300px]' alt='image-qris' />
                                }
                            </div>
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
                        title='Hapus Data Voucher'
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
