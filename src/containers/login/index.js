import React, { useRef, useState } from 'react'
import { Button, Card, Form, Alert } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import {Link, useHistory} from 'react-router-dom'
import './index.css'

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { login } = useAuth()
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError('')
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            history.push("/")
        } catch {
            setError('Failed to sign in')
        }
        setLoading(false)
    }

    return (
        <>
            <Card style={{display: 'flex', justifyContent: 'center', alignItems: 'center', border: 'none', borderRadius: '10px', paddingTop: '60px'}}>
                <Card.Body>
                    <h2 className="text-center mb-4" style={{ color: '#5161D4'}}>Log In</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control typee="email" ref={emailRef} required />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control typee="password" ref={passwordRef} required />
                        </Form.Group>
                        <Button className="w-100 mt-3" type="submit" disabled={loading} style={{ background: '#5161D4' }}>Login</Button>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )
}