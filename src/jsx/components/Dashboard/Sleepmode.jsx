import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Sleepmode = () => {
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
            </div>
         </div>
      </>
   );
};

export default Sleepmode;