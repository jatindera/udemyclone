import { useReducer, createContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from 'next/router'

//initial state of the context for user
const initialState = {
    user: null
};

//create context
const Context = createContext();

// create reducer
// responsible for updating the state of the context and access data from the state
const reducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                user: action.payload
            };
        case "LOGOUT":
            return {
                ...state,
                user: null
            };
        default:
            return state;
    }
};

// create provider
// responsible for providing the context to the components
const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const router = useRouter()
    //useEffect to update the state from the local storage
    useEffect(() => {
        const user = JSON.parse(window.localStorage.getItem("user"));
        if (user) {
            dispatch({
                type: "LOGIN",
                payload: user
            });
        }
    }
        , []);

    // axios interceptor to logout the user if the token is expired
    axios.interceptors.response.use(
        response => {
            return response;
        }
        , error => {
            if (error.response.status === 401
                && response.config
                && !response.config.__isRetryRequest) {
                return new promise((resolve, reject) => {
                    // clear cookies
                    axios.get('/api/logout')
                        .then((data) => {
                            console.log('AXIOS automatically logout', data)
                            // clear context
                            dispatch({
                                type: "LOGOUT"
                            });
                            // clear local storage
                            window.localStorage.removeItem('user');
                            router.push('/login');
                            resolve(response);
                        })
                        .catch(err => {
                            console.log("Axios interceptor error ", err)
                            reject(error);
                        });
                });
            }
            return Promise.reject(error);
        }
    );



    //useEffect for interceptor to get csfr token
    useEffect(() => {
        const getCsrfToken = async () => {
            console.log("going to make a request to get csrf token")
            const { data } = await axios.get('/api/csrfToken')
            // console.log("CSRF", data)
            axios.defaults.headers.common['X-CSRF-TOKEN'] = data.csrfToken;
        };
        getCsrfToken();
    }, []);




    return <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>;
}

export { Context, Provider };


