import moment from 'jalali-moment'
import { En_To_Fa } from '@/utils/functions'

const CopyRight = () => {
  const currentYear = moment().locale('fa').format('jYYYY')

  return (
    <div className="flex justify-center gap-4 bg-RDarkFooter py-6">
      <span>{En_To_Fa(`1391-${currentYear}`)}</span>
      <p>تمامی حقوق مادی و معنوی این سایت متعلق به تکنولایف می‌باشد.</p>
    </div>
  )
}

export default CopyRight
