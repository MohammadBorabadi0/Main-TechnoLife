import { En_To_Fa } from '@/utils/functions'

const Contact = () => {
  return (
    <div className="flex flex-col gap-4">
      <p className="flex gap-1">
        <span>تلفن:</span>
        <span dir="ltr">{En_To_Fa(`021 - 47708000`)}</span>
        <span>-</span>
        <span dir="ltr">{En_To_Fa(`021 - 91077500`)}</span>
      </p>
      <p>ایمیل : info@technolife.ir</p>
    </div>
  )
}

export default Contact
