// @packages
import Avatar from '@components/avatar';
import PropTypes from 'prop-types';
import React from "react";
import decorationLeft from '@src/assets/images/elements/decore-left.png';
import decorationRight from '@src/assets/images/elements/decore-right.png';
import { Award } from 'react-feather';
import { Button, Card, CardBody, CardFooter } from 'reactstrap';

const CardCongratulations = ({ setConfirmation }) => {
  return (
    <Card className='card-congratulations'>
      <CardBody className='text-center'>
        <img className='congratulations-img-left' src={decorationLeft} alt='decor-left' />
        <img className='congratulations-img-right' src={decorationRight} alt='decor-right' />
        <Avatar icon={<Award size={28} />} className='shadow' color='primary' size='xl' />
        <div className='text-center'>
          <h1 className='mb-1 text-white'>Welcome back!</h1>
        </div>
      </CardBody>
      <CardFooter>
        <div className='text-center'>
          <Button.Ripple color='secondary' className='btn-submit' onClick={() => setConfirmation(false) } >
          Change this booking
          </Button.Ripple>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CardCongratulations;

CardCongratulations.propTypes = {
  setConfirmation: PropTypes.func.isRequired
};
