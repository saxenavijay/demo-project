import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { nanoid } from "nanoid";
import xlsx from "xlsx";
import Moment from "moment";
import { format } from "date-fns";

import { useDispatch, useSelector } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CSVLink } from "react-csv";
import { database } from "../../../providers/use-auth";

import {
  Row,
  Col,
  Card,
  Table,
  Badge,
  Dropdown,
  Modal,
  ProgressBar,
  Button,
  Spinner,
  ListGroup,
} from "react-bootstrap";

/// imge
import avatar1 from "../../../images/avatar/1.jpg";
import avatar2 from "../../../images/avatar/2.jpg";
import avatar3 from "../../../images/avatar/3.jpg";

import whatsapp from "../../../images/qr.png";


import {
  inviteMemberAction,
  bulkInviteMemberAction,
  cancelInvitationAction,
  getInvitationsAction,
  resetAllAction,
} from "../../../store/actions/MemberActions";

import { getProfile } from "../../../store/actions/AuthActions";

import axiosInstance from "../../../services/AxiosInstance";

import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import axios from "axios";

const DevicePage = ({ props, history }) => {
  const [addInstance, setAddInstance] = useState(false);
  const dispatch = useDispatch();
  const [qr, setQr] = useState("");
  const [qrcode, setQrcode] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [qrTemplate, setQrTemplate] = useState(false);

  const [name, setName] = useState("");
  const [instancename, setInstancename] = useState("");
  const [activecode, setActivecode] = useState("");

  const [changeNameModal, setChangeNameModal] = useState(false);

  const profile = useSelector((state) => state.auth.profile);

  const [instances, setInstances] = useState([]);

  let errorsObj = { name: "" };
  const [errors, setErrors] = useState(errorsObj);

  const [selectedDevice, setSelectedDevice] = useState("");
  const [listener, setListener] = useState(null);


  const loadInstance = async () => {
    const { data } = await axios.post("http://localhost:5000/api/message/instances");
    if (data.status) {
      setInstances(data.inatances);

      data.inatances.map((instance) => {
        initQRListener(instance._id, data.inatances);
      });
    }
  };

  useEffect(() => {
    loadInstance();
  }, [instances]);

  useEffect(() => {
    loadInstance();
  }, [selectedDevice]);

  useEffect(() => { }, [profile]);

  const onGetQR = async (id, userId) => {
    setQrTemplate(true);
    setSelectedDevice(id);
    console.log("selected id - " + id)
    const { data } = await axios.post("http://localhost:5000/api/message/qr-instance", {
      instance_id: id,
      user_id: userId
    });
    if (data.status) {
      //setCampaigns(data.campaigns);
      setQrcode(data.qrcode);
    } else {
      setQrcode("");
      console.log("qr not generated");
    }
  };

  const onLogout = async (id,userId,name) => {
    setSelectedDevice(id);
    console.log("selected id - " + id)
    const { data } = await axios.post("http://localhost:5000/api/message/logout-instance", {
      instance_id: id,
      user_id:userId,
      name:name
    });

    if (data.status) {
      //setCampaigns(data.campaigns);
      console.log("logout success");
      swal("Logout", data.message, "success");
    } else {
      console.log("logout failed");
      swal("Logout", data.message, "error");
    }
  };

  const onDeleteInstance = async (id) => {

    const { data } = await axios.post("http://localhost:5000/api/message/delete-instance", {
      instance_id: id,
    });
    console.log(data);
    if (data.status) {
      //setCampaigns(data.campaigns);
      swal(data.message, "Instance Deleted..!", "success");
    } else {
      console.log("logout failed");
    }
  };

  function onChangeName(instance) {
    setActivecode(instance.code);
    setName(instance.name);
    setChangeNameModal(true);
  }

  const onSaveName = async (event) => {
    event.preventDefault();
    let error = false;
    var errorObj = {};

    if (name === "") {
      error = true;
      errorObj.name = "Name is Required";
    }

    setErrors(errorObj);
    if (!error) {
      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/message/change-instance-name",
          { name: name, code: activecode }
        );

        if (data.status === false) {
          swal("Change Instance Name", data.message, "error");
        } else {
          setChangeNameModal(false);
          swal("Change Instance Name", data.message, "success");

          setTimeout(() => {
            loadInstance();
          }, 100);
        }
      } catch (error) { }
    }
  };
  const addDevice = async (e) => {
    e.preventDefault();
    const response = await axios.post("http://localhost:5000/api/message/create-instance", { instance_name: instancename });
    console.log(response.data);
    swal(response.data.message, "In Some Moment Your Instance " + response.data.name + " Will Appear Below", "success");
    setTimeout(() => {
      setAddInstance(false);
    }, 2000)
  }

  const initQRListener = (id, inatanceList) => {
    var qrRef = database.ref("/sessions/" + id);

    // if(listener != null){
    //    qrRef.off("value", listener)
    // }

    var onDataChange = qrRef.on("value", function (snapshot) {
      //snapshot.forEach(function(childSnapshot) {

      if (snapshot) {
        var childKey = snapshot.key;
        var childData = snapshot.val();

        //console.log("data - "+childData);
        console.log("data json - " + JSON.stringify(childData));
        //console.log("data qr - "+childData.qr)



        if (childData) {

          console.log("selectedDevice - " + selectedDevice);
          console.log("childKey - " + childKey);
          console.log("status - " + childData.status ?? "");


          if (childData.qr) {
            //setQr(childData.qr);
            if (selectedDevice === childKey && childData.status === "QR") {
              setQr(childData.qr);
              console.log(childData.qr);
            } else {
              setQr("")
            }
          }

          if (childData.status) {
            //setStatus(childData.status??"Not Connected");

            if (
              selectedDevice === childKey &&
              (childData.status != "QR")
            ) {
              setQr("");
            }

            var dummy = [...inatanceList];

            const index = dummy.findIndex((x) => x.id === id);

            try {
              if (index != -1) {
                dummy[index].status = childData.status ?? "Not Ready";

                if (childData.message) {
                  dummy[index].message = childData.message ?? "";
                }

                setInstances(dummy);
              } else {
                setQr("");
              }
            } catch (e) {
              setQr("");
            }

            // if(childData.status == "authenticated"){
            //    setQr("");
            // }

          }


        }
      }

      //setQr("http://api.qrserver.com/v1/create-qr-code/?data="+encodeURI(childData.qr)+"&size=200x200&bgcolor=ffffff");

      // ...
      //});
    });

    setListener(onDataChange);
  };

  return (
    <>
      <Modal
        size="lg"
        className="modal fade"
        show={addInstance}
        onHide={setAddInstance}
      >
        <div className="" role="document">
          <div className="">
            <form onSubmit={addDevice}>
              <div className="modal-header">
                <h4 className="modal-title fs-20">Add Instance</h4>
                <button
                  type="button"
                  className="close"
                  onClick={() => setAddInstance(false)}
                >
                  <span>×</span>
                </button>
              </div>
              <div className="modal-body">
                <i className="flaticon-cancel-12 close"></i>
                <div className="add-contact-box">
                  <div className="add-contact-content">
                    <div className="form-group mb-3">
                      <label className="text-black font-w500">Instance Name</label>
                      <div className="contact-name">
                        <input
                          type="text"
                          className="form-control"
                          autocomplete="off"
                          name="name"
                          required="required"
                          onChange={(e) => setInstancename(e.target.value)}
                          placeholder="Instance Name"
                        />
                        {errors.name && (
                          <div className="text-danger fs-12">{errors.name}</div>
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
                  onClick={() => setAddInstance(false)}
                  className="btn btn-danger"
                >
                  {" "}
                  <i className="flaticon-delete-1"></i> Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
      <Modal
        className="modal fade"
        show={changeNameModal}
        onHide={setChangeNameModal}
      >
        <div className="" role="document">
          <div className="">
            <form onSubmit={onSaveName}>
              <div className="modal-header">
                <h4 className="modal-title fs-20">Edit User</h4>
                <button
                  type="button"
                  className="close"
                  onClick={() => setChangeNameModal(false)}
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
                          name="name"
                          required="required"
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Name"
                        />
                        {errors.name && (
                          <div className="text-danger fs-12">{errors.name}</div>
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
                  onClick={() => setChangeNameModal(false)}
                  className="btn btn-danger"
                >
                  {" "}
                  <i className="flaticon-delete-1"></i> Discard
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>

      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header>
              <Card.Title className="mr-auto p-2">Whatsapp Instant</Card.Title>
              <h4 className="me-5"><button className='btn btn-info' onClick={() => setAddInstance(true)}>Create Instance</button></h4>
              <div className="d-flex justify-content-end"></div>
            </Card.Header>
            <Card.Body>
              {instances.length === 0 ? (
                <p>No Instance Found</p>
              ) : (
                <Table responsive>
                  <thead>
                    <tr>
                      <th><strong>Name</strong></th>
                      <th><strong>Number</strong></th>
                      <th><strong>Instance Status</strong></th>
                      <th className="ps-5"><strong>Action</strong></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {instances.map((instance, i) => (
                      <tr key={instance.code}>
                        <td>{instance.name ?? ""}</td>
                        <td><strong className="text-info">{instance.number ?? ""}</strong></td>
                        <td>
                          <div className="">
                            {instance.status ?? ""}
                            <br />
                            <small>{instance.message ?? ""}</small>
                          </div>
                        {/* {instance.status !== "OR Generated" ? setQrTemplate(false) : setQrTemplate(true)} */}
                        </td>
                        <td>
                          {instance.status !== "Ready" ? (
                            <Button
                              className="btn btn-success font-w600 mr-2"
                              onClick={() => onGetQR(instance._id, instance.userId)}
                            >
                              Show QR
                            </Button>
                          ) : (
                            <Button
                              className="btn btn-primary font-w600 mr-2"
                              onClick={() => onLogout(instance._id,instance.userId,instance.name)}
                            >
                              Logout
                            </Button>
                          )} {" "}
                          <Button className="btn btn-primary p-2 border-1"><i className="flaticon-381-edit-1" onClick={(e) => onChangeName(instance)}></i></Button>&nbsp;&nbsp;
                          <Button className="btn btn-danger p-2 border-1"><i className="flaticon-381-trash-1" onClick={() => onDeleteInstance(instance._id)}></i></Button>
                        </td>
                        <td></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Modal
          className="qr-modal"
          show={qrTemplate}
          onHide={setQrTemplate}
        >
          <div className="modal-header">
            <h4 className="modal-title fs-20">For Login Whatsapp You Have To Do:</h4>
            <button
              type="button"
              className="close"
              onClick={() => setQrTemplate(false)}
            >
              <span>×</span>
            </button>
          </div>
          <div className="modal-body">
            <Row>
              <Col lg={5} className="text-center">
                {qrcode !== "" ? (
                  <img className="img" src={qrcode} alt="h" height={250} width={250} />
                ) : (
                  <img className="img img-fluid" src={whatsapp} alt="not found" />
                )}
              </Col>
              <Col lg={7}>
                <ol className="fs-5">
                  <li className="pb-3">
                    1. Open Whatsapp On Your Phone
                  </li>
                  <li className="pb-3">
                    2. Tap On Section or Settings And Select Linked Devices
                  </li>
                  <li className="pb-3">
                    3. If You Haven't Joined The Multi-device Beta Yet, You
                    Can Join First Link Tutorial Click Here
                  </li>
                  <li className="pb-3">
                    4. Point Your Phone To This Screen To Capture The Code.
                  </li>
                  <li>
                    <span class="text-danger">
                      Note: Multi Device BETA Login Only Works{" "}
                    </span>
                  </li>
                </ol>
              </Col>
            </Row>
          </div >
          <div className="modal-footer">
            <button
              type="button"
              onClick={() => setQrTemplate(false)}
              className="btn btn-danger"
            >
              {" "}
              Done
            </button>
          </div>
        </Modal>
      </Row>
    </>
  );
};

export default DevicePage;
