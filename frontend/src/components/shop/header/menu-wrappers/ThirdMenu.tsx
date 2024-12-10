import { FC } from 'react'
import { SubCategory } from '@/utils/types'
import Link from 'next/link'
import { En_To_Fa } from '@/utils/functions'

interface ThirdMenuProps {
  subCategory: SubCategory | null // Specify SubCategory type
}

const ThirdMenu: FC<ThirdMenuProps> = ({ subCategory }) => {
  if (!subCategory) return null

  return (
    <section
      className="flex items-center z-10 right-[560px] w-[280px] bg-blue-50"
      style={{
        height: `calc(100vh - 135px)`,
      }}
    >
      <div
        className="overflow-auto h-[95%] space-y-10"
        style={{ width: '280px' }}
      >
        <h2 className="font-semibold text-base bg-white mx-6 px-3 py-1.5 rounded">
          {subCategory.name}
        </h2>
        <ul className="">
          {subCategory.items.map((item, index) => (
            <li key={index}>
              <Link
                href="#"
                className="relative block ml-8 pl-3 pr-8 py-3 rounded-l-lg text-RMain hover:text-RSlate font-semibold transition duration-50"
              >
                {En_To_Fa(item)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default ThirdMenu
