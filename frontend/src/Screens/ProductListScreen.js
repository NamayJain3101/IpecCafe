import React, { useEffect } from 'react'
import { FaPlus, FaTimes } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../Components/Loader'
import Message from '../Components/Message'
import { Button, Col, Row } from 'react-bootstrap'
import { createProduct, deleteProduct, listProducts } from '../Actions/ProductActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'
import Paginate from '../Components/Paginate'
import styled from 'styled-components'
import { TiTick } from 'react-icons/ti'
import { Link } from 'react-router-dom'

const ProductListScreen = ({ history, match }) => {
    const dispatch = useDispatch()

    const pageNumber = match.params.pageNumber || 1

    const productList = useSelector(state => state.productList)
    const { loading, error, products, pages, page } = productList

    const productDelete = useSelector(state => state.productDelete)
    const { loading: loadingDelete, success: successDelete, error: errorDelete } = productDelete

    const productCreate = useSelector(state => state.productCreate)
    const { loading: loadingCreate, success: successCreate, error: errorCreate, product: createdProduct } = productCreate

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        dispatch({
            type: PRODUCT_CREATE_RESET
        })
        if (!userInfo.isAdmin) {
            history.push('/login')
        }
        if (successCreate) {
            history.push(`/admin/product/${createdProduct._id}/edit`)
        } else {
            dispatch(listProducts('', pageNumber))
        }
    }, [dispatch, userInfo, history, successDelete, successCreate, createdProduct, pageNumber])

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure?')) {
            dispatch(deleteProduct(id))
        }
    }

    const createProductHandler = () => {
        dispatch(createProduct())
    }

    return (
        <React.Fragment>
            <Row className='align-items-center'>
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className='text-right'>
                    <Button className='my-3' onClick={createProductHandler}>
                        <FaPlus /> Create Product
                    </Button>
                </Col>
            </Row>
            {loadingDelete && <Loader />}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
            {loadingCreate && <Loader />}
            {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <React.Fragment>
                    <ProductWrapper>
                        {products.map(product => {
                            return (
                                <div key={product._id} className='product'>
                                    <div className='id py-2 px-3 bg-dark text-light'>{product._id}</div>
                                    <div className='productproducts'>
                                        <div>
                                            <img src={product.image} alt={product.name} className='img-fluid' />
                                        </div>
                                    </div>
                                    <div className='price mb-3'>Name: {product.name}</div>
                                    <div className='price mb-3'>Price: <span>&#8377;{product.price}</span></div>
                                    <div className='price mb-3'>Category: {product.category}</div>
                                    <div className='available row mb-3'>
                                        <Col>
                                            Available: {product.countInStock ? <TiTick fontSize='1.5rem' color='green' /> : <FaTimes fontSize='1.5rem' color='red' />}
                                        </Col>
                                    </div>
                                    <ButtonContainerWrapper>
                                        <Link to={`/admin/product/${product._id}/edit`}>
                                            <Button
                                                variant='info'
                                                style={{
                                                    fontSize: '1.2rem',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '2px',
                                                    marginRight: '1rem'
                                                }}
                                            >
                                                Edit Product
                                            </Button>
                                        </Link>
                                        <Button
                                            variant='danger'
                                            style={{
                                                fontSize: '1.2rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '2px',
                                                marginRight: '1rem'
                                            }}
                                            onClick={() => deleteHandler(product._id)}
                                        >
                                            Delete Product
                                        </Button>
                                    </ButtonContainerWrapper>
                                </div>
                            )
                        })}
                    </ProductWrapper>
                    <Paginate pages={pages} page={page} isAdmin={true} url='/admin/productlist' />
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

const ProductWrapper = styled.div`
    .product {
        margin-bottom: 2rem;
    }
    .productproducts {
        margin: 1rem auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        grid-row-gap: 1rem;
        grid-column-gap: 1rem;
    }
    .productproducts > div {
        position: relative;
        border: 1px solid black;
        overflow: hidden;
    }
    .price, .id {
        font-size: 1.2rem;
        letter-spacing: 2px;
    }
    .price > span {
        font-family: sans-serif;
        font-weight: bold;
    }
    .available {
        font-size: 1.2rem;
        letter-spacing: 2px;
        display: flex;
        align-items: center;
        justify-content: space-between;
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

export default ProductListScreen