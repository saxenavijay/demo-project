import React, { useState,useEffect ,Fragment } from "react";
import { Table, Pagination,Dropdown,Spinner } from "react-bootstrap";

// import PageTitle from "../../layouts/PageTitle";

import { useDispatch } from "react-redux";

import { Link } from "react-router-dom";

import axiosInstance from '../../../services/AxiosInstance';
// import swal from "sweetalert";

import { format } from "date-fns";

import { CSVLink } from "react-csv";


//const Orders = () => {
const VoucherCodes = ({match, props, history }) => {

   const dispatch = useDispatch();
   const [vouchers, setVouchers] = useState([]);
   const [loading, setLoading] = useState(false);

    const [xlsData, setXlsData] = useState([]);

   const sort = 500;
   let pagination = Array(Math.ceil(vouchers.length / sort))
   .fill()
   .map((_, i) => i + 1);

   const [activePage, setActivePage] = useState(0);
   const [tableData, setTableData] = useState([]);
  
  
   useEffect(() => {
		
	}, [dispatch]);

  
  useEffect(() => {
   
    loadVouchers();
   
    }, [match]);


   useEffect(() => {

      if(vouchers){
         setLoading(false);
         setTableData( vouchers.slice(
            activePage * sort,
            (activePage + 1) * sort
         ));
      }
     
	}, [vouchers]);


   const loadVouchers = async () => {

      const { data } = await axiosInstance.post(
         "agent/voucher-codes",
         {
          "campaign_id":match.params.id
         }
       );
 
       if(data.status){
         setVouchers(data.vouchers);
       }
   }

   
     //const [demo, setdemo] = useState();
     const onClick = (i) => {
      console.log("onClick - "+i);
      setActivePage(i);
      setTableData(vouchers.slice(
         i * sort,
         (i + 1) * sort
      ));
   };


   const onDeactive = async (code) => {

  }

   
  const initXlsData = async () => {

    var dummy = [];
    vouchers.map((data,i)=>{
    return(dummy.push({
          sr_no:i+1,
          id:data.id,
          code:data.code,
          counter:data.counter,
          used:data.used ?"YES":"NO",
          user_id:data.userId ? data.userId.id:"",
          user_name:data.userId ? data.userId.name : "",
          user_phone:data.userId ? data.userId.phone : "",
          created_at:format(new Date(data.createdAt), "dd/MM/yyyy H:mma"),
       }))
    });
 
 
    setXlsData(dummy);
 
 
 }
 
 


   return (

      <>
      
    
     

      <Fragment>
         {/* <PageTitle activeMenu="Datatable" motherMenu="Table" /> */}

      <div className="col-12">
         <div className="card">
            <div className="card-header">
               <h4 className="card-title mr-auto">Voucher Codes</h4>

               <CSVLink
  data={xlsData}
  filename={"vouchers-"+match.params.id+".csv"}
  className="btn btn-primary"
  target="_blank"
  asyncOnClick={true}
  onClick={async (event, done) => {
   console.log("You click the link");
   await initXlsData();
   done(); // 👍🏻 You are stopping the handling of component
 }}

>
  Export
</CSVLink>
              
            </div>
            <div className="card-body">

               {loading || vouchers.length === 0 ? <div className="text-center mt-4"><Spinner animation="border" variant="primary" /></div>:(
       
       <Table responsive className="w-100">
       <div id="example_wrapper" className="dataTables_wrapper">
          <table id="example" className="display w-100 dataTable">
             <thead>
                <tr role="row">
                   <th>Sr No</th>
                   <th>Code</th>
                   <th>Counter</th>
                   <th>Is Used</th>
                   <th>User</th>
                   <th>Date</th>
                   <td>Action</td>
                </tr>
             </thead>
             <tbody>
                {tableData.map((d, i) => (
                   <tr key={i}>

                      {/* <td ><Link to={"/user/"+d.id}>#{d.id}</Link></td> */}
                      <td >{i+1}</td> 
                     <td>{d.code}</td>
                     <td>{d.counter}</td>
                     <td>{d.used? "Yes":"No"}</td>
                     
                     <td>
                      {d.userId?(
                      <>
                      {d.userId.name}
                      <br/>
                      <small>{d.userId.phone}</small>
                      </>):(<></>)}
                    </td>

                     <td>{ format(new Date(d.createdAt), "dd/MM/yyyy H:mma")}</td>

                     <td>
                              <Dropdown>
                                <Dropdown.Toggle
                                  variant=""
                                  className="table-dropdown icon-false"
                                >
                                  <svg
                                    width="24px"
                                    height="24px"
                                    viewBox="0 0 24 24"
                                    version="1.1"
                                  >
                                    <g
                                      stroke="none"
                                      strokeWidth="1"
                                      fill="none"
                                      fillRule="evenodd"
                                    >
                                      <rect
                                        x="0"
                                        y="0"
                                        width="24"
                                        height="24"
                                      ></rect>
                                      <circle
                                        fill="#000000"
                                        cx="5"
                                        cy="12"
                                        r="2"
                                      ></circle>
                                      <circle
                                        fill="#000000"
                                        cx="12"
                                        cy="12"
                                        r="2"
                                      ></circle>
                                      <circle
                                        fill="#000000"
                                        cx="19"
                                        cy="12"
                                        r="2"
                                      ></circle>
                                    </g>
                                  </svg>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item
                                    as="button"
                                    onClick={(e) => onDeactive(d)}
                                  >
                                   Deactive
                                  </Dropdown.Item>

                                
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>

                   </tr>
                ))}
             </tbody>
             <tfoot>
                <tr role="row">
                   <th>Sr No</th>
                   <th>Code</th>
                   <th>Counter</th>
                   <th>Is Used</th>
                   <th>User</th>
                   <th>Date</th>
                   <td>Action</td>
                </tr>
             </tfoot>
          </table>
          <div className="d-flex justify-content-between align-items-center mt-3">
             <div className="dataTables_info">
                Showing {activePage * sort + 1} to&nbsp;
                {vouchers.length <
                (activePage + 1) * sort
                   ? vouchers.length
                   : (activePage + 1) * sort}
                &nbsp;of {vouchers.length} entries
             </div>
             <div className="dataTables_paginate paging_simple_numbers">
                <Pagination
                   className="pagination-primary pagination-circle"
                   size="lg"
                >
                   <li
                      className="page-item page-indicator "
                      onClick={() =>
                         activePage > 1 &&
                         onClick(activePage - 1)
                      }
                   >
                      <Link className="page-link" to="#">
                         <i className="la la-angle-left" />
                      </Link>
                   </li>
                   {pagination.map((number, i) => (
                         <Pagination.Item
                         key={"page-"+i}
                         className={
                            activePage === i ? "active" : ""
                         }
                         onClick={() => onClick(i)}
                      >
                         {number}
                      </Pagination.Item>
                   ))}
                   <li
                      className="page-item page-indicator"
                      onClick={() =>
                         activePage + 1 <
                            pagination.length &&
                         onClick(activePage + 1)
                      }
                   >
                      <Link className="page-link" to="#">
                         <i className="la la-angle-right" />
                      </Link>
                   </li>
                </Pagination>
             </div>
          </div>
       </div>
    </Table>
       
              )}
       


             
         </div>
      </div>
      </div>

      </Fragment>

      </>
   );
};

export default VoucherCodes;
