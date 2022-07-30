import React from 'react'
import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { Context } from '../context'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

const TopNav = () => {
    const [current, setCurrent] = useState('')

    // use context with state and dispatch
    const { state, dispatch } = useContext(Context)
    const { user } = state

    const router = useRouter()

    useEffect(() => {
        (process.browser) && setCurrent(window.location.pathname)
    }, [process.browser && window.location.pathname])

    const logout = async () => {
        try {
            /*
            1. Delete cookies from server side
            2. Delete local storage from client side
            3. Delete user from the context
            */
            const response = await axios.get('/api/logout')
            toast.success(response.data.msg)
            dispatch({
                type: 'LOGOUT'
            })
            window.localStorage.removeItem('user')
            router.push('/')
        }
        catch (err) {
            console.error(err)
            toast.error(err.response.data.msg)
        }
    }


    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Navbar</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link href="/">
                                    <a className="nav-link active" aria-current="page">Home</a>
                                </Link>
                            </li>

                            {
                                user === null && (
                                    <>
                                        <li className="nav-item">
                                            <Link href="/register">
                                                <a className="nav-link">Register</a>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link href="/login">
                                                <a className="nav-link">Login</a>
                                            </Link>
                                        </li>
                                    </>
                                )
                            }
                        </ul>
                        {
                            user != null && (
                                <>
                                    <ul className="navbar-nav mb-2 mb-lg-0 ms-auto">

                                        <li className="nav-item dropdown">
                                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                {user.name}
                                            </a>
                                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                <li><Link href="#"><a className="dropdown-item" onClick={logout}>Logout</a></Link></li>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li><Link href="/user"><a className="dropdown-item">Dashboard</a></Link></li>

                                            </ul>
                                        </li>
                                    </ul>
                                </>
                            )
                        }

                    </div>
                </div>
            </nav >
            <h1 className='jumbotron text-center bg-primary'>Online Education Marketplace</h1>

        </>
    )
}

export default TopNav