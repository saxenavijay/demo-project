import React, {  useRef,useState,useEffect ,Fragment } from "react";
import { Table, Pagination, Badge,Dropdown,Spinner,Modal,Button,Row,Col,Form,ListGroup } from "react-bootstrap";

import PageTitle from "../../layouts/PageTitle";

import { useDispatch,useSelector } from "react-redux";

import { Link } from "react-router-dom";

import axiosInstance from '../../../services/AxiosInstance';
import swal from "sweetalert";

import { format } from "date-fns";

import {CopyToClipboard} from 'react-copy-to-clipboard';

import {
	getProfile,
 } from '../../../store/actions/AuthActions';

 import InputEmoji from 'react-input-emoji'


 import messageTypeList from '../../../utils/message-type'


//const Orders = () => {
const Api = ({ props, history }) => {

   const dispatch = useDispatch();
   const [autoReplyData, setAutoReplyData] = useState([]);
   const [loading, setLoading] = useState(false);

   const profile = useSelector((state) => state.auth.profile);

   const [instances, setInstances] = useState([]);
   const [selectedInstance, setSelectedInstance] = useState("");
   
   const [copied, setCopied] = useState(false);
   const [copied2, setCopied2] = useState(false);
 
  
   useEffect(() => {
      dispatch(getProfile());
      loadInstance();
	}, [dispatch]);


   const loadInstance = async () => {

      const { data } = await axiosInstance.post(
         "message/instances"
       );
    
       if(data.status){                                                                                                                                                                         
         setInstances(data.inatances);
    
         if(data.inatances.length > 0){
            setSelectedInstance(data.inatances[0].code);
         }
    
       }
    }

    
   
   return (

      <>
      
     

      <Fragment>
         {/* <PageTitle activeMenu="Datatable" motherMenu="Table" /> */}

      <div className="col-12 mb-4">
         <div className="card">
            <div className="card-header">
            <div class="mr-auto">
               <h4 className="card-title">Api Documentation</h4>
            </div>


            </div>
            <div className="card-body">


            <div className="row">

            <div className="form-group col-md-4">

            
                                   

            <label>Instance Key</label>


           
            {instances.length == 0 ? (
                       
                       <p>No Instance Found</p>
                    
                   ) :<select
                                          className="form-control"
                                          id="inputState"
                                          value={selectedInstance}
                                          onChange={(e) =>
                                           setSelectedInstance(e.target.value)
                                          }
                                          //defaultValue="Choose"
                                       >

{instances.map((instance, i) => (
                                          <option value={instance.code}>
                                             {instance.code}({instance.name})
                                          </option>))}

                                          </select>}

                                          {copied?(<span className='mt-2' style={{color: 'red'}}>Instance Key Copied.</span>):""}
                                         

            </div>

            <div className="form-group col-md-2">
               
            <label></label>
            {instances.length == 0 ?<></>:<CopyToClipboard text={selectedInstance}
                                    onCopy={() => {
                                       setCopied(true);
                                       setTimeout(() => {
                                          setCopied(false);
                                        }, 1500);
                                    
                                    }}>
                                          <button className="btn btn-sm btn-light mt-5">Copy</button>
                                 </CopyToClipboard>}

                                 </div>

           



            <div className="form-group col-md-4">
                                                <label>Api Key</label>
                                                <input
                                                   type="text"
                                                   value={profile? profile.apiKey??" " : " "}
                                                   placeholder="Keyword"
                                                   className="form-control"
                                                   disabled
                        
                                                />

{copied2?(<span className='mt-2' style={{color: 'red'}}>Api Key Copied.</span>):""}
                                                
                                             </div>

                                             <div className="form-group col-md-2">
               
               <label></label>
                  <CopyToClipboard text={profile? profile.apiKey??" " : " "}
                                       onCopy={() => {
                                          setCopied2(true);
                                          setTimeout(() => {
                                             setCopied2(false);
                                           }, 1500);
                                       
                                       }}>
                                            <button className="btn btn-sm btn-light mt-5">Copy</button>
                                    </CopyToClipboard>
   
                                    </div>
   

            </div>

             
         </div>

        {/*  <hr/> */}

        <div className="row px-4">

        <div className="col-md-12"><hr/> </div>

            <div className="col-md-12">Business Api service for sending messages, notifications, schedulers, reminders, group messages and chatbots with simple integration to make it easier to promote your business.
</div>

<div className="col-md-12 mt-4">
   
   <h3>Request</h3>
   <pre><code>POST http://goyralwhatsapp.com/api/send</code></pre>
</div>

<div className="col-md-12">


<table className="display w-100 dataTable">

                    <tbody>
                        <tr>
                            <th className="col-1 text-dark">api_key</th>
                            <td className="col-1 text-danger" >Needed</td>
                            <td>API Avavilable On Users Dashboard</td>
                            <td><pre>{profile? profile.apiKey??" " : " "}</pre></td>
                        </tr>
                      <tr>
                            <th className="col-1 text-dark">instance_key</th>
                            <td className="col-1 text-danger" >Needed</td>
                            <td>Instance Key Device Id </td>
                            <td><pre>{selectedInstance}</pre></td>
                        </tr>
                        <tr>
                            <th className="col-1 text-dark">numbers</th>
                            <td className="col-1 text-danger" >Needed</td>
                            <td>Targeted WhatsApp Number(Must With Copuntry Code Without "+")</td>
                            <td><pre>{`
[
 {
   "number":"91987654321",
   "name":"customer"
 }
]`}</pre></td>
                        </tr>
                        <tr>
                            <th className="col-1 text-dark">message</th>
                            <td className="col-1 text-danger">Needed</td>
                            <td>Your Messages</td>
                            <td><pre>Webcome to Goyral Business Api</pre></td>
                        </tr>
                        <tr>
                            <th className="col-1 text-dark">type</th>
                            <td className="col-1 text-danger">Needed</td>
                            <td>Your Message Type</td>
                            <td><pre className="text-left"> {
`
0 => 'text'
1 => 'text-with-media
2 => 'quick-reply-button'
3 => 'quick-reply-button-with-media'
4 => 'call-to-action-button'
5 => 'call-to-action-button-with-media'
6 => 'list/menu message
`}</pre></td>
                        </tr>

                        <tr>
                            <th className="col-1 text-dark">button_1</th>
                            <td className="col-1 text-danger">Type 2<br/>Type 3</td>
                            <td>Quick Reply Button 1 text</td>
                            <td><pre>Product 1</pre></td>
                        </tr>

                        <tr>
                            <th className="col-1 text-dark">button_2</th>
                            <td className="col-1 text-danger">Optional<br/>Type 2<br/>Type 3</td>
                            <td>Quick Reply Button 2 text</td>
                            <td><pre>Product 2</pre></td>
                        </tr>

                        <tr>
                            <th className="col-1 text-dark">button_3</th>
                            <td className="col-1 text-danger">Optional<br/>Type 2<br/>Type 3</td>
                            <td>Quick Reply Button 3 text</td>
                            <td><pre>Product 3</pre></td>
                        </tr>

                        <tr>
                            <th className="col-1 text-dark">footer</th>
                            <td className="col-1 text-danger">Optional<br/>Type 2<br/>Type 3<br/>Type 6</td>
                            <td>Button/Menu footer text</td>
                            <td><pre>Click on any button below</pre></td>
                        </tr>

                        <tr>
                            <th className="col-1 text-dark">call_button</th>
                            <td className="col-1 text-danger">Optional<br/>Type 4<br/>Type 5</td>
                            <td>Call To Action CALL Button text</td>
                            <td><pre>Call Now</pre></td>
                        </tr>

                        <tr>
                            <th className="col-1 text-dark">calling_number</th>
                            <td className="col-1 text-danger">Optional<br/>Type 4<br/>Type 5</td>
                            <td>Calling Number</td>
                            <td><pre>+919876543210</pre></td>
                        </tr>

                        <tr>
                            <th className="col-1 text-dark">web_url_button</th>
                            <td className="col-1 text-danger">Optional<br/>Type 4<br/>Type 5</td>
                            <td>Call To Action URL Button Text</td>
                            <td><pre>Visit Website</pre></td>
                        </tr>

                        <tr>
                            <th className="col-1 text-dark">web_url_button</th>
                            <td className="col-1 text-danger">Optional<br/>Type 4<br/>Type 5</td>
                            <td>Website Url</td>
                            <td><pre>https://bulkymarketing.com</pre></td>
                        </tr>


                        <tr>
                            <th className="col-1 text-dark">menus</th>
                            <td className="col-1 text-danger" >Optional<br/>Type 6</td>
                            <td>Menu Items List</td>
                            <td><pre>{`
[
 {
   "title":"Menu 1",
   "description":"menu 1 description"
 }
]`}</pre></td>
                        </tr>

                        <tr>
                            <th className="col-1 text-dark">middle</th>
                            <td className="col-1 text-danger">Optional<br/>Type 6</td>
                            <td>Menu middle text</td>
                            <td><pre>Buly Marketing Menus</pre></td>
                        </tr>

                        <tr>
                            <th className="col-1 text-dark">media</th>
                            <td className="col-1 text-danger">Optional<br/>Type 1<br/>Type 3<br/>Type 4</td>
                            <td>Any Media File</td>
                            <td><pre>product.jpg (min 1mb)</pre></td>
                        </tr>

                        <tr>
                            <th className="col-1 text-dark">caption</th>
                            <td className="col-1 text-danger">Optional<br/>Type 1<br/>Type 3<br/>Type 4</td>
                            <td>Send media with caption</td>
                            <td><pre>Any caption</pre></td>
                        </tr>

                    </tbody>
                          
                </table>
                </div>

                <div className="col-md-12 mt-2">
                   <h3>Response</h3>

                   <div className="code-block">
                    <pre><code>
{`{
   "status":true,
   "message":"Message sent"
}`}
                    </code></pre>
                    
                    
                    <p className="my-2">Note: <b>numbers</b> and <b>menus</b> fields in JSON Array format.</p>
                    
                     </div>

                </div>

      </div>


         
      </div>
      </div>

      </Fragment>

      </>
   );
};

export default Api;
