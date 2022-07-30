import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import Spinner from "../components/utils/Spinner";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";

const Register = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { state, dispatch } = useContext(Context);
    const { user } = state;

    const router = useRouter();
    useEffect(() => {
        if (user) {
            router.push('/')
        }
    }, [user]);



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            // console.log(loading);
            const response = await axios.post(`/api/register`,
                {
                    name,
                    email,
                    password
                });
            // console.log(response);
            setLoading(false);
            console.log(loading)
            toast.success("User created successfully");
            setName("");
            setEmail("");
            setPassword("");

        } catch (err) {
            console.error(err);
            setLoading(false);
            toast.error(err.response.data.msg);
        }
    }

    return (
        <div className="container col-md-4 offset-md-4 pb-5">
            <h5>Register</h5>
            <form onSubmit={handleSubmit}>
                <div className="form-outline mb-4">
                    <input
                        type="text"
                        id="name"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter Name"
                        required
                    />
                </div>

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
                        <a href="#!">Forgot password?</a>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-block mb-4"
                    disabled={!name || !email || !password || loading}
                >
                    {loading ? <Spinner spinnerSize="small" /> : "Register"}
                </button>

                <div className="text-center">
                    <p>
                        Already registered?
                        <Link href="/login">
                            <a className="ms-2">Login Here</a>
                        </Link>
                    </p>

                </div>
            </form>
        </div>
    );
}

export default Register;
