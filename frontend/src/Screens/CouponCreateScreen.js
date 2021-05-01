import React, { useState } from 'react'
import { useEffect } from 'react'
import { Button, Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import FormContainer from '../Components/FormContainer'
import Loader from '../Components/Loader'
import Message from '../Components/Message'
import { createCoupon } from '../Actions/couponActions'
import { COUPON_CREATE_RESET } from '../constants/couponConstants'
import Toggle from 'react-toggle'
import "../reactToggle.css"

const CouponCreateScreen = ({ history }) => {

    const [code, setCode] = useState('')
    const [discountType, setDiscountType] = useState('flat')
    const [discountAmount, setDiscountAmount] = useState('')
    const [discountUpto, setDiscountUpto] = useState('')
    const [minAmountRequired, setMinAmountRequired] = useState('')

    const toggleDiscountType = (e) => {
        const toggle = e.target.checked
        if (toggle) {
            setDiscountType('upto')
        } else {
            setDiscountType('flat')
        }
    }

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const couponCreate = useSelector(state => state.couponCreate)
    const { loading, success, error } = couponCreate

    const dispatch = useDispatch()

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            history.push('/')
        }
        if (success) {
            history.push('/admin/couponlist')
            dispatch({
                type: COUPON_CREATE_RESET
            })
        }
    }, [dispatch, history, userInfo, success])


    const createCouponHandler = () => {
        dispatch(createCoupon({
            code,
            discountType,
            discountUpto,
            discountAmount,
            minAmountRequired
        }))
    }

    return (
        <React.Fragment>
            <Link to='/admin/couponlist' className='btn btn-light my-3'>Go back</Link>
            <FormContainer>
                <h1>Create Coupon</h1>
                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                    <Form onSubmit={createCouponHandler}>
                        <FormGroup controlId='code'>
                            <FormLabel>Code: </FormLabel>
                            <FormControl type='name' placeholder='Code' value={code} onChange={(e) => setCode(e.target.value)}></FormControl>
                        </FormGroup>
                        <div className='mb-3 d-flex align-items-center justify-content-center'>
                            <label htmlFor='toggleDiscountType' className='m-0 mx-3'>{'flat'.toUpperCase()}</label>
                            <Toggle
                                id='toggleDiscountType'
                                className='toggle-custom'
                                icons={false}
                                onChange={(e) => toggleDiscountType(e)}
                            />
                            <label htmlFor='toggleDiscountType' className='m-0 mx-3'>{'upto'.toUpperCase()}</label>
                        </div>
                        <FormGroup controlId='amount'>
                            <FormLabel>{discountType === 'flat' ? "Discount Amount" : "Discount percent"}: </FormLabel>
                            <FormControl type='number' placeholder='Discount Amount' value={discountAmount} onChange={(e) => setDiscountAmount(e.target.value)}></FormControl>
                        </FormGroup>
                        {discountType === 'upto' && (
                            <FormGroup controlId='upto'>
                                <FormLabel>Discount Upto: </FormLabel>
                                <FormControl type='number' placeholder='Discount Upto' value={discountUpto} onChange={(e) => setDiscountUpto(e.target.value)}></FormControl>
                            </FormGroup>
                        )}
                        <FormGroup controlId='upto'>
                            <FormLabel>Min amount required: </FormLabel>
                            <FormControl type='number' placeholder='Min amount Required' value={minAmountRequired} onChange={(e) => setMinAmountRequired(e.target.value)}></FormControl>
                        </FormGroup>
                        <Button type='submit' variant='primary'>
                            Create
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </React.Fragment>
    )
}

export default CouponCreateScreen