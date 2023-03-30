import React from 'react';

const Unsubscribers = () => {
  return (
    <>
      <div className='unsubscribers'>
        <h4 className='title'>Unsubscribers</h4>
        <hr />
        <div className='container s-body border'>
          <div className='row shadow-sm rounded'>
            <div className='col-sm-1 py-2'>Sr No.</div>
            <div className='col-sm-5 py-2'>Name</div>
            <div className='col-sm-5 py-2'>Number</div>
            <div className='col-sm-1 py-2'>Action</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Unsubscribers;