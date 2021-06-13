import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer>
            <Container>
                <Row>
                    <Col className='text-center py-3'>
                        Copyright &copy; IPEC CAFE
                        <br />
                        <Link to='/contact-us'>Contact Us</Link>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer
