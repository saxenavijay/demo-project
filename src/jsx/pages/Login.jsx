import React, { useState } from "react";
// image
//import logo from "../../images/logo-text.png";

import loginbg from "../../images/login-bg.png";
// import loginBanner from "../../images/logo.png";
import { Spinner } from "react-bootstrap";
import CheckAutoLogin from "../../store/selectors/CheckAutoLogin";
import onLogin from './onLogin';
function Login(props) {
  const [key, setKey] = useState('');

  return (
    <div onLoad={CheckAutoLogin} className="" style={{ background: "#17556D" }}>
      <div className="login-main-page" style={{ backgroundImage: "url(" + loginbg + ")" }}>
        <div className="row justify-content-center align-items-center p-2">
          <div className="col-md-4">
            <div className="card p-2" style={{ borderRadius: "8px" }}>
              {/* <img className="card-img-top" src={loginBanner} alt=""/> */}
              <div className="card-body">
                <form >
                  <div className="form-group">
                    <label className="mb-2 ">
                      <strong>Activation Key</strong>
                    </label>
                    <input type="text" className="form-control"
                      value={key}
                      onChange={(e) => { setKey(e.target.value) }}
                      placeholder="Enter Your Activation Key :"
                    />
                  </div>
                  <input
                    type="hidden"
                    className="custom-control-input"
                    id="basic_checkbox_1"
                    value="true"
                  />
                  <div className="text-center mt-4">
                    {props.showLoading ? <Spinner animation="border" variant="primary" /> : <button
                      type="button"
                      className="btn btn-primary btn-block"
                      onClick={() => { onLogin(key) }}
                    >
                      Activate Now
                    </button>}
                  </div>
                  {props.errorMessage && (
                    <div className='bg-red-300 text-red-900 border border-red-900 p-1 my-2 text-danger'>
                      {props.errorMessage}
                    </div>
                  )}
                  {props.successMessage && (
                    <div className='bg-green-300 text-green-900 border border-green-900 p-1 my-2'>
                      {props.successMessage}
                    </div>
                  )}
                </form>
                <div className="new-account mt-2">
                  <p className="p">
                    Don't have a Key?{" "}
                    <a className="text-primary" target="_blank" href="https://www.goyral.com/index.php" rel="noreferrer">
                      Buy Now
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
