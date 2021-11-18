import {Fragment} from 'react';
import Cleave from 'cleave.js/react';

const CreditCardMask = () => {
  const options = { creditCard: true };

  return (
    <Fragment>
      <Cleave className='form-control' placeholder='0000 0000 0000 0000' disabled={true} options={options} id='credit-card' />
    </Fragment>
  );
};

export default CreditCardMask;
