import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Fragment } from 'react'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import GoogleMap from 'google-maps-react-markers';
import Head from 'next/head';

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
      <div className='md:h-[50px] w-full bg-green-300 flex justify-center items-center gap-4'>
        <img src='https://firebasestorage.googleapis.com/v0/b/bengkel-muslimah.appspot.com/o/LOGO%20BS%20PNG.png?alt=media&token=40acc36e-3a9b-4bf9-87ed-f0b920afa528' className='md:w-[50px] md:h-[40px]' />
        <h1 className='text-lg font-semibold font-sans underline'>Bengkel Muslimah</h1>
      </div>
      {/* Carousel */}
      <div>
        <Carousel showArrows showThumbs={false} autoPlay swipeable infiniteLoop stopOnHover showStatus={false}>
          <div>
            <img className='md:h-[500px]' src="https://firebasestorage.googleapis.com/v0/b/basicchat-c83b5.appspot.com/o/blog-banner-karnaval-24-02.jpg?alt=media&token=28d00214-b542-4e62-b080-c9f5fd6f9e5e&_gl=1*5r53b*_ga*MTg3NjA1NzgzNS4xNjkyOTYyNzAy*_ga_CW55HF8NVT*MTY5ODkxNzY3Ni4zNC4xLjE2OTg5MTc4MzAuMzEuMC4w" alt="Image 1" />
            <p className="legend">Image 1</p>
          </div>
          <div>
            <img className='md:h-[500px]' src="https://firebasestorage.googleapis.com/v0/b/basicchat-c83b5.appspot.com/o/blog-banner-karnaval-24-02.jpg?alt=media&token=28d00214-b542-4e62-b080-c9f5fd6f9e5e&_gl=1*5r53b*_ga*MTg3NjA1NzgzNS4xNjkyOTYyNzAy*_ga_CW55HF8NVT*MTY5ODkxNzY3Ni4zNC4xLjE2OTg5MTc4MzAuMzEuMC4w" alt="Image 2" />
            <p className="legend">Image 2</p>
          </div>
          <div>
            <img className='md:h-[500px]' src="https://firebasestorage.googleapis.com/v0/b/basicchat-c83b5.appspot.com/o/blog-banner-karnaval-24-02.jpg?alt=media&token=28d00214-b542-4e62-b080-c9f5fd6f9e5e&_gl=1*5r53b*_ga*MTg3NjA1NzgzNS4xNjkyOTYyNzAy*_ga_CW55HF8NVT*MTY5ODkxNzY3Ni4zNC4xLjE2OTg5MTc4MzAuMzEuMC4w" alt="Image 3" />
            <p className="legend">Image 3</p>
          </div>
        </Carousel>
      </div>

      {/* Map */}
      <div>

      </div>
    </Fragment>
  )
}
