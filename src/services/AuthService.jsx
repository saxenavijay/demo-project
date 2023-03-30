import axios from 'axios';
import swal from "sweetalert";
import {
    loginConfirmedAction,
    logout,
} from '../store/actions/AuthActions';

export function signUp(idToken,name,email, password,phone,referCode) {
    //axios call

    const config = {
        header: {
          "Content-Type": "application/json",
        },
      };

    const postData = {
        "id_token":idToken,
        "name":name,
        "email":email,
        "phone":phone,
        "password":password,
        "refer_code":referCode.toUpperCase(),
        "return_secure_token":true,
        "auth_type":"email",
        "role":"agent"
    };

    return axios.post(
        `/api/auth/sign-up`,
        postData,
        config
    );
}

export function login(idToken,name,email) {
    
    const postData = {
        "id_token":idToken,
        "name":name,
        "email":email,
        "auth_type":"email",
        "returnSecureToken": true,
    };

    const config = {
        header: {
          "Content-Type": "application/json",
        },
      };

    return axios.post(
        `/api/auth/login`,
        postData,
        config
    );
}


export function profile() {
    
    

    const config = {
        header: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      };

    return axios.get(
        `/api/auth/profile`,
        config
    );
}

export function formatError(errorResponse) {
    switch (errorResponse.error.message) {
        case 'EMAIL_EXISTS':
            //return 'Email already exists';
            swal("Oops", "Email already exists", "error");
            break;
        case 'EMAIL_NOT_FOUND':
            //return 'Email not found';
           swal("Oops", "Email not found", "error",{ button: "Try Again!",});
           break;
        case 'INVALID_PASSWORD':
            //return 'Invalid Password';
            swal("Oops", "Invalid Password", "error",{ button: "Try Again!",});
            break;
        case 'USER_DISABLED':
            return 'User Disabled';

        default:
            return '';
    }
}

export function saveTokenInLocalStorage(tokenDetails) {

    // tokenDetails.expireDate = new Date(
    //     new Date().getTime() + tokenDetails.expiresIn * 1000,
    // );
    
    localStorage.setItem('userDetails', JSON.stringify(tokenDetails));
}

export function runLogoutTimer(dispatch, timer, history) {
    console.log("runLogoutTimer start");

    // Set a fake timeout to get the highest timeout id
    var highestTimeoutId = setTimeout(";");
    for (var i = 0 ; i < highestTimeoutId ; i++) {
        clearTimeout(i); 
    }

    // setTimeout(() => {
    //     console.log("runLogoutTimer time complete - "+timer);
    //     dispatch(logout(history));
    // }, timer);
    setTimeout(() => {
        console.log("runLogoutTimer after 2 sec");
    setTimeout(
        function() {
                console.log("runLogoutTimer time complete - "+timer);
                dispatch(logout(history));
        }
        .bind(this),
        timer
    )

}, 2 * 1000); //after 2 second

}

export function checkAutoLogin(dispatch, history) {

    console.log("checkAutoLogin");

    const tokenDetailsString = localStorage.getItem('userDetails');
    let tokenDetails = '';
    if (!tokenDetailsString) {
        console.log("tokenDetailsString is null & logout");
        dispatch(logout(history));
        return;
    }

    tokenDetails = JSON.parse(tokenDetailsString);
    let expireDate = new Date(tokenDetails.expireDate);
    let todaysDate = new Date();

    console.log("expireDate - "+tokenDetails.expireDate);

    if (todaysDate > expireDate) {
        console.log("todaysDate > expireDate & logout");
        //console.log("logout");
        dispatch(logout(history));
        return;
    }else{
        console.log("todaysDate < expireDate & login");
        console.log("login success");
    }

    console.log("login details - "+JSON.stringify(tokenDetails));


    if(tokenDetails.user.status){
        if(tokenDetails.user.status == "active"){
            console.log("user status is active");
            dispatch(loginConfirmedAction(tokenDetails));
        }else{
            console.log("user status is not active");
        }
    }else{
        console.log("user status not found");
        dispatch(loginConfirmedAction(tokenDetails));
    }

    

    const timer = expireDate.getTime() - todaysDate.getTime();
    console.log("checkAutoLogin timer - "+timer);
    //runLogoutTimer(dispatch, timer, history);
}
