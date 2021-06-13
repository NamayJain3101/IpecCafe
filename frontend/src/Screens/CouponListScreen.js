import React, { useEffect } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { FaPlus } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { listCoupons, deleteCoupon } from '../Actions/couponActions'
import Loader from '../Components/Loader'
import Message from '../Components/Message'

const CouponListScreen = ({ history }) => {

    const couponList = useSelector(state => state.couponList)
    const { coupons, loading, error } = couponList

    const couponDelete = useSelector(state => state.couponDelete)
    const { success: successDelete, loading: loadingDelete, error: errorDelete } = couponDelete

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const dispatch = useDispatch()

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            history.push('/')
        } else {
            dispatch(listCoupons())
        }
    }, [dispatch, history, userInfo, successDelete])

    const deleteCouponHandler = (id) => {
        if (window.confirm('Are you sure?')) {
            dispatch(deleteCoupon(id))
        }
    }

    const createCouponHandler = () => {
        history.push('/admin/couponlist/create')
    }

    return (
        <React.Fragment>
            <Row className='align-items-center'>
                <Col>
                    <h1>Coupons</h1>
                </Col>
                <Col className='text-right'>
                    <Button className='my-3' onClick={createCouponHandler}>
                        <FaPlus /> Create Coupon
                    </Button>
                </Col>
            </Row>
            {loading || loadingDelete ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : errorDelete ? <Message variant='danger'>{errorDelete}</Message> : (
                <React.Fragment>
                    <CouponWrapper>
                        {coupons.map(coupon => {
                            return (
                                <div key={coupon._id} className='coupon'>
                                    <div className='id py-2 px-3 mb-3 bg-dark text-light'>{coupon._id}</div>
                                    <Button variant='success' style={{ borderRadius: '0' }} className='mb-3 price'>Code: {coupon.code}</Button>
                                    <div className='mb-3 price'>Discount Type: <span className="text-uppercase">{coupon.discountType}</span></div>
                                    <div className='mb-3 price'>Valid Till: <span className="text-uppercase">{new Date(coupon.expiry).toDateString()} {new Date(coupon.expiry).toLocaleTimeString()}</span></div>
                                    {coupon.discountType.toLowerCase() === 'flat' ? (
                                        <div className='mb-3 price'>Discount: &#8377;{coupon.discountAmount}</div>
                                    ) : (
                                        <div className='mb-3 price'>Discount: {coupon.discountAmount}% upto &#8377;{coupon.discountUpto}</div>
                                    )}
                                    <div className='mb-3 price'>Min amount required: &#8377;{coupon.minAmountRequired}</div>
                                    <ButtonContainerWrapper>
                                        <Button
                                            variant='danger'
                                            style={{
                                                fontSize: '1.2rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '2px',
                                                marginRight: '1rem'
                                            }}
                                            onClick={() => deleteCouponHandler(coupon._id)}
                                        >
                                            Delete coupon
                                        </Button>
                                    </ButtonContainerWrapper>
                                </div>
                            )
                        })}
                    </CouponWrapper>
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

const CouponWrapper = styled.div`
    .coupon {
        margin-bottom: 2rem;
    }
    .price, .id {
        font-size: 1.2rem;
        letter-spacing: 2px;
    }
`

const ButtonContainerWrapper = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    margin-bottom: 4rem;
    button {
        border-radius: 0
    }
`

export default CouponListScreen
