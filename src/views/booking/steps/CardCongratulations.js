import { Award } from 'react-feather'
import Avatar from '@components/avatar'
import {Button, Card, CardBody, CardFooter, CardText, Col} from 'reactstrap'
import decorationLeft from '@src/assets/images/elements/decore-left.png'
import decorationRight from '@src/assets/images/elements/decore-right.png'
import React from "react"

const CardCongratulations = ({firstName, stepper}) => {
  return (
    <Card className='card-congratulations'>
      <CardBody className='text-center'>
        <img className='congratulations-img-left' src={decorationLeft} alt='decor-left' />
        <img className='congratulations-img-right' src={decorationRight} alt='decor-right' />
        <Avatar icon={<Award size={28} />} className='shadow' color='primary' size='xl' />
        <div className='text-center'>
          <h1 className='mb-1 text-white'>Congratulations {firstName}!</h1>
          <CardText className='m-auto w-75'>
            Your event is confirmed.
          </CardText>
        </div>
      </CardBody>
      <CardFooter>
        <div className='text-center'>
        <Button.Ripple color='secondary' className='btn-submit' onClick={() => stepper.to(1)} >
          Change my booking
        </Button.Ripple>
        </div>
      </CardFooter>
    </Card>
  )
}

export default CardCongratulations
