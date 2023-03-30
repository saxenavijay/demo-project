import React, {useState,useEffect ,Fragment } from "react";
import { Table, Pagination,Spinner } from "react-bootstrap";

// import PageTitle from "../../layouts/PageTitle";

import { useDispatch} from "react-redux";

import { Link } from "react-router-dom";

import axiosInstance from '../../../services/AxiosInstance';
// import swal from "sweetalert";

import { format } from "date-fns";

import {
	getProfile,
 } from '../../../store/actions/AuthActions';



//const Orders = () => {
const WalletHistory = ({ props, history }) => {

   const dispatch = useDispatch();
   const [historyData, setHistoryData] = useState([]);
   const [loading, setLoading] = useState(false);

   // const profile = useSelector((state) => state.auth.profile);
   

   const sort = 50;
   let pagination = Array(Math.ceil(historyData.length / sort))
   .fill()
   .map((_, i) => i + 1);

const [activePage, setActivePage] = useState(0);
const [tableData, setTableData] = useState([]);
  
  
   useEffect(() => {
      dispatch(getProfile());
		loadHistory();
	}, [dispatch]);


   useEffect(() => {

      if(historyData){
         setLoading(false);
         setTableData( historyData.slice(
            activePage * sort,
            (activePage + 1) * sort
         ));
      }
     
	}, [historyData]);


   const loadHistory = async () => {

      const { data } = await axiosInstance.post(
         "agent/wallet-history"
       );
 
       if(data.status){
         setHistoryData(data.history);
       }
   }


   //const [demo, setdemo] = useState();
   const onClick = (i) => {
      console.log("onClick - "+i);
      setActivePage(i);
      setTableData(historyData.slice(
         i * sort,
         (i + 1) * sort
      ));
   };





   function textColor(history){

      const type = history.type;

      if(type === "commission"){
         return "text-success";
      }else if(type === "redeem"){
         return "text-warning";
      }else{
         return "";
      }

   }

   
   return (

      <Fragment>
         {/* <PageTitle activeMenu="Datatable" motherMenu="Table" /> */}

      <div className="col-12">
         <div className="card">
            <div className="card-header">
               <h4 className="card-title mr-auto">Wallet History</h4>

               

            </div>
            <div className="card-body">

               {loading ? <div className="text-center mt-4"><Spinner animation="border" variant="primary" /></div>:(
       
       historyData.length === 0 ? <p>No History Found</p> :<Table responsive className="w-100">
       <div id="example_wrapper" className="dataTables_wrapper">
          <table id="example" className="display w-100 dataTable">
             <thead>
                <tr role="row">
                   <th>Sr No</th>
                   <th>Type</th>
                   <th>Amount</th>
                   <th>Order Amount</th>
                   <th>Discount</th>
                   <th>Date</th>
                   
                </tr>
             </thead>
             <tbody>
                {tableData.map((d, i) => (
                   <tr key={d.id}>

                     <td>{i+1}</td>
                      <td>{d.type.toUpperCase()}</td>
                      <td><strong className={textColor(d)}><i class="fa fa-inr" aria-hidden="true"></i> {d.amount}</strong></td>
                      <td><i class="fa fa-inr" aria-hidden="true"></i> {d.totalAmount}</td>
                      <td>{d.discount} %</td>
                      <td>{ format(new Date(d.createdAt), "dd/MM/yyyy H:mma")}</td>
                      
                   </tr>
                ))}
             </tbody>
             <tfoot>
                <tr role="row">
                   <th>Sr No</th>
                   <th>Type</th>
                   <th>Amount</th>
                   <th>Order Amount</th>
                   <th>Discount</th>
                   <th>Date</th>

                </tr>
             </tfoot>
          </table>
          <div className="d-flex justify-content-between align-items-center mt-3">
             <div className="dataTables_info">
                Showing {activePage * sort + 1} to&nbsp;
                {historyData.length <
                (activePage + 1) * sort
                   ? historyData.length
                   : (activePage + 1) * sort}
                &nbsp;of {historyData.length} entries
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
                         key={i}
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
   );
};

export default WalletHistory;
