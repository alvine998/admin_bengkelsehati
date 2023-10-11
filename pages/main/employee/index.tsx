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
import { FaPencilAlt, FaTrashAlt, FaInfoCircle } from 'react-icons/fa'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '@/config/firebase'
import { Purchase } from '@/types/purchase'
import { Place } from '@/types/place'
import { toMoney } from '@/utils'

export async function getServerSideProps(context: any) {
    try {
        const { search, page } = context.query;
        const filters = {

        }
        const result = await axios.get(CONFIG.base_url_api + `/employees?pagination=true&search=${search || ""}&page=${page - 1 || 0}`, {
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

export default function Place({ table }: any) {
    const router = useRouter();
    const [show, setShow] = useState<boolean>(false)
    const [modal, setModal] = useModal<any>()
    const [selectType, setSelectType] = useState('bank')
    const [imageData, setImageData] = useState<any>([])
    const handleUpload = (e: any) => {
        const preview = e.target.files[0]
        const fileName = preview?.name
        const storageRef = ref(storage, `/files/${fileName}`);
        uploadBytes(storageRef, preview)
            .then(async (snapshot) => {
                console.log('Image uploaded successfully!');
                const url = await getDownloadURL(storageRef)
                setImageData([...imageData, { url: url }])
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
                photo: imageData || null
            }
            const result = await modal.key == 'create' ? axios.post(CONFIG.base_url_api + '/employee', payload, {
                headers: { "bearer-token": 'bengkelsehati51' }
            }) : axios.patch(CONFIG.base_url_api + '/employee', payload, {
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
        } catch (error) {
            console.log(error);
            Swal.fire({
                text: "Gagal menyimpan data",
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
            const result = await axios.delete(CONFIG.base_url_api + `/employee?id=${formData?.id}`, {
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
            name: "Nama Usaha",
            right: false,
            selector: (row: Place) => row?.name
        },
        {
            name: "Alamat",
            right: false,
            width: '250px',
            selector: (row: Place) => row?.address + ", " + row?.cities + ", " + row?.province
        },
        {
            name: "Biaya Jasa",
            right: false,
            selector: (row: Place) => toMoney(row?.price) || "-"
        },
        {
            name: "Tipe",
            right: false,
            selector: (row: Place) => row?.long ? <a href={`https://maps.google.com/?q=${row?.lat},${row?.long}`} target='_blank' className='text-blue-500' >Lihat Lokasi</a> : "-"
        },
        {
            name: "Foto",
            right: false,
            selector: (row: Place) => row?.photo?.length > 0 ? <>
                {
                    row?.photo?.map((v: any, i: number) => (
                        <>
                            <a href={v.url} key={i} target='_blank' className='text-blue-500' >Lihat Foto {i + 1}</a>
                            <br />
                        </>
                    ))
                }
            </> : "-"
        },
        {
            name: "Aksi",
            right: false,
            selector: (row: Place) => <>
                <button type='button' onClick={() => {
                    setModal({ ...modal, open: true, data: row, key: "update" })
                    setImageData(row?.photo || [])
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
                <h1 className='text-xl font-semibold'>Lokasi</h1>
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
                        title={modal.key == 'create' ? 'Tambah Data Pegawai' : 'Ubah Data Pegawai'}
                    >
                        <form onSubmit={save}>
                            <input type="text" className='hidden' value={modal?.data?.id} name='id' />
                            <Input label='Nama Usaha' placeholder='Masukkan Nama Usaha' name='name' defaultValue={modal?.data?.name || ""} required />
                            <Input label='Alamat' placeholder='Masukkan Alamat' name='address' type='text' defaultValue={modal?.data?.address || ""} required />
                            <div className='flex md:flex-row flex-col gap-2'>
                                <Input label='Provinsi' placeholder='Masukkan Provinsi' name='province' type='text' defaultValue={modal?.data?.province || ""} required />
                                <Input label='Kab/Kota' placeholder='Masukkan Kab/Kota' name='cities' type='text' defaultValue={modal?.data?.cities || ""} required />
                            </div>
                            <div className='flex md:flex-row flex-col gap-2'>
                                <Input label='Latitude' placeholder='Masukkan Latitude' name='lat' type='text' defaultValue={modal?.data?.lat || ""} required />
                                <Input label='Longitude' placeholder='Masukkan Longitude' name='long' type='text' defaultValue={modal?.data?.long || ""} required />
                            </div>
                            <div className="group relative w-max">
                                <button>
                                    <FaInfoCircle className='text-green-400 text-lg' />
                                </button>
                                <span
                                    className="pointer-events-none absolute -top-8 p-1 duration-150 left-0 w-max opacity-0 transition-opacity bg-green-500 rounded-md text-white group-hover:opacity-100"
                                >
                                    Latitude dan Longitude bisa didapatkan dari google maps berupa angka
                                </span>

                            </div>
                            <Input label='Harga' placeholder='Masukkan Harga' name='price' type='number' defaultValue={modal?.data?.price || ""} required />
                            <Input label='Gambar' accept='image/*' name='photo' type='file' defaultValue={""} onChange={(e) => { handleUpload(e) }} required />
                            <div className='flex items-center justify-center'>
                                {
                                    imageData?.length > 0 &&
                                    <>
                                        {
                                            imageData?.map((v: any, i: number) => (
                                                <img key={i} src={v.url} className='w-[300px] md:h-[300px]' alt='image' />
                                            ))
                                        }
                                    </>
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
                        title='Hapus Data Pegawai'
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
