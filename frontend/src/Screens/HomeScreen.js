import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import Product from '../Components/Product'
import { listProducts } from '../Actions/ProductActions'
import Loader from '../Components/Loader'
import Message from '../Components/Message'
import Paginate from '../Components/Paginate'
import ProductCarousel from '../Components/ProductCarousel'
import Meta from '../Components/Meta'
import { Link } from 'react-router-dom'

const HomeScreen = ({ match }) => {
    const keyword = match.params.keyword
    const pageNumber = match.params.pageNumber || 1

    const dispatch = useDispatch();

    const productList = useSelector(state => state.productList)
    const { loading, error, products, pages, page } = productList

    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber))
    }, [dispatch, keyword, pageNumber])

    return (
        <React.Fragment>
            <Meta />
            {!keyword ? <ProductCarousel /> : <Link to='/' className='btn btn-primary'>Go Back</Link>}
            <h1>Latest Products</h1>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <React.Fragment>
                    <Row>
                        {products.map(product => {
                            return (
                                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                    <Product product={product} />
                                </Col>
                            )
                        })}
                    </Row>
                    <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

export default HomeScreen