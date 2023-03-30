import React, { Component } from "react";
/// Link
import { NavLink } from "react-router-dom";
/// Scroll
import PerfectScrollbar from "react-perfect-scrollbar";
/// Menu
import MetisMenu from "metismenujs";

const sideBar = [
   { url: '/dashboard', title: 'Dashboard', class: 'flaticon-381-home-2' },
   { url: '/device', title: 'Devices', class: 'flaticon-381-smartphone-5' },
   { url: '/send-message', title: 'Campaigns', class: 'flaticon-381-send-1' },
   { url: '/welcome-template', title: 'Welcome Messages', class: 'flaticon-381-note' },
   { url: '/auto-reply', title: 'Auto Reply', class: 'flaticon-381-send' },
   { url: '/templates', title: 'Templates', class: 'flaticon-381-notepad-1' },
   { url: '/contacts', title: 'Contacts', class: 'flaticon-381-user-7' },
   { url: '/unsubscribers', title: 'Unsubscribers', class: 'flaticon-381-user-8' },
   { url: '/report', title: 'Report', class: 'flaticon-381-list-1' },
   { url: '/number-filter', title: 'Number Filter', class: 'flaticon-381-list-1' },
   { url: '/group-grabber', title: 'Group Grabber', class: 'flaticon-381-internet' },
   { url: '/feedback', title: 'Feedback', class: 'flaticon-381-help-1' },
   { url: '/setting', title: 'Setting', class: 'flaticon-381-settings-6' },
];

class MM extends Component {
   componentDidMount() {
      this.$el = this.el;
      this.mm = new MetisMenu(this.$el);
   }
   componentWillUnmount() {
      this.mm("dispose");
      console.log(this.mm);
   }
   render() {
      return (
         <div className="mm-wrapper">
            <ul className="metismenu" ref={(el) => (this.el = el)}>
               {this.props.children}
            </ul>
         </div>
      );
   }
}



class SideBar extends Component {
   /// Open menu
   componentDidMount() {
      // sidebar open/close
      var btn = document.querySelector(".nav-control");
      var aaa = document.querySelector("#main-wrapper");

      function toggleFunc() {
         return aaa.classList.toggle("menu-toggle");
      };
      btn.addEventListener("click", toggleFunc);
   }

   render() {
      /// Path
      let path = window.location.pathname;
      path = path.split("/");
      path = path[path.length - 1];
      return (
         <div className="deznav bg-black">
            <PerfectScrollbar className="deznav-scroll">
               <MM className="metismenu" id="menu">
                  {sideBar.map(val =>
                     <li className={`${path === val.url ? "mm-active" : "nav-link"}`} key={val.title}>
                        <NavLink to={val.url} className="ai-icon">
                           <i id="icon" className={val.class}></i>
                           <span className="nab-text nav-text">{val.title}</span>
                        </NavLink>
                     </li>
                  )}
               </MM>
               <div className="copyright">
                  <p>
                     <strong>Goyral Button Sender</strong> ©All Rights Reserved
                  </p>
                  <p>By <a href="https://hpwebmart.com/" target="_blank"  rel="noreferrer"> Hpwebmart</a></p>
               </div>
            </PerfectScrollbar>
         </div>
      );
   }
}

export default SideBar;
