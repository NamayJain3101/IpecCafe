import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import styled from 'styled-components'

const ContactUsPage = () => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [feedback, setFeedback] = useState("")

    return (
        <ContactUsWrapper>
            <section className="feedback-container">
                <h1>Contact Us</h1>
                <form
                    className="feedback-form"
                    action={`https://formspree.io/f/mgerykoo`}
                    method="POST"
                >
                    <div className="form-group">
                        <label htmlFor="name">Name: </label>
                        <input type='text' required value={name} name='name' id='name' className='form-control' onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email: </label>
                        <input type='email' required value={email} name='email' id='email' className='form-control' onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Mobile Number: </label>
                        <input type='tel' required pattern="[6-9][0-9]{9}" value={phone} name='phone' id='phone' className='form-control' onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="feedback">Feedback: </label>
                        <textarea rows={3} required value={feedback} name='feedback' id='feedback' className='form-control' onChange={(e) => setFeedback(e.target.value)} />
                    </div>
                    <Button variant="success" className="w-100 mt-3 submitButton" type="submit">Send Feedback</Button>
                </form>
            </section>
        </ContactUsWrapper>
    )
}

const ContactUsWrapper = styled.div`
    .feedback-container {
        padding: 1rem 0 0 0;
        width: clamp(300px, 100%, 700px);
        margin: auto;
    }

    .feedback-form {
        width: 100%;
        margin: 0 auto 3rem auto;
    }

    .form-group {
        text-transform: capitalize;
    }

    .form-group label {
        /* display: block; */
        letter-spacing: var(--mainSpacing);
        margin-bottom: 0.5rem;
        font-size: 1.1em;
    }

    .form-control{
        background: white;
        outline: 1px solid black;
        padding: 3px 8px;
        font-size: 1em;
        border-radius: 0;
    }

    .submitButton {
        padding: 6px 12px;
        font-size: 1.2em;
        border-radius: 0;
    }
`

export default ContactUsPage
