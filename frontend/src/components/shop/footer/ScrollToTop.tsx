'use client'

import { ChevronUp } from 'lucide-react'
import AppButton from '@/components/shop/shared/AppButton'

const ScrollToTop = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AppButton
      variant="primary"
      size="large"
      className="flex gap-8 font-normal"
      onClick={scrollToTop}
    >
      <span>بازگشت به بالا</span>
      <ChevronUp />
    </AppButton>
  )
}

export default ScrollToTop
