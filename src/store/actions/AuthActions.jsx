import {
    formatError,
    login,
    runLogoutTimer,
    saveTokenInLocalStorage,
    signUp,
    profile
} from '../../services/AuthService';

import swal from "sweetalert";

export const SIGNUP_CONFIRMED_ACTION = '[signup action] confirmed signup';
export const SIGNUP_FAILED_ACTION = '[signup action] failed signup';
export const LOGIN_CONFIRMED_ACTION = '[login action] confirmed login';
export const LOGIN_FAILED_ACTION = '[login action] failed login';
export const LOADING_TOGGLE_ACTION = '[Loading action] toggle loading';
export const LOGOUT_ACTION = '[Logout action] logout action';
export const PROFILE_ACTION = '[login action] profile';



export function signupAction(idToken,name,email, password,phone,referCode, history) {
    return (dispatch) => {
        signUp(idToken,name,email, password,phone,referCode)
        .then((response) => {

            //console.log(JSON.stringify(req.body));

            console.log("signUp token - "+ response.data.token);
            console.log("signUp response data - "+JSON.stringify(response.data));

            if(response.data.status){

                console.log("signUp status true");

                console.log("signUp get timestamp");
                var date = new Date(); // Now
                date.setDate(date.getDate() + 30); // Set now + 30 days as the new date
                var timestamp = date.getTime();

                console.log("token expire at "+timestamp);

                response.data.expireDate = date;
                saveTokenInLocalStorage(response.data);
               
                // runLogoutTimer(
                //     dispatch,
                //     timestamp,
                //     //response.data.expiresIn * 1000,
                //     history,
                // );

                console.log("redirect to dashboard");
                dispatch(confirmedSignupAction(response.data));
                //history.push('/dashboard');

                if(response.data.user.status == "deactive"){
                    swal('Sign Up', "Your Agent account is created, After activation you can use your agent dashboard.", "success");
                    history.push('/login');
                }else{
                    history.push('/dashboard');
                }
               

            }else{
                console.log("signUp status false");
                const errorMessage = response.data.message;
                dispatch(signupFailedAction(errorMessage));
            }
        })
        .catch((error) => {
            console.log("signUp error - "+JSON.stringify(error));
            const errorMessage = error.response.data.message;
            //const errorMessage = formatError(error.response.data);
            dispatch(signupFailedAction(errorMessage));
        });
    };
}

export function getProfile() {
    return (dispatch) => {
        profile()
        .then((response) => {
            console.log("getProfile response data - "+JSON.stringify(response.data));
            if(response.data.status){
                dispatch(profileAction(response.data.user));
            }            

        })};
}

const getQueryParams = (query = null) => (query||window.location.search.replace('?','')).split('&').map(e=>e.split('=').map(decodeURIComponent)).reduce((r,[k,v])=>(r[k]=v,r),{});

export function logout(history) {
    console.log("logout start");
    localStorage.removeItem('userDetails');
    const params = new URLSearchParams();
    console.log("params - "+JSON.stringify(params));

    //var query = getQueryParams(); //window.location.search;
    //console.log("query - "+JSON.stringify(query));

    var pathname = window.location.pathname;
    console.log("pathname - "+pathname);

    if(pathname == "/sign-up"){
        history.push({pathname:'/sign-up',search: window.location.search});
    }else{
        history.push({pathname:'/login',search: window.location.search});
    }
    

    return {
        type: LOGOUT_ACTION,
    };
}

export function loginAction(idToken, name, email,history) {
    return (dispatch) => {
        login(idToken, name,email)
            .then((response) => {

                if(response.data.status){

                console.log("login get timestamp");
                var date = new Date(); // Now
                date.setDate(date.getDate() + 30); // Set now + 30 days as the new date
                var timestamp = date.getTime();

                console.log("login token expire at "+timestamp);
                response.data.expireDate = date;

                saveTokenInLocalStorage(response.data);

                // runLogoutTimer(
                //     dispatch,
                //     timestamp,
                //     //response.data.expiresIn * 1000,
                //     history,
                // );

                dispatch(loginConfirmedAction(response.data));
				history.push('/dashboard');
				//window.location.reload();
                
				//history.pushState('/index');

                }else{
                    console.log("login error - "+response.data.message);
                    const errorMessage = response.data.message;
                    //const errorMessage = formatError(error.response.data);
                    dispatch(loginFailedAction(errorMessage));
                }
                
            })
            .catch((error) => {
                console.log("login error - "+JSON.stringify(error));
                const errorMessage = error.response.data.message;
                //const errorMessage = formatError(error.response.data);
                dispatch(loginFailedAction(errorMessage));
            });
    };
}


export function profileAction(data) {
    return {
        type: PROFILE_ACTION,
        payload: data,
    };
}

export function loginFailedAction(data) {
    return {
        type: LOGIN_FAILED_ACTION,
        payload: data,
    };
}

export function loginConfirmedAction(data) {
    return {
        type: LOGIN_CONFIRMED_ACTION,
        payload: data,
    };
}

export function confirmedSignupAction(payload) {
    return {
        type: SIGNUP_CONFIRMED_ACTION,
        payload,
    };
}

export function signupFailedAction(message) {
    return {
        type: SIGNUP_FAILED_ACTION,
        payload: message,
    };
}

export function loadingToggleAction(status) {
    return {
        type: LOADING_TOGGLE_ACTION,
        payload: status,
    };
}
