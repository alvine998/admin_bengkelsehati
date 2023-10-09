import React, { InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
    label: string,
    types?: 'old' | 'special'
}

export default function Input(props: Props) {
    const { label, types } = props
    return (
        <>
            {
                types == 'special' ?
                    <div className='my-2 flex flex-row w-full'>
                        {
                            label &&
                            <label htmlFor={label} className='text-gray-500 w-full'>{label}</label>
                        }
                        <input id={label} {...props}
                            className="block w-full rounded-md border-0 py-1.5 pl-4 pr-2 mx-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 focus:outline-none sm:text-sm sm:leading-6"
                        />
                    </div> :
                    <div className='my-2 flex flex-col w-full'>
                        {
                            label &&
                            <label htmlFor={label} className='text-gray-500'>{label}</label>
                        }
                        <input id={label} {...props}
                            className="block w-full rounded-md border-0 py-1.5 pl-4 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 focus:outline-none sm:text-sm sm:leading-6"
                        />
                    </div>
            }
        </>
    )
}
