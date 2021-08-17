import React, { useRef, useState } from 'react'
import { Button, Card, Form, Alert } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import './index.css'

export default function SignUp(props) {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match')
        }

        try {
            setError('')
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value)
            history.push("/")
        } catch {
            setError('Failed to sign up')
        }
        setLoading(false)
    }

    return (
        <>
            <Card style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: 'none', borderRadius: '10px', paddingTop: '60px' }}>
                <Card.Body>
                    <h2 className="text-center mb-4" style={{ color: '#5161D4' }}>Sign Up</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control typee="email" ref={emailRef} required />
                        </Form.Group>
                        <Form.Group id="password" style={{ marginTop: '12px' }}>
                            <Form.Label>Password</Form.Label>
                            <Form.Control typee="password" ref={passwordRef} required />
                        </Form.Group>
                        <Form.Group id="password-confirm" style={{ marginTop: '12px' }}>
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control typee="password" ref={passwordConfirmRef} required />
                        </Form.Group>
                        <Button className="w-100 mt-3" type="submit" disabled={loading} style={{ background: '#5161D4' }}>Sign Up</Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Already have an account? <Link to='/login' style={{ color: '#5161D4' }}>Log In</Link>
            </div>
        </>
    )
}