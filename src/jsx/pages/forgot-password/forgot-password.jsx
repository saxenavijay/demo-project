import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button,Form,Row,Col,Nav,Tab,Tabs,TabContainer,TabContent,TabPane,Spinner} from "react-bootstrap";
import swal from "sweetalert";

import { useAuth } from "../../../providers/use-auth";

import axios from "axios";

import { ForgotPasswordContainer } from "./style";


import loginbg from "../../../images/login-bg.png";
import loginBanner from "../../../images/logo.png";

const ForgotPasswordPage = ({from,match, history}) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");

  const [progress, setProgress] = useState(false);
  const auth = useAuth();

  const [success, setSuccess] = useState(false);


  if(auth.user){
    //history.push(`/my-account`);
  }
 
  const onDone = async (e) => {
	e.preventDefault();
	setProgress(false);
	setSuccess(false);
	setEmail("");

  }

  const sendResetMail = async (e) => {

	e.preventDefault();
	setProgress(true);


	const config = {
		header: {
		  "Content-Type": "application/json",
		},
	  };

	  try {
		//axios.post("/api/auth/signIn",fd,config);
		const { data } = await axios.post(
		  "/api/auth/forgotPassword",
		  { email:email,url:"https://agent.pvc2print.com" },
		  config
		);

		setProgress(false);

		if(!data.status){
			
			swal('Send Reset Email', data.message,"error");
		}else{
			setSuccess(true);
		}
		

	  } catch (error) {
		setProgress(false);
		//setError(error.response.data.error);
		swal('Send Reset Email', error.response.data.error,"error");
		setEmail("");
		setTimeout(() => {
		  //setError("");
		}, 5000);
	  }

	/* e.preventDefault();
	setProgress(true);

	console.log("setNewPassword");

	let response = await auth.sendPasswordResetEmail(email);

    if(response){
		setMainSent(true);
		toast("Password reset code sent on "+email);
		setProgress(false);
		return;
	}else{
		toast.error("Password reset code send failed!");
		setProgress(false);
	} */

  };

 
  return (
	  <ForgotPasswordContainer style={{ background: "#17556D" }}>
      <div className="" style={{background:"#17556D"}}>
		<div className="login-main-page" style={{backgroundImage:"url("+ loginbg +")"}}>
          
		  <div className="row justify-content-center align-items-center p-2">
            <div className="col-md-4">
              <div className="card p-2" style={{ borderRadius: "8px" }}>
                <img className="card-img-top" src={loginBanner} alt="" />

                <div className="card-body">
                  <div className="mb-1">
                   

					{!success ? (<div className="title-text">
					<h3 className="login-title mb-4">Forgot Password</h3>

							<p>Please enter the email address you register your account with. We
            will send you reset password confirmation to this email</p>
						</div>):(<div className="title-text">
						<h3 className="login-title mb-4 text-primary">Password Reset Email Sent</h3>

						<p>An email has been sent to your email address {email}. Follow the direction in the email to reset your password.</p>
						</div>)}

                  </div>

                  <div className="content">
						
						

					

						
{!success ?(<Form onSubmit={sendResetMail}>

						
		     <Form.Group controlId="formEmail mt-4">

			 <label className="mb-2 ">
                                          <strong>Mail Id</strong>
                                        </label>

                <Form.Control className="main" type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Form.Group>

             


							{progress? <div className="text-center"><Spinner animation="border" variant="primary" /></div> : 
              <Button variant="primary" type="submit" className="btn btn-primary btn-block">
                Confirm
              </Button>}

			 
			  

						</Form>):(

							<Button variant="primary" onClick={onDone} type="button" className="mt-4 btn btn-primary btn-block">
                Done
              </Button>

						)}


								<div className="new-account mt-2 text-center">
                                  <p className="p">
								  Already have an account?{" "}
                                    <Link className="text-primary" to="./login">
                                      Login
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
</ForgotPasswordContainer>
);
};

export default ForgotPasswordPage;