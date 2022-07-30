import { useContext } from 'react';
import { Context } from '../../context';
import LoginRoute from '../../components/routes/LoginRoute';

const UserIndex = () => {


    const { state, dispath } = useContext(Context);
    const { user } = state;


    return (
        <LoginRoute>
            <div>
                <h1 className="jumbotran text-center square">
                    {
                        (user) ? `Welcome ${user.name}` : 'Please login'
                    }
                </h1>
            </div>
        </LoginRoute>
    );
}
export default UserIndex;
