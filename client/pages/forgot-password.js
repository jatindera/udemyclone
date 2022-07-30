import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { Context } from "../context"
import { useRouter } from "next/router";
import Spinner from "../components/utils/Spinner";


const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(false);
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);


    // get the state from the context
    const { state, dispatch } = useContext(Context);
    // get the use from state
    const { user } = state;
    // get the router from next/router
    const router = useRouter();
    // Use useEffect to redirect to the login page if the user is logged in
    useEffect(() => {
        console.log("User", user);
        if (user) {
            router.push("/");
        }
    }
        , [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post("/api/forgotPassword", { email });
            setSuccess(true);
            setLoading(false);
            toast.success(res.data.msg);
        }
        catch (err) {
            console.error(err);
            setSuccess(false);
            setLoading(false);
            toast.error(err.response.data.msg);
        }

    }
    return (
        <div className="container col-md-4 offset-md-4 pb-5">
            <h5>Forgot Password</h5>
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
                        type="text"
                        id="code"
                        className="form-control"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter Code"
                        hidden={!success}
                        required={success}
                    />
                </div>



                <button
                    type="submit"
                    className="btn btn-primary btn-block mb-4"
                    disabled={!email || loading}
                >
                    {loading ? <Spinner spinnerSize="small" /> : "Reset Password"}
                </button>
            </form>
        </div>
    );
}



export default ForgotPassword;
