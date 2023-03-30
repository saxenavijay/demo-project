import React from 'react';

const Contacts = () => {
   return (
      <>
         <div className='unsubscribers'>
            <h4 className='title'>Contacts</h4>
            <hr />
            <div className='container border rounded'>
               <div className='row'>
                  <div className='col-sm-5 s-body shadow-sm border'>
                     <div className='row'>
                        <div className='col-sm-1'><input type='checkbox' /></div>
                        <div className='col-sm-2'>S.No.</div>
                        <div className='col-sm-3'>Name</div>
                        <div className='col-sm-3'>Total Contact</div>
                        <div className='col-sm-3'>Action</div>
                     </div>
                  </div>
                  <div className='col-sm-2 text-center'>
                     <button className='btn btn-danger text-white p-2 mb-2'>Replace All</button>
                     <button className='btn btn-danger text-white p-2 px-2'> &nbsp;Import All&nbsp; </button>
                  </div>
                  <div className='col-sm-5 s-body shadow-sm border'>
                     <div className='row'>
                        <div className='col-sm-4'>Sr No.</div>
                        <div className='col-sm-4'>Name</div>
                        <div className='col-sm-4'>Number</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default Contacts;