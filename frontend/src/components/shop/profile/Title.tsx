'use client'

import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC } from 'react'

interface IProps {
  title: string
  nested?: boolean
  url?: string
}

const Title: FC<IProps> = ({ title, nested, url }) => {
  const router = useRouter()

  return (
    <>
      {/* Title */}
      <div className="flex gap-4 border-b">
        {nested && url && (
          <button className="text-RYellow" onClick={() => router.push(url)}>
            <ChevronRight />
          </button>
        )}
        <h2 className="border-b-[3px] border-red-500 font-semibold w-fit pb-2">
          {title}
        </h2>
      </div>
    </>
  )
}

export default Title
