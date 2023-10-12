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
import { FaCheckCircle, FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
import { User } from '@/types/user'
import { Transaction } from '@/types/transaction'
import { FaXmark } from 'react-icons/fa6'
import TransactionTab from '@/components/Tabs/TransactionTab'

export async function getServerSideProps(context: any) {
    try {
        const { search, page } = context.query;
        const filters = {

        }
        const result = await axios.get(CONFIG.base_url_api + `/transactions?pagination=true&search=${search || ""}&page=${page - 1 || 0}&status=paid`, {
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

export default function Transactions({ table }: any) {
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
            }
            const result = await axios.patch(CONFIG.base_url_api + '/transaction', payload, {
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

    const columns: any = [
        {
            name: "Kode",
            right: false,
            selector: (row: Transaction) => row?.code
        },
        {
            name: "Nama",
            right: false,
            selector: (row: Transaction) => row?.user_name
        },
        {
            name: "Lokasi",
            right: false,
            width:'250px',
            selector: (row: Transaction) => row?.place_name
        },
        {
            name: "Pembayaran",
            right: false,
            selector: (row: Transaction) => row?.purchase_type
        },
        {
            name: "Bukti Pembayaran",
            right: false,
            selector: (row: Transaction) => row?.image ? <a href={row.image} target='_blank' className='text-blue-500' >Lihat</a> : "-"
        },
        {
            name: "Total Biaya",
            right: false,
            selector: (row: Transaction) => row?.total_price
        },
        {
            name: "Status",
            right: false,
            selector: (row: Transaction) => row?.status == "unpaid" ? "Belum Lunas" : "Lunas"
        },
        {
            name: "Aksi",
            right: false,
            selector: (row: Transaction) => <>
                <button type='button' onClick={() => {
                    setModal({ ...modal, open: true, data: row, key: "cancel" })
                }} >
                    <FaXmark className='text-red-500 w-7 text-lg' />
                </button>
            </>
        }
    ]

    useEffect(() => {
        setShow(typeof window !== 'undefined')
    }, [])
    const ExpandedComponent: React.FC<ExpanderComponentProps<Transaction>> = ({ data }) => {
        return (
            <div className='p-10'>
                <div className=' flex gap-5'>
                    <p>Waktu Booking :</p>
                    <p>{moment(data?.date).format("DD-MM-YYYY HH:mm")}</p>
                </div>
                <div className='flex gap-5'>
                    <p>Tipe Layanan :</p>
                    <p>{data?.service_type == "onsite" ? "Datang ke kantor" : "Home Service"}</p>
                </div>
                <div className='flex gap-5'>
                    <p>Nama Pegawai :</p>
                    <p>{data?.employee_name}</p>
                </div>
                <div className='flex gap-5'>
                    <p>No Akun Pembayaran :</p>
                    <p>{data?.purchase_account_number}</p>
                </div>
                <div className='flex gap-5'>
                    <p>Kode Transaksi :</p>
                    <p>{data?.code}</p>
                </div>
                <div className='flex gap-5'>
                    <p>Kode Voucher :</p>
                    <p>{data?.voucher_code || "-"}</p>
                </div>
            </div>
        )
    }
    return (
        <Layout>
            <TransactionTab>
                <div className='mt-5'>
                    <div>
                        <Input label='' placeholder='Cari disini...' onChange={(e) => { router.push(`?search=${e.target.value}`) }} />
                    </div>
                    {
                        show ?
                            <DataTable
                                columns={columns}
                                data={table?.data}
                                striped={true}
                                responsive={true}
                                pagination={true}
                                paginationServer={true}
                                paginationDefaultPage={1}
                                paginationPerPage={table?.total_pages}
                                paginationTotalRows={table?.total_items}
                                onChangePage={(pageData: any) => {
                                    router?.push(`?page=${pageData}`)
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
                    modal.key == 'approval' ?
                        <Modal
                            open={modal.open}
                            setOpen={() => { setModal({ ...modal, open: false }) }}
                            title='Konfirmasi Pembayaran'
                        >
                            <form onSubmit={save}>
                                <input type="text" className='hidden' value={modal.data.id} name='id' />
                                <p className='text-center'>Apakah anda yakin ingin membatalkan pembayaran {modal.data.code}?</p>
                                <input type="text" className='hidden' value={"canceled"} name='status' />
                                <button disabled={loading} className='md:mt-4 w-full h-9 bg-green-500 hover:bg-green-600 rounded-lg justify-center items-center text-center text-white'>
                                    {loading ? "Mengkonfirmasi..." : "Konfirmasi"}
                                </button>
                            </form>
                        </Modal> : ""
                }
            </TransactionTab>
        </Layout>
    )
}
