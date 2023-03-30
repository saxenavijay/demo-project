import React, { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import { connect, useDispatch } from 'react-redux';

import {
    Spinner,
  } from "react-bootstrap";

//import logo from '../../images/logo-full.png'
import Loader from './Loader/Loader';
import {
    loadingToggleAction,
    signupAction,
    signupFailedAction
} from '../../store/actions/AuthActions';

import swal from "sweetalert";

import { useAuth } from "../../providers/use-auth";

import loginbg from "../../images/login-bg.png";
//import loginbg from "../../images/login-bg-1.jpg";

import loginBanner from "../../images/logo.png";

function Register(props) {

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    let errorsObj = { email: '', password: '' };
    const [errors, setErrors] = useState(errorsObj);
    const [password, setPassword] = useState('');
    const [referCode, setReferCode] = useState('');

    //others
    const [name, setName] = useState('');

    //firebase
    const auth = useAuth();

    const dispatch = useDispatch();

    useEffect(async () => {
        dispatch(signupFailedAction(null));
        const params = getQueryParams();
        console.log("params - "+JSON.stringify(params));
        if(params){
            //console.log("params.referCode - "+params.referCode);
            //console.log("params.referCode2 - "+params["referCode"]);
            setReferCode(params.referCode??"");
        }
    }, [dispatch]);

    useEffect(async () => {
        //dispatch(signupFailedAction(null));
        if(props){
            console.log(props.match.params)
            console.log(JSON.stringify(props.match.params))
        }
       
    }, [props]);
    
    const getQueryParams = (query = null) => (query||window.location.search.replace('?','')).split('&').map(e=>e.split('=').map(decodeURIComponent)).reduce((r,[k,v])=>(r[k]=v,r),{});


    //function onSignUp(e) {
    const onSignUp = async (e) => {
        e.preventDefault();
        let error = false;
        const errorObj = { ...errorsObj };

        if (name === '') {
            errorObj.name = 'Name is Required';
            error = true;
        }

        if (email === '') {
            errorObj.email = 'Email is Required';
            error = true;
        }

        if (password === '') {
            errorObj.password = 'Password is Required';
            error = true;
        }

        setErrors(errorObj);

        if (error) return;
        dispatch(loadingToggleAction(true));

        //firebase login
        //props.showLoading = true;
        let response = await auth.signup(name,email,password);

        if(response.hasOwnProperty("message")){

        console.log("sign up error");
        console.log(response.message);
        dispatch(loadingToggleAction(false));
        dispatch(signupFailedAction(response.message));
        //swal('Sign Up Error', response.message, "error");
        //toast.error(response.message);
        //setProgress(false);
        //props.showLoading = false;
        return;
    
        }
        
        if(response.hasOwnProperty("user")){
        console.log(response.user);
        //toast.success("Sign Up Done!");
        //setProgress(false);
        //props.showLoading = false;
        const idToken = await response.user.getIdToken(true);
        dispatch(signupAction(idToken,name,email, password,phone,referCode, props.history));
        //dispatch(signUp(response.user));
        return;  
        }

        
    }
  return (
	<div className="vh-100">
		<div className="login-main-page" style={{backgroundImage:"url("+ loginbg +")"}}>
           
                
    <div className="row justify-content-center align-items-center p-2">
               <div className="col-md-4">
                  <div className="authincation-content">
                     <div className="row no-gutters">
                            <div className='col-xl-12'>
                                {/* {props.showLoading && <Loader />} */}
                                <div className="card rounded p-2">


                                <div class="card-body">

                                <div className="mb-4">
                                    <h3 className="dz-title mb-1">Sign Up</h3>
                                </div>

                                    {props.errorMessage && (
                                        <div className='bg-red-300 text-danger border border-red-900 p-1 my-2'>
                                            {props.errorMessage}
                                        </div>
                                    )}
                                    {props.successMessage && (
                                        <div className='bg-green-300 text-danger text-green-900  p-1 my-2'>
                                            {props.successMessage}
                                        </div>
                                    )}
                                    <form onSubmit={onSignUp}>
                                        <div className='form-group'>
                                            <label className='mb-1 mt-2'>
                                              <strong>Name</strong>
                                            </label>
                                            <input type='text' onChange={(e) => setName(e.target.value)} className='form-control' placeholder='Name' name='name' />
                                            {errors.name && <div className="text-danger fs-12">{errors.name}</div>}
                                        </div>

                                       
                                        <div className='form-group'>
                                            <label className='mb-1'>
                                              <strong>Email</strong>
                                            </label>
                                            <input type="email" className="form-control"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
												placeholder='Email Id'
                                            />
                                            {errors.email && <div className="text-danger fs-12">{errors.email}</div>}
                                        </div>

                                        <div className='form-group'>
                                            <label className='mb-1'>
                                              <strong>Password</strong>
                                            </label>
                                            <input type="password" className="form-control"
                                                value={password}
                                                placeholder='Password'
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                            />
                                        </div>
                                        {errors.password && <div className="text-danger fs-12">{errors.password}</div>}


                                        
                                        <div className='form-group'>
                                            <label className='mb-1 mt-2'>
                                              <strong>Phone Number</strong>
                                            </label>
                                            <input type='text' value={phone} onChange={(e) => setPhone(e.target.value)} className='form-control' placeholder='Phone Number with Country Code' name='phone' />
                                            
                                        </div>
                                        
                                        <div className='text-center mt-4'>
                                        {props.showLoading ?<Spinner animation="border" variant="primary" /> :<input type='submit' className='btn btn-primary btn-block' value="Sign Up"/>}
                                        </div>

                                        <div id="recaptcha-container" />

                                    </form>
                                    <div className='new-account mt-2'>
                                        <p className="p">
                                            Already have an account?{' '}
                                            <Link className='text-primary' to='/login'>
                                                Sign in
                                            </Link>
                                        </p>
                                    </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
  )
}

const mapStateToProps = (state) => {
    return {
        errorMessage: state.auth.errorMessage,
        successMessage: state.auth.successMessage,
        showLoading: state.auth.showLoading,
    };
};

export default connect(mapStateToProps)(Register);
