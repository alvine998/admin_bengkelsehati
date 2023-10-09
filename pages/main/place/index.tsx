import Input from '@/components/Input'
import Layout from '@/components/Layout'
import useModal from '@/components/Modal'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import DataTable, { ExpanderComponentProps } from 'react-data-table-component'

export default function Place() {
    const [show, setShow] = useState<boolean>(false)
    const [modal, setModal] = useModal<any>()

    const columns: any = [
        {
            name: "Nama",
            right: false,
            selector: (row: any) => row?.name
        },
        {
            name: "No Registrasi",
            right: false,
            selector: (row: any) => row?.regis_no
        },
        {
            name: "Tempat, Tanggal Lahir",
            right: false,
            selector: (row: any) => row?.birth_place + ", " + moment(row?.birth_date).format("DD-MM-YYYY")
        },
        {
            name: "Jenis Alat",
            right: false,
            selector: (row: any) => row?.tool_type
        },
        {
            name: "Jenis Personel",
            right: false,
            selector: (row: any) => row?.personel_type
        },
        {
            name: "Klasifikasi",
            right: false,
            selector: (row: any) => row?.clasification
        },
        {
            name: "Kelas",
            right: false,
            selector: (row: any) => row?.class
        },
        {
            name: "Masa Berlaku",
            right: false,
            selector: (row: any) => moment(row?.expired_at).format("DD-MM-YYYY") || "-"
        },
        {
            name: "Foto",
            right: false,
            selector: (row: any) => row?.photo ? <img alt='image-profil' src={row?.photo} className='w-[70px] h-[100px]' /> : "-"
        },
        {
            name: "Status",
            right: false,
            selector: (row: any) => row?.expired_at > new Date().toISOString() ? "Aktif" : "Tidak Aktif"
        },
        {
            name: "Aksi",
            right: false,
            selector: (row: any) => <>
                <a href={`/page/cek_qrcode/${row?.regis_no}`} className='text-blue-500'>Lihat</a><br />
                <a href={`/main/member/edit/${row?.regis_no}`} className='text-green-500'>Edit</a><br />
                <button type='button' onClick={() => {
                    setModal({ ...modal, open: true, data: row, key: "delete" })
                }} className='text-red-500'>Hapus</button>
            </>
        }
    ]

    useEffect(() => {
        setShow(typeof window !== 'undefined')
    }, [])
    const ExpandedComponent: React.FC<ExpanderComponentProps<any>> = ({ data }) => {
        return (
            <div className='p-10'>
                <div className=' flex gap-5'>
                    <p>Tempat Lahir :</p>
                    <p>{data?.birth_place}</p>
                </div>
                <div className='flex gap-5'>
                    <p>Tanggal Lahir :</p>
                    <p>{moment(data?.birth_date).format("DD-MM-YYYY")}</p>
                </div>
                <div className='flex gap-5'>
                    <p>Klasifikasi :</p>
                    <p>{data?.clasification}</p>
                </div>
                <div className='flex gap-5'>
                    <p>Jenis Personel :</p>
                    <p>{data?.personel_type}</p>
                </div>
                <div className='flex gap-5'>
                    <p>Nama Instansi :</p>
                    <p>{data?.instance}</p>
                </div>
            </div>
        )
    }
    return (
        <Layout>
            <div>
                <h1 className='text-xl font-semibold'>Lokasi</h1>
            </div>
            <div className='mt-5'>
                <div>
                    <Input label='' placeholder='Cari disini...' />
                </div>
                {
                    show ?
                        <DataTable
                            columns={columns}
                            data={[]}
                            striped={true}
                            responsive={true}
                            pagination={true}
                            paginationServer={true}
                            paginationDefaultPage={1}
                            paginationPerPage={10}
                            // paginationTotalRows={table.total_items}
                            // onChangePage={(pageData: any) => {
                            //     router?.push(`?page=${pageData}`)
                            // }}
                            // progressPending={info.loading}
                            expandableRows
                            expandableRowsComponent={ExpandedComponent}
                            highlightOnHover
                            pointerOnHover
                        /> : ""
                }
            </div>
        </Layout>
    )
}
