import React from 'react';

const GroupGrabber = () => {
   return (
      <>
         <div className='unsubscribers'>
            <h4 className='title'>Group Grabber</h4>
            <hr />
            <div className='container border rounded'>
            <div className='row mb-2'>
               <form>
                  <select className='p-1 rounded'>
                     <option className='form-control py-3'>Select Instance</option>
                  </select>{" "}&nbsp;
                  <input type="submit" className="btn btn-danger py-2 px-3" value="Fetch Groups"/>
               </form>
            </div>
               <div className='row'>
                  <div className='col-sm-5 s-body shadow-sm border'>
                     <div className='row'>
                        <div className='col-sm-1'><input type='checkbox' /></div>
                        <div className='col-sm-2'>S.No.</div>
                        <div className='col-sm-4'>Name</div>
                        <div className='col-sm-5'>Total Members</div>
                     </div>
                  </div>
                  <div className='col-sm-2 text-center'>
                     <button className='btn btn-danger text-white p-1 mb-2 px-3'>Replace All</button>
                     <button className='btn btn-danger text-white p-1 px-3'> &nbsp;&nbsp;Import All&nbsp;&nbsp; </button>
                  </div>
                  <div className='col-sm-5 s-body shadow-sm border'>
                     <div className='row'>
                        <div className='col-sm-6'>Sr No.</div>
                        <div className='col-sm-6'>Number</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default GroupGrabber;