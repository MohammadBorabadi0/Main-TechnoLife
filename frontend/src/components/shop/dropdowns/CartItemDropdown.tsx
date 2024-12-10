import { Cart } from '@/utils/types'
import { FC } from 'react'

interface IProps {
  cartItem: Cart
}

const CartItemDropdown: FC<IProps> = ({ cartItem }) => {
  return <div>{JSON.stringify(cartItem)}</div>
}

export default CartItemDropdown
