import React, {useState,useEffect ,Fragment } from "react";
import { Modal,Table, Pagination,Dropdown,Spinner } from "react-bootstrap";

// import PageTitle from "../../layouts/PageTitle";

import { useDispatch } from "react-redux";

import { Link } from "react-router-dom";

import axiosInstance from '../../../services/AxiosInstance';
import swal from "sweetalert";

import { format } from "date-fns";

import {
  getProfile,
} from '../../../store/actions/AuthActions';


//const Orders = () => {
const Vouchers = ({ props, history }) => {

   const dispatch = useDispatch();
   const [campaigns, setCampaigns] = useState([]);
   const [loading, setLoading] = useState(false);
   const [errors, setErrors] = useState({name:"",counter:"",qautity:""});

   const [name, setName] = useState("");
   const [counter, setCounter] = useState("");
   const [qauntity, setQauntity] = useState("");

  //  const [type, setType] = useState("all");
  //  const [message, setMessage] = useState("");
   const [addCampaignModal, setAddCampaignModal] = useState(false);

   const sort = 500;
   let pagination = Array(Math.ceil(campaigns.length / sort))
   .fill()
   .map((_, i) => i + 1);

   const [activePage, setActivePage] = useState(0);
   const [tableData, setTableData] = useState([]);
  
  
   useEffect(() => {
		loadCampaigns();
	}, [dispatch]);


   useEffect(() => {

      if(campaigns){
         setLoading(false);
         setTableData( campaigns.slice(
            activePage * sort,
            (activePage + 1) * sort
         ));
      }
     
	}, [campaigns]);


   const loadCampaigns = async () => {

      const { data } = await axiosInstance.post(
         "agent/voucher-campaigns"
       );
 
       if(data.status){
         setCampaigns(data.campaigns);
       }
   }

   
     //const [demo, setdemo] = useState();
     const onClick = (i) => {
      console.log("onClick - "+i);
      setActivePage(i);
      setTableData(campaigns.slice(
         i * sort,
         (i + 1) * sort
      ));
   };


   const onCreateCampaign = async (event) => {
      event.preventDefault();

      try {
			
         const { data } = await axiosInstance.post(
            "agent/create-voucher-campaign",
            { name:name,counter:counter,qauntity:qauntity }
         );
 
 
     if(data.status === false){
        //toast.error(data.message);
      swal('Create Campaign', data.message,"error");
 
     }else{
        //toast.success(data.message);
      setAddCampaignModal(false);
      swal('Create Campaign', data.message, "success");
      setName("");
      setCounter("");
      setQauntity("");
      loadCampaigns();
      dispatch(getProfile());
 
     }
      }catch (error) {
         swal('Create Campaign', error,"error");
      }

   }

   const onView = async (campaign) => {
      history.push("/voucher-codes/"+campaign.id);
   }

   return (

      <>
      
      <Modal
        
        className="modal fade"
        show={addCampaignModal}
        onHide={setAddCampaignModal}
      >
        <div className="" role="document">
          <div className="">
            <form onSubmit={onCreateCampaign}>
              <div className="modal-header">
                <h4 className="modal-title fs-20">Create Campaign</h4>
                <button
                  type="button"
                  className="close"
                  onClick={() => setAddCampaignModal(false)}
                >
                  <span>×</span>
                </button>
              </div>
              <div className="modal-body">
                <i className="flaticon-cancel-12 close"></i>
                <div className="add-contact-box">
                <div className="add-contact-content">

                <div className="form-group mb-3">
                            <label className="text-black font-w500">Name</label>
                            <div className="contact-name">
                              <input
                                type="text"
                                value={name}
                                className="form-control"
                                autocomplete="off"
                                name="title"
                                required="required"
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Name"
                              />
                              {errors.name && (
                                <div className="text-danger fs-12">
                                  {errors.name}
                                </div>
                              )}

                              <span className="validation-text"></span>
                            </div>
                          </div>


                <div className="form-group mb-3">
                            <label className="text-black font-w500">Counters</label>
                            <div className="contact-name">
                              <input
                                type="number"
                                value={counter}
                                className="form-control"
                                autocomplete="off"
                                name="title"
                                required="required"
                                onChange={(e) => setCounter(e.target.value)}
                                placeholder="Counter"
                              />
                              {errors.counter && (
                                <div className="text-danger fs-12">
                                  {errors.counter}
                                </div>
                              )}

                              <span className="validation-text"></span>
                            </div>
                          </div>


                        <div className="form-group mb-3">
                            <label className="text-black font-w500">Qautity</label>
                            <div className="contact-name">
                              <input
                                type="number"
                                value={qauntity}
                                className="form-control"
                                autocomplete="off"
                                name="title"
                                required="required"
                                onChange={(e) => setQauntity(e.target.value)}
                                placeholder="Qautity"
                              />
                              {errors.qauntity && (
                                <div className="text-danger fs-12">
                                  {errors.qauntity}
                                </div>
                              )}

                              <span className="validation-text"></span>
                            </div>
                          </div>

                          

                     </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setAddCampaignModal(false)}
                  className="btn btn-danger"
                >
                  {" "}
                  <i className="flaticon-delete-1"></i> Discard
                </button>
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>

     

      <Fragment>
         {/* <PageTitle activeMenu="Datatable" motherMenu="Table" /> */}

      <div className="col-12">
         <div className="card">
            <div className="card-header">
               <h4 className="card-title mr-auto">Voucher Campaigns</h4>

               <Link className="btn btn-light font-w600 mr-2" onClick={()=> setAddCampaignModal(true)}>Add Campaign</Link>
				    
            </div>
            <div className="card-body">

               {loading ? <div className="text-center mt-4"><Spinner animation="border" variant="primary" /></div>:(
       
       campaigns.length === 0 ? (
        <p>No Campaign Found</p>
      ) :<Table responsive className="w-100">
       <div id="example_wrapper" className="dataTables_wrapper">
          <table id="example" className="display w-100 dataTable">
             <thead>
                <tr role="row">
                   <th>Sr No</th>
                   <th>Name</th>
                   <th>Counter</th>
                   <th>Qauntity</th>
                   <th>Date</th>
                   <td>Action</td>
                </tr>
             </thead>
             <tbody>
                {tableData.map((d, i) => (
                   <tr key={i}>

                      {/* <td ><Link to={"/user/"+d.id}>#{d.id}</Link></td> */}
                      <td >{i+1}</td> 
                     <td>{d.name}</td>
                     <td>{d.counter}</td>
                     <td>{d.qauntity}</td>
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
                                    onClick={(e) => onView(d)}
                                  >
                                    View Vouchers
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
                   <th>Name</th>
                   <th>Counter</th>
                   <th>Qauntity</th>
                   <th>Date</th>
                   <th>Action</th>
                </tr>
             </tfoot>
          </table>
          <div className="d-flex justify-content-between align-items-center mt-3">
             <div className="dataTables_info">
                Showing {activePage * sort + 1} to&nbsp;
                {campaigns.length <
                (activePage + 1) * sort
                   ? campaigns.length
                   : (activePage + 1) * sort}
                &nbsp;of {campaigns.length} entries
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

export default Vouchers;
