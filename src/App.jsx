import React, { useState, useEffect } from "react";
// import { Suspense } from "react";
//  Components
import Index from "./jsx/index";
import Login from './jsx/pages/Login';
// Style
import "./vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
import "./css/style.css";
import "./css/custom.css";
import onLogin from './jsx/pages/onLogin';

function App() {
  const [auth, setAuth] = useState(false)
  async function fetchAuth() {
    let authData = await onLogin();
    console.log(authData);
    setAuth(authData);
  }

  useEffect(() => {
    fetchAuth()
  }, [])

  if (auth) {
    return (
      <>
        <Index />
      </>
    );
  } else {
    return (
      <div className="vh-100">
        <Login />
      </div>
    );
  }
}

export default App;
