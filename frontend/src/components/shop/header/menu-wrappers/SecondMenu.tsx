import { FC, useState } from 'react'
import { Category } from '@/utils/types'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface SecondMenuProps {
  category: Category | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onHoverSubCategory: (subCategory: any) => void // Accept a function to handle sub-category hover
}

const SecondMenu: FC<SecondMenuProps> = ({ category, onHoverSubCategory }) => {
  const [hoveredSubCategoryIndex, setHoveredSubCategoryIndex] = useState<
    number | null
  >(null)

  if (!category) return null

  return (
    <section
      className="flex items-center z-10 w-[280px] shadow-3xl bg-white"
      style={{ height: `calc(100vh - 135px)` }}
    >
      <div
        className="overflow-auto h-[95%] space-y-10"
        style={{ width: '280px' }}
      >
        <h2 className="font-semibold bg-blue-50 mx-6 px-3 py-1.5 rounded">
          {category.name}
        </h2>
        <ul className="space-y-4">
          {category.subCategories.map((subCategory, index) => (
            <li
              key={index}
              className="whitespace-nowrap text-sm font-semibold"
              onMouseEnter={() => {
                setHoveredSubCategoryIndex(index)
                onHoverSubCategory(subCategory)
              }}
            >
              {typeof subCategory === 'string' ? (
                <Link
                  href="#"
                  className={`relative block ml-8 pl-3 pr-8 py-3 rounded-l-lg transition duration-50 hover:text-RSlate ${hoveredSubCategoryIndex === index && 'bg-blue-50'}`}
                >
                  {subCategory}
                </Link>
              ) : (
                <>
                  <Link
                    href="#"
                    className={`relative flex items-center ml-8 pl-3 pr-8 py-3 rounded-l-lg transition duration-50 hover:text-RSlate ${hoveredSubCategoryIndex === index && 'bg-blue-50'}`}
                  >
                    {subCategory.name}
                    {hoveredSubCategoryIndex === index && (
                      <ChevronLeft
                        size={18}
                        className={`absolute left-1 transform -translate-y-1/2 top-1/2 text-RBlue`}
                      />
                    )}
                  </Link>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default SecondMenu
