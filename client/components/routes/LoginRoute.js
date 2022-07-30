import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Spinner from '../utils/Spinner';
import UserNav from '../../components/nav/UserNav';

const LoginRoute = (props) => {
    const { children } = props;
    const [isLogin, setIsLogin] = useState(false);

    const router = useRouter();

    const fetchUser = async () => {
        try {
            console.log("Fetching user...");
            const { data } = await axios.get('/api/currentUser');
            const { isLogin } = data;
            console.log('Current User', isLogin);
            if (isLogin) {
                setIsLogin(true);
            }
        }
        catch (err) {
            console.error("Axios access error", err);
            setIsLogin(false);
            router.push("/login");
        }
    }

    useEffect(() => {
        console.log("Login Route. use Effect...");
        fetchUser();
    }, []);

    return (
        <>
            {
                (isLogin) ? <>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-2">
                                <UserNav />
                            </div>
                            <div className="col-md-10">{children}</div>
                        </div>
                    </div>
                </> : <Spinner spinnerSize="large" />

            }
        </>
    );
}
export default LoginRoute;
