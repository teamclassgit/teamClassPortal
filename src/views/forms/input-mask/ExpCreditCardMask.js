import { Fragment } from 'react'
import Cleave from 'cleave.js/react'

const ExpCreditCardMask = () => {
  const options = { date: true, delimiter: '-', datePattern: ['Y', 'm'] }
  return (
    <Fragment>
      <Cleave className='form-control' placeholder='YY-MM' disabled={true} options={options} id='date' />
    </Fragment>
  )
}

export default ExpCreditCardMask
