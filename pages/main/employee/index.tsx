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
import { Employee } from '@/types/employee'

export async function getServerSideProps(context: any) {
    try {
        const { search, page, place_id } = context.query;
        const filters = {

        }
        const result = await axios.get(CONFIG.base_url_api + `/employees?pagination=true&search=${search || ""}&page=${page - 1 || 0}&place_id=${place_id || ""}`, {
            headers: { "bearer-token": 'bengkelsehati51' }
        })
        const places = await axios.get(CONFIG.base_url_api + `/places?pagination=false`, {
            headers: { "bearer-token": 'bengkelsehati51' }
        })
        return {
            props: {
                table: {
                    ...result.data,
                    data: result.data.items.rows || [],
                    total_items: result.data.items.count || 0
                },
                places: places.data.items.rows
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export default function Employee({ table, places }: any) {
    const router = useRouter();
    const [show, setShow] = useState<boolean>(false)
    const [modal, setModal] = useModal<any>()
    const [selectPlace, setSelectPlace] = useState<any>()
    const [loading, setLoading] = useState<boolean>(false)
    const [imageData, setImageData] = useState<any>()
    const handleUpload = (e: any) => {
        setLoading(true)
        const preview = e.target.files[0]
        const fileName = preview?.name
        const storageRef = ref(storage, `/files/${fileName}`);
        uploadBytes(storageRef, preview)
            .then(async (snapshot) => {
                console.log('Image uploaded successfully!');
                const url = await getDownloadURL(storageRef)
                setImageData({ url: url })
                setLoading(false)
            })
            .catch((error) => {
                console.error('Error uploading image: ', error);
                setLoading(false)
            });
    }

    const statusOptions = [
        { value: "", label: "Pilih Status" },
        { value: "available", label: "Onsite" },
        { value: "busy", label: "Sibuk" },
        { value: "off", label: "Libur" },
        { value: "out", label: "Tidak Aktif" }
    ]

    const save = async (e: any) => {
        e?.preventDefault()
        const formData: any = Object.fromEntries(new FormData(e.target))
        setLoading(true)
        try {
            const payload = {
                ...formData,
                photo: imageData?.url || null
            }
            const result = modal.key == 'create' ? await axios.post(CONFIG.base_url_api + '/employee', payload, {
                headers: { "bearer-token": 'bengkelsehati51' }
            }) : await axios.patch(CONFIG.base_url_api + '/employee', payload, {
                headers: { "bearer-token": 'bengkelsehati51' }
            })
            console.log(result.data, 'error');
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
            name: "Nama",
            right: false,
            selector: (row: Employee) => row?.name
        },
        {
            name: "Alamat",
            right: false,
            width: '250px',
            selector: (row: Employee) => row?.address
        },
        {
            name: "Lokasi",
            right: false,
            width: '200px',
            selector: (row: Employee) => row?.place_name || "-"
        },
        {
            name: "Tempat Tanggal Lahir",
            right: false,
            width: '200px',
            selector: (row: Employee) => row?.birth_place + ", " + moment(row?.birth_date).format("DD-MM-YYYY")
        },
        {
            name: "Foto",
            right: false,
            selector: (row: Employee) => row?.photo ? <>
                <a href={row?.photo} target='_blank' className='text-blue-500' >Lihat</a>
            </> : "-"
        },
        {
            name: "Status",
            right: false,
            selector: (row: Employee) => statusOptions.find((v: any) => v.value == row?.status)?.label
        },
        {
            name: "Aksi",
            right: false,
            selector: (row: Employee) => <>
                <button type='button' onClick={() => {
                    setModal({ ...modal, open: true, data: row, key: "update" })
                    setImageData({ url: row?.photo })
                    setSelectPlace({ name: row?.place_name })
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
                <h1 className='text-xl font-semibold'>Pegawai</h1>
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
                <div>
                    <div className='my-2 md:w-1/4'>
                        <div className='mt-2 outline outline-green-300 focus:outline-green-400 rounded-md p-1'>
                            <select name="place_id" id='locs' onChange={(e) => {
                                router?.push(`?place_id=${e.target.value}`)
                            }} className='w-full focus:ring-0 focus:outline-none'>
                                <option value="" selected>Pilih Lokasi</option>
                                {
                                    places?.map((v: any, i: number) => <option value={v?.id} key={i} selected={v?.id == modal?.data?.place_id} >{v?.name}</option>)
                                }
                            </select>
                        </div>
                    </div>
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
                            <Input label='Nama Pegawai' placeholder='Masukkan Nama Pegawai' name='name' defaultValue={modal?.data?.name || ""} required />
                            <Input label='Alamat' placeholder='Masukkan Alamat' name='address' type='text' defaultValue={modal?.data?.address || ""} required />
                            <div className='flex md:flex-row flex-col gap-2'>
                                <Input label='Tempat Lahir' placeholder='Masukkan Tempat Lahir' name='birth_place' type='text' defaultValue={modal?.data?.birth_place || ""} required />
                                <Input label='Tanggal Lahir' placeholder='Masukkan Tanggal Lahir' name='birth_date' type='date' defaultValue={modal?.data?.birth_date || ""} required />
                            </div>
                            <div className='flex md:flex-row flex-col gap-2'>
                                <Input label='Email' placeholder='Masukkan Email' name='email' type='email' defaultValue={modal?.data?.email || ""} required />
                                <Input label='No Hanpdhone' placeholder='Masukkan No Hanpdhone' name='phone' type='number' defaultValue={modal?.data?.phone || ""} required />
                            </div>
                            <div className="group relative w-max">
                                <button>
                                    <FaInfoCircle className='text-green-400 text-lg' />
                                </button>
                                <span
                                    className="pointer-events-none absolute -top-8 p-1 duration-150 left-0 w-max opacity-0 transition-opacity bg-green-500 rounded-md text-white group-hover:opacity-100"
                                >
                                    Pastikan No Hanphone terhubung dengan Whatsapp
                                </span>
                            </div>
                            <div className='flex md:flex-row flex-col gap-2'>
                                <div className='mt-2 w-full'>
                                    <label htmlFor="locs" className='text-gray-500'>Lokasi</label>
                                    <div className='mt-2 outline outline-green-300 focus:outline-green-400 rounded-md p-1'>
                                        <select name="place_id" id='locs' onChange={(e) => {
                                            places?.map((v: any) => {
                                                if (v?.id == e.target.value) {
                                                    setSelectPlace(v)
                                                }
                                            })
                                        }} className='w-full focus:ring-0 focus:outline-none'>
                                            <option value="" selected>Pilih Lokasi</option>
                                            {
                                                places?.map((v: any, i: number) => <option value={v?.id} key={i} selected={v?.id == modal?.data?.place_id} >{v?.name}</option>)
                                            }
                                        </select>
                                    </div>
                                </div>
                                <input type="text" className='hidden' name='place_name' value={selectPlace?.name} />
                                <div className='mt-2 w-full'>
                                    <label htmlFor="stats" className='text-gray-500'>Status</label>
                                    <div className='mt-2 outline outline-green-300 focus:outline-green-400 rounded-md p-1'>
                                        <select name="status" id='stats' className='w-full focus:ring-0 focus:outline-none'>
                                            {
                                                statusOptions?.map((v: any, i: number) => <option value={v?.value} key={i} selected={v?.value == modal?.data?.status || i == 0} >{v?.label}</option>)
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <Input label='Gambar' accept='image/*' name='photo' type='file' defaultValue={""} onChange={(e) => { handleUpload(e) }} />
                            <div className='flex items-center justify-center'>
                                {
                                    imageData &&
                                    <>
                                        {
                                            !loading ? <img src={imageData?.url} className='w-[300px] md:h-[300px]' alt='image' /> : <h1 className='mt-4 text-lg uppercase text-center font-semibold' >Loading....</h1>
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
