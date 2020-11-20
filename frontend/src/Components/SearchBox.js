import React, { useState } from 'react'
import { Button, Form, FormControl } from 'react-bootstrap'

const SearchBox = ({ history }) => {
    const [keyword, setkeyword] = useState('')

    const submitHandler = (e) => {
        e.preventDefault()
        if (keyword.trim()) {
            history.push(`/search/${keyword}`)
            setkeyword('')
        } else {
            history.push('/')
        }
    }

    return (
        <Form onSubmit={submitHandler} inline>
            <FormControl
                type='text'
                name='q'
                value={keyword}
                onChange={(e) => setkeyword(e.target.value)}
                placeholder='Search'
                className='mr-sm-2'
            />
            <Button type='submit' variant='warning' className='p-2'>Search</Button>
        </Form>
    )
}

export default SearchBox
