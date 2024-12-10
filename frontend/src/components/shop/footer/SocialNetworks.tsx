import Image from 'next/image'

const SocialNetworks = () => {
  return (
    <div className="space-y-4 bg-white text-black font-semibold text-base p-5 rounded-xl">
      <p>شبکه های اجتماعی</p>
      <div className="flex items-center gap-6">
        <Image
          src="images/static_instagram.svg"
          alt="instagram-techno"
          width={30}
          height={30}
        />
        <Image
          src="images/static_aparat.svg"
          alt="aparat-techno"
          width={30}
          height={30}
        />
        <Image
          src="images/static_telegram.svg"
          alt="telegram-techno"
          width={30}
          height={30}
        />
        <Image
          src="images/static_youtube.svg"
          alt="youtube-techno"
          width={30}
          height={30}
        />
      </div>
    </div>
  )
}

export default SocialNetworks
