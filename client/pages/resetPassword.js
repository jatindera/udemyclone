import React from 'react'
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router'
import Spinner from '../components/utils/Spinner';
import { toast } from 'react-toastify'
import { Context } from '../context'

const resetPassword = () => {
    // use context with state and dispatch
    const { state, dispatch } = useContext(Context)

    const [isValidToken, setIsValidToken] = useState(false)
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter()
    const { resetToken } = router.query;
    console.log("reset_token", resetToken);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            // console.log(loading);
            const response = await axios.post(`/api/resetPassword`,
                {
                    password,
                    resetToken
                });
            console.log(response);

            setIsValidToken(true)
            setLoading(false);
            // console.log(loading)
            toast.success(response.data.msg);
            setPassword("");
            // update the state of the context
            dispatch(
                {
                    type: "LOGOUT"
                }
            );
            window.localStorage.removeItem('user')
            router.push('/login')
        } catch (err) {
            console.error("Handled Error: ", err);
            setLoading(false);
            setIsValidToken(false);
            setPassword("");
            toast.error(err.response.data.msg);
        }
    }


    // call the api/testRoute inside the useEffect
    useEffect(() => {
        axios.get('/api/validateToken', {
            params: {
                resetToken
            }
        }).then(res => {
            console.log(res.data.msg);
            setIsValidToken(res.data.msg)
        }).catch(err => {
            console.log("==========================")
            console.log(err.response.data);
            toast.error(err.response.data.msg);
            console.log("==========================")
        }
        )
    }
        , [resetToken]);


    return (
        // compare variable res to null
        isValidToken && (
            <div className="container col-md-4 offset-md-4 pb-5 mt-5">
                <h5>Reset Password</h5>
                <form onSubmit={handleSubmit}>
                    <div className="form-outline mb-4">
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                            required
                        />
                    </div>



                    <button
                        type="submit"
                        className="btn btn-primary btn-block mb-4"
                        disabled={!password || loading}
                    >
                        {loading ? <Spinner spinnerSize="small" /> : "Reset Password"}
                    </button>


                </form>
            </div>

        )
    )
}

export default resetPassword