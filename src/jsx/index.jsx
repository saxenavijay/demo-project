import React, { useState } from 'react'
/// React router dom
import {Routes, Route } from 'react-router-dom'
/// Css
import './index.css'
import './chart.css'
import './step.css'
/// Layout
import Nav from './layouts/nav'
import Footer from './layouts/Footer'
/// Dashboard
import Home from "./components/Dashboard/Home";
import MyProfile from "./components/Dashboard/Setting";
import Contacts from "./components/Dashboard/Contacts";
import Device from "./components/Dashboard/Device";
import History from "./components/Dashboard/History";
import WalletHistory from "./components/Dashboard/WalletHistory";
import Unsubscribers from "./components/Dashboard/Unsubscribers";
import GroupGrabber from "./components/Dashboard/GroupGrabber";
import SendMessage from "./components/Dashboard/SendMessage";
import AutoReply from './components/Dashboard/AutoReply';
import Template from './components/Dashboard/Template';
import WelcomeTemplate from './components/Dashboard/WelcomeTemplate';
import NumberFilter from './components/Dashboard/NumberFilter';
import Feedback from './components/Dashboard/Feedback';
import Messages from './components/Dashboard/Messages';
import Setting from './components/Dashboard/Setting';
import Send_Message from './components/Dashboard/Send_Message';
import Sleepmode from './components/Dashboard/Sleepmode';
/// Pages
import Registration from './pages/Registration'
import Login from './pages/Login'
import ForgotPassword from './pages/forgot-password/forgot-password'
import LockScreen from './pages/LockScreen'
import Error400 from './pages/Error400'
import Error403 from './pages/Error403'
import Error404 from './pages/Error404'
import Error500 from './pages/Error500'
import Error503 from './pages/Error503'
//Scroll To Top
import ScrollToTop from './layouts/ScrollToTop';
import MyComponent from './components/Dashboard/demo'

const Markup = () => {
  let path = window.location.pathname
  path = path.split('/')
  path = path[path.length - 1]
  let pagePath = path.split('-').includes('page')
  const [activeEvent, setActiveEvent] = useState(!path)

  const routes = [
    /// Dashboard
    { url: '', component: <Home/> },
    { url: 'dashboard', component: <Home/> },
    { url: "my-profile", component: <MyProfile/> },
    { url: "contacts", component: <Contacts/> },
    { url: "device", component: <Device/> },
    { url: "history", component: <History/> },
    { url: "wallet-history", component: <WalletHistory/> },
    { url: "unsubscribers", component: <Unsubscribers/> },
    { url: "group-grabber", component: <GroupGrabber/> },
    { url: "send-message", component: <SendMessage/> },
    { url: "report", component: <Messages/> },
    { url: "auto-reply", component: <AutoReply/> },
    { url: "templates", component: <Template/> },
    { url: "welcome-template", component: <WelcomeTemplate/> },
    { url: "number-filter", component: <NumberFilter/> },
    { url: "feedback", component: <Feedback/> },
    { url: "setting", component: <Setting/> },
    { url: "setting/send_message", component: <Send_Message/> },
    { url: "/setting/sleep-mode", component: <Sleepmode/> },
    { url: "button-sender", component: <Home/> },
    { url: "Demo", component: <MyComponent/> },
    /// pages
    { url: 'page-register', component: <Registration/> },
    { url: 'page-lock-screen', component: <LockScreen/> },
    { url: 'page-login', component: <Login/> },
    { url: 'forgot-password', component: <ForgotPassword/> },
    { url: 'page-error-400', component: <Error400/> },
    { url: 'page-error-403', component: <Error403/> },
    { url: 'page-error-404', component: <Error404/> },
    { url: 'page-error-500', component: <Error500/> },
    { url: 'page-error-503', component: <Error503/> }
  ];

  return (
       <> 
          <div
            id={`${!pagePath ? 'main-wrapper' : ''}`}
            className={`${!pagePath ? 'show' : 'mh100vh'}`}
          >
            {!pagePath && (
              <Nav
                onClick={() => setActiveEvent(!activeEvent)}
                activeEvent={activeEvent}
                onClick2={() => setActiveEvent(false)}
                onClick3={() => setActiveEvent(true)}
              />
            )}
            <div
              className={` ${!path && activeEvent ? 'rightside-event' : ''} ${
                !pagePath ? 'content-body' : ''
              }`}
            >
              <div
                className={`${!pagePath ? 'container-fluid' : ''}`}
                style={{ minHeight: window.screen.height - 60 }}
              >
                <Routes>
                  {routes.map((data, i) => (
                    <Route
                      key={i}
                      exact
                      path={`/${data.url}`}
                      element={data.component}
                    />
                  ))}
                </Routes>
              </div>
            </div>
            {!pagePath && <Footer />}
          </div>
         <ScrollToTop />
       </>
  )
}

export default Markup
