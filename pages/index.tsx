import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Fragment } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  // const handlePhoto = () => {
  //   const preview = e.target.files[0]
  //   const fileName = preview?.name
  //   const storageRef = ref(storage, `/files/${fileName}`);
  //   uploadBytes(storageRef, preview)
  //     .then(async (snapshot) => {
  //       console.log('Image uploaded successfully!');
  //       const url = await getDownloadURL(storageRef)
  //       setImageData({ url: url })
  //     })
  //     .catch((error) => {
  //       console.error('Error uploading image: ', error);
  //     });
  // }
  return (
    <Fragment>

    </Fragment>
  )
}
