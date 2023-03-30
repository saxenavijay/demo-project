import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import OnOffSwitch from './Switch';

const Send_Message = () => {
   return (
      <>
         <div className='unsubscribers'>
            <h4 className='title'>Setting</h4>
            <hr />
            <div className='container border rounded'>
               <div className='row'>
                  <div className='col-sm-12'>
                     <ul className='page-nav'>
                        <div className='row p-1 rounded'>
                        <li><NavLink to="/setting/send_message">Sending Messager</NavLink></li>
                        <li><NavLink to="/setting/sleep-mode">Sleep Mode</NavLink></li>
                        </div>
                        <Outlet />
                     </ul>
                  </div>
               </div>
               <div className='row'>
                  <div className='col-sm-6 mt-2'><h6 className='required text-black'><strong> Switch Account After</strong></h6></div>
                  <div className='col-sm-6'></div>
               </div>
               <OnOffSwitch/>
            </div>
         </div>
      </>
   );
};

export default Send_Message;