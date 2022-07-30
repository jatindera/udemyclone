import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import Spinner from "../components/utils/Spinner";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // use context with state and dispatch
    const { state, dispatch } = useContext(Context);
    const { user } = state;

    // use router to redirect to the home page
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/user')
        }
    }, [user]);





    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            // console.log(loading);
            const response = await axios.post(`/api/login`,
                {
                    email,
                    password
                });
            console.log(response);
            setLoading(false);
            // console.log(loading)
            toast.success(response.data.msg);
            setEmail("");
            setPassword("");
            // update the state of the context
            dispatch(
                {
                    type: "LOGIN",
                    payload: response.data.user
                }
            );
            window.localStorage.setItem("user", JSON.stringify(response.data.user));
            // don't route user here rather route in the useEffect
            // router.push("/user");


        } catch (err) {
            console.error("Handled Error: ", err);
            setLoading(false);
            toast.error(err.response.data.msg);
        }
    }

    return (
        <div className="container col-md-4 offset-md-4 pb-5">
            <h5>Login</h5>
            <form onSubmit={handleSubmit}>
                <div className="form-outline mb-4">
                    <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter Email"
                        required
                    />
                </div>

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

                <div className="row mb-4">
                    <div className="col d-flex justify-content-center">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="rememberme" defaultChecked />
                            <label className="form-check-label" htmlFor="rememberme"> Remember me </label>
                        </div>
                    </div>

                    <div className="col">
                        <Link href="/forgot-password">
                            <a className="text-danger">Forgot password?</a>
                        </Link>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-block mb-4"
                    disabled={!email || !password || loading}
                >
                    {loading ? <Spinner spinnerSize="small" /> : "Login"}
                </button>

                <div className="text-center">
                    <p>
                        Not registered?
                        <Link href="/register">
                            <a className="ms-2">Register Here</a>
                        </Link>
                    </p>

                </div>
            </form>
        </div>
    );
}

export default Login;
