import Image from 'next/image'

const ENamad = () => {
  return (
    <div className="flex justify-end gap-8">
      <div className="flex justify-center items-center bg-white rounded-lg size-20">
        <Image
          src="/images/footer/logo.png"
          alt="enamad.ir"
          className="object-contain size-14"
          width={100}
          height={100}
        />
      </div>
      <div className="flex justify-center items-center bg-white rounded-lg size-20">
        <Image
          src="/images/footer/download.svg"
          alt="enamad.ir"
          className="object-contain size-14"
          width={100}
          height={100}
        />
      </div>
      <div className="flex justify-center items-center bg-white rounded-lg size-20">
        <Image
          src="/images/footer/c4.webp"
          alt="enamad.ir"
          className="object-contain size-14"
          width={100}
          height={100}
        />
      </div>
      <div className="flex justify-center items-center bg-white rounded-lg size-20">
        <Image
          src="/images/footer/c5.webp"
          alt="enamad.ir"
          className="object-contain size-14"
          width={100}
          height={100}
        />
      </div>
    </div>
  )
}

export default ENamad
