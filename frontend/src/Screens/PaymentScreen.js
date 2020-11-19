import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Col, Form, FormCheck, FormGroup, FormLabel } from 'react-bootstrap'
import FormContainer from '../Components/FormContainer'
import { savePaymentMethod } from '../Actions/cartActions'
import CheckoutSteps from '../Components/CheckoutSteps'

const PaymentScreen = ({ history }) => {

    const [paymentMethod, setPaymentMethod] = useState('PayPal')

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod({
            paymentMethod
        }))
        history.push('/placeorder')
    }

    return (
        <FormContainer >
            <CheckoutSteps step1 step2 step3 />
            <h1> Payment Method </h1>
            <Form onSubmit={submitHandler}>
                <FormGroup>
                    <FormLabel as='legend' > Select Method </FormLabel>
                    <Col>
                        <FormCheck type='radio'
                            label='PayPal or Credit Cart'
                            id='PayPal'
                            name='paymentMethod'
                            value='PayPal'
                            onChange={(e) => setPaymentMethod(e.target.value)} >
                        </FormCheck>
                        <FormCheck type='radio'
                            label='Cash'
                            id='Cash'
                            name='paymentMethod'
                            value='Cash'
                            onChange={(e) => setPaymentMethod(e.target.value)} >
                        </FormCheck>
                        <FormCheck type='radio'
                            label='Wallet'
                            id='wallet'
                            name='paymentMethod'
                            value='Wallet'
                            onChange={(e) => setPaymentMethod(e.target.value)} >
                        </FormCheck>
                    </Col>
                </FormGroup>
                <Button type='submit' variant='primary'>
                    Continue
                </Button>
            </Form>
        </FormContainer>
    )
}

export default PaymentScreen