import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import swal from "sweetalert";
// import { nanoid } from "nanoid";
// import xlsx from "xlsx";
// import Moment from "moment";
// import { format } from "date-fns";

// import { useDispatch, useSelector } from "react-redux";
import { useDispatch} from "react-redux";
// import { CopyToClipboard } from "react-copy-to-clipboard";
// import { CSVLink } from "react-csv";

import {
  Row,
  Col,
  Card
} from "react-bootstrap";

import {
    getProfile,
 } from '../../../store/actions/AuthActions';

 import axiosInstance from '../../../services/AxiosInstance';
 

const FeedbackPage = ({ props, history }) => {
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({message:""});

  // const profile = useSelector((state) => state.auth.profile);

  useEffect(() => {
    dispatch(getProfile());
}, [dispatch]);


  const onSubmit = async (event)=> {
    event.preventDefault();  

    try {
			
        const { data } = await axios.post(
           "http://localhost:5000/api/app/feedback",
           { message:message }
        );


    if(data.status === false){
       //toast.error(data.message);
     swal('Submit Feedback', data.message,"error");

    }else{
       //toast.success(data.message);
     swal('Submit Feedback', data.message, "success");
     setMessage("");

    }
     }catch (error) {
        swal('Submit Feedback', error,"error");
     }

  }

  return (
    <>
      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header>
              <Card.Title className="mr-auto p-2">Feedback</Card.Title>
            </Card.Header>
            <Card.Body>

            <form onSubmit={onSubmit}>


            <div className="form-row">
                                             <div className="form-group col-md-6">
                                                <label>Message</label>
                                                <textarea rows="5" type="text" value={message}  className="form-control"  autocomplete="off"
														name="message" required="required"
                                          onChange={(e) =>
                                             setMessage(e.target.value)
                                          }
														placeholder="Enter Message"
													/>
                                                {errors.message && <div className="text-danger fs-12">{errors.message}</div>}
                                         </div>
                                             <div className="form-group col-md-6">
                                               
                                             </div>
                                          </div>

								
                                          <button
                                             className="btn btn-primary"
                                             type="submit"
                                          >
                                             Add
                                          </button>
								
                                     
								
							</form>


            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default FeedbackPage;
