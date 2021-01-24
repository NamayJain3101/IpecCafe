import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, FormControl, FormGroup, FormLabel, Image, ListGroup, ListGroupItem, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Rating from '../Components/Rating'
import { createProductReview, listProductDetails } from '../Actions/ProductActions'
import Loader from '../Components/Loader'
import Message from '../Components/Message'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'
import Meta from '../Components/Meta'

const ProductScreen = ({ match, history }) => {

    const [rating, setRating] = useState(0);
    const [qty, setQty] = useState(1);
    const [comment, setComment] = useState('');

    const dispatch = useDispatch();

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productReviewCreate = useSelector(state => state.productReviewCreate)
    const { loading: loadingProductReview, error: errorProductReview, success: successProductReview } = productReviewCreate

    useEffect(() => {
        if (successProductReview) {
            setRating(0)
            setComment('')
            dispatch({
                type: PRODUCT_CREATE_REVIEW_RESET
            })
        }
        dispatch(listProductDetails(match.params.id))
    }, [dispatch, match, successProductReview])

    const addToCartHandler = () => {
        history.push(`/cart/${match.params.id}?qty=${qty}`)
    }

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(createProductReview(match.params.id, {
            rating,
            comment
        }))
    }

    return (
        <React.Fragment>
            <Link className='btn btn-primary my-3' to='/'>
                Go Back
            </Link>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <React.Fragment>
                    <Meta title={product.name} />
                    <Row>
                        <Col md={6}>
                            <Image src={product.image} alt={product.name} fluid />
                        </Col>
                        <Col md={3}>
                            <ListGroup variant='flush' className='text-justify'>
                                <ListGroupItem>
                                    <h3>{product.name}</h3>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Rating value={product.rating} text={`${product.numReviews} Reviews`} />
                                </ListGroupItem>
                                <ListGroupItem>
                                    Price: &#8377;{product.price}
                                </ListGroupItem>
                            </ListGroup>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <ListGroup variant='flush'>
                                    <ListGroupItem>
                                        <Row>
                                            <Col>Price: </Col>
                                            <Col><strong>&#8377;{product.price}</strong></Col>
                                        </Row>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <Row>
                                            <Col>Status: </Col>
                                            <Col>
                                                {product.countInStock ? "Available" : "Not available"}
                                            </Col>
                                        </Row>
                                    </ListGroupItem>
                                    {product.countInStock && (
                                        <ListGroupItem>
                                            <Row>
                                                <Col>Qty</Col>
                                                <Col>
                                                    <Form.Control as='select' value={qty} onChange={(e) => setQty(e.target.value)}>
                                                        {[...Array(10).keys()].map(x => (
                                                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                        ))}
                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroupItem>
                                    )}
                                    <ListGroupItem>
                                        <Button
                                            className='btn-block'
                                            type='button'
                                            disabled={product.countInStock === false}
                                            onClick={addToCartHandler}
                                        >
                                            Add To Cart
                                    </Button>
                                    </ListGroupItem>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                    <Row className='my-3'>
                        <Col md={6}>
                            <h2>Reviews</h2>
                            {product.reviews.length === 0 && <Message>No Reviews</Message>}
                            <ListGroup variant='flush' style={{ maxHeight: '50vh', overflow: 'auto' }}>
                                {product.reviews.map(review => (
                                    <ListGroupItem key={review._id}>
                                        <strong>{review.name}</strong>
                                        <Rating value={review.rating} />
                                        <p>{review.createdAt.substring(0, 10)}</p>
                                        <p>{review.comment}</p>
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                            <ListGroup variant='flush'>
                                <ListGroupItem>
                                    <h2>Write a Review</h2>
                                    {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}
                                    {loadingProductReview && <Loader />}
                                    {userInfo ? (
                                        <Form onSubmit={submitHandler}>
                                            <FormGroup controlId='rating'>
                                                <FormLabel>Rating: </FormLabel>
                                                <FormControl as='select' value={rating} onChange={(e) => setRating(e.target.value)}>
                                                    <option value=''>Select...</option>
                                                    <option value='1'>1 - Poor</option>
                                                    <option value='2'>2 - Fair</option>
                                                    <option value='3'>3 - Good</option>
                                                    <option value='4'>4 - Very Good</option>
                                                    <option value='5'>5 - Excellent</option>
                                                </FormControl>
                                            </FormGroup>
                                            <FormGroup controlId='comment'>
                                                <FormLabel>Comment: </FormLabel>
                                                <FormControl as='textarea' row='3' value={comment} onChange={(e) => setComment(e.target.value)} />
                                            </FormGroup>
                                            <Button type='submit' variant='primary'>Submit</Button>
                                        </Form>
                                    ) : <Message>Please <Link to='/login'>Login</Link> to write a Review</Message>}
                                </ListGroupItem>
                            </ListGroup>
                        </Col>
                    </Row>
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

export default ProductScreen
