import React, { useState, useEffect, Fragment } from "react";
// import React, { useRef, useState, useEffect, Fragment } from "react";
import {
   Table,
   Pagination,
   Badge,
   Dropdown,
   Spinner,
   Modal,
   Button,
   Row,
   Col,
   Form,
   ListGroup,
} from "react-bootstrap";

// import PageTitle from "../../layouts/PageTitle";

// import { useDispatch, useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { Link } from "react-router-dom";

import axiosInstance from "../../../services/AxiosInstance";
import swal from "sweetalert";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import { format } from "date-fns";

import { getProfile } from "../../../store/actions/AuthActions";
// import InputEmoji from "react-input-emoji";

import messageTypeList from "../../../utils/message-type";

import { Editor } from "@tinymce/tinymce-react";

//const Orders = () => {
const NumberFilter = ({ props, history }) => {
   const dispatch = useDispatch();
   const [TemplateData, setTemplateData] = useState([]);
   const [loading, setLoading] = useState(false);

   const [editedMessage, setEditedMessage] = useState("");
   // const profile = useSelector((state) => state.auth.profile);
   const [activeId, setActiveId] = useState("");

   const sort = 50;
   let pagination = Array(Math.ceil(TemplateData.length / sort))
      .fill()
      .map((_, i) => i + 1);

   const [activePage, setActivePage] = useState(0);
   const [tableData, setTableData] = useState([]);

   const [addTemplateModal, setAddTemplateModal] = useState(false);
   const [editTemplateModal, setEditTemplateModal] = useState(false);

   const [message, setMessage] = useState("");
   let errorsObj = { instance: "", phone: "", message: "" };
   const [errors, setErrors] = useState(errorsObj);

   const [name, setName] = useState("");
   const [button1, setButton1] = useState("");
   const [button2, setButton2] = useState("");
   const [button3, setButton3] = useState("");

   const [footer, setFooter] = useState("");

   const upload = (e) => {
      e.preventDefault();
      document.getElementById("selectFile").click();
   };

   //menu
   const [middle, setMiddle] = useState("");
   const [button, setButton] = useState("");
   const [menu, setMenu] = useState([{ title: "", description: "" }]);

   //call to action
   const [callButton, setCallButton] = useState("");
   const [callingNumber, setCallingNumber] = useState("");

   const [webUrlButton, setWebUrlButton] = useState("");
   const [webUrl, setWebUrl] = useState("");

   const [selectedType, setSelectedType] = useState(0);

   useEffect(() => {
      dispatch(getProfile());
      loadTemplates();
   }, [dispatch]);

   useEffect(() => {
      if (TemplateData) {
         setLoading(false);
         setTableData(
            TemplateData.slice(activePage * sort, (activePage + 1) * sort)
         );
      }
   }, [TemplateData]);

   const loadTemplates = async () => {
      const { data } = await axiosInstance.post("message/templates");

      if (data.status) {
         setTemplateData(data.templates);
      }
   };

   //const [demo, setdemo] = useState();
   const onClick = (i) => {
      console.log("onClick - " + i);
      setActivePage(i);
      setTableData(TemplateData.slice(i * sort, (i + 1) * sort));
   };

   const onDelete = async (id) => {
      const { data } = await axiosInstance.post("message/delete-template", {
         template_id: id,
      });

      if (data.status) {
         //setCampaigns(data.campaigns);
         swal("Delete Template", data.message, "success");
         loadTemplates();
      } else {
         swal("Delete Template", data.message, "error");
      }
   };



   const onEdit = (template) => {

      console.log("onEdit - " + template.id)
      setActiveId(template.id);

      setName(template.name ?? "");
      setSelectedType(template.type ?? 0);
      setMessage(template.message ?? "");
      setEditedMessage(template.message ?? "");

      setButton(template.button ?? "");
      setFooter(template.footer ?? "");
      setMiddle(template.middle ?? "");

      setButton1(template.button1 ?? "");
      setButton2(template.button2 ?? "");
      setButton3(template.button3 ?? "");

      setMenu(template.menus);

      setCallButton(template.callButton ?? "");
      setCallingNumber(template.callingNumber ?? "");
      setWebUrlButton(template.webUrlButton ?? "");
      setWebUrl(template.webUrl ?? "");

      setEditTemplateModal(true);
   };

   const onSaveTemplate = async (event) => {
      event.preventDefault();

      let error = false;
      const errorObj = { ...errorsObj };

      if (name === "") {
         errorObj.name = "Name is Required";
         error = true;
      }

      if (message === "") {
         errorObj.message = "Message is Required";
         error = true;
      }

      if (selectedType === 2 || selectedType === 3) {
         if (button1 === "") {
            errorObj.button1 = "Button 1 is Required";
            error = true;
         }

         if (footer === "") {
            errorObj.footer = "Footer is Required";
            error = true;
         }
      } else if (selectedType === 4 || selectedType === 5) {
         if (callButton === "") {
            errorObj.callButton = "call Button Text is Required";
            error = true;
         }

         if (callingNumber === "") {
            errorObj.callingNumber = "Calling Number is Required";
            error = true;
         }

         if (webUrlButton === "") {
            errorObj.webUrlButton = "Web Button Text is Required";
            error = true;
         }

         if (webUrl === "") {
            errorObj.webUrl = "Web Url is Required";
            error = true;
         }

         if (footer === "") {
            errorObj.footer = "Footer is Required";
            error = true;
         }
      } else if (selectedType === 6) {
         if (footer === "") {
            errorObj.footer = "Footer is Required";
            error = true;
         }

         if (button === "") {
            errorObj.button = "Button is Required";
            error = true;
         }

         if (menu.length === 0) {
            errorObj.menu = "Minimum 1 menu is required";
            error = true;
         }
      }

      setErrors(errorObj);
      if (error) {
         console.log("error on save");
         return;
      }

      try {
         const { data } = await axiosInstance.post("message/update-template", {
            template_id: activeId,
            name: name,
            message: message,
            type: selectedType,
            button_1: button1,
            button_2: button2,
            button_3: button3,
            footer: footer,

            middle: middle,
            menus: menu,
            button: button,

            call_button: callButton,
            calling_number: callingNumber,
            web_url_button: webUrlButton,
            web_url: webUrl,
         });

         if (data.status === false) {
            //toast.error(data.message);
            swal("Update Template", data.message, "error");
         } else {
            //toast.success(data.message);
            swal("Update Template", data.message, "success");

            setEditTemplateModal(false);

            setName("");
            setMessage("");
            setEditedMessage("")
            setButton1("");
            setButton2("");
            setButton3("");
            setFooter("");

            setMiddle("");
            setButton("");
            setMenu([{ title: "", description: "" }]);

            setCallButton("");
            setCallingNumber("");
            setWebUrlButton("");
            setWebUrl("");
            setActiveId("");

            loadTemplates();

         }
      } catch (error) {
         swal("Update Template", error, "error");
      }
   };



   const onSubmit = async (event) => {
      event.preventDefault();

      let error = false;
      const errorObj = { ...errorsObj };

      if (name === "") {
         errorObj.name = "Name is Required";
         error = true;
      }

      if (message === "") {
         errorObj.message = "Message is Required";
         error = true;
      }

      if (selectedType === 2 || selectedType === 3) {
         if (button1 === "") {
            errorObj.button1 = "Button 1 is Required";
            error = true;
         }

         if (footer === "") {
            errorObj.footer = "Footer is Required";
            error = true;
         }
      } else if (selectedType === 4 || selectedType === 5) {
         if (callButton === "") {
            errorObj.callButton = "call Button Text is Required";
            error = true;
         }

         if (callingNumber === "") {
            errorObj.callingNumber = "Calling Number is Required";
            error = true;
         }

         if (webUrlButton === "") {
            errorObj.webUrlButton = "Web Button Text is Required";
            error = true;
         }

         if (webUrl === "") {
            errorObj.webUrl = "Web Url is Required";
            error = true;
         }

         if (footer === "") {
            errorObj.footer = "Footer is Required";
            error = true;
         }
      } else if (selectedType === 6) {
         if (footer === "") {
            errorObj.footer = "Footer is Required";
            error = true;
         }

         if (button === "") {
            errorObj.button = "Button is Required";
            error = true;
         }

         if (menu.length === 0) {
            errorObj.menu = "Minimum 1 menu is required";
            error = true;
         }
      }

      setErrors(errorObj);
      if (error) {
         console.log("error on save");
         return;
      }

      try {
         const { data } = await axiosInstance.post("message/create-template", {
            name: name,
            message: message,
            type: selectedType,
            button_1: button1,
            button_2: button2,
            button_3: button3,
            footer: footer,

            middle: middle,
            menus: menu,
            button: button,

            call_button: callButton,
            calling_number: callingNumber,
            web_url_button: webUrlButton,
            web_url: webUrl,
         });

         if (data.status === false) {
            //toast.error(data.message);
            swal("Create Template", data.message, "error");
         } else {
            //toast.success(data.message);
            swal("Create Template", data.message, "success");

            setAddTemplateModal(false);
            loadTemplates();
            setMessage("");
            setButton1("");
            setButton2("");
            setButton3("");
            setFooter("");

            setMiddle("");
            setButton("");
            setMenu([]);

            setCallButton("");
            setCallingNumber("");
            setWebUrlButton("");
            setWebUrl("");
         }
      } catch (error) {
         swal("Create Template", error, "error");
      }
   };

   const getResponse = (data) => {
      if (data.type === 0) {
         return <Badge variant="danger light">No</Badge>;
      } else if (data.type === 2 || data.type === 3) {
         return (
            <>
               <small>{data.footer}</small>
               <br />

               {data.button1 ? (
                  <Button variant="primary" size="sm" className="btn-block">
                     {data.button1}
                  </Button>
               ) : (
                  <></>
               )}

               {data.button2 ? (
                  <Button variant="primary" size="sm" className="btn-block">
                     {data.button2}
                  </Button>
               ) : (
                  <></>
               )}

               {data.button3 ? (
                  <Button variant="primary" size="sm" className="btn-block">
                     {data.button3}
                  </Button>
               ) : (
                  <></>
               )}
            </>
         );
      } else if (data.type === 4 || data.type === 5) {
         return (
            <>
               <small>{data.footer}</small>
               <br />

               {data.callButton ? (
                  <a
                     href={"tel:" + data.callingNumber}
                     target="_blank"
                     className="btn btn-sm btn-primary btn-block"
                     rel="noreferrer"
                  >
                     {data.callButton}
                  </a>
               ) : (
                  <></>
               )}

               {data.webUrlButton ? (
                  <a
                     href={data.webUrl}
                     target="_blank"
                     className="btn btn-sm btn-primary btn-block"
                     rel="noreferrer"
                  >
                     {data.webUrlButton}
                  </a>
               ) : (
                  <></>
               )}
            </>
         );
      } else if (data.type === 6) {
         return (
            <>
               <div className="text-center">
                  <small>{data.middle}</small>
               </div>
               <ListGroup as="ol" numbered>
                  {data.menus.map((menuItem, i) => (
                     <ListGroup.Item
                        key={"menu-" + menuItem.id}
                        as="li"
                        className="d-flex justify-content-between align-items-start bg-white"
                     >
                        <div className="ms-2 me-auto">
                           <div className="fw-bold text-primary">
                              {i + 1}. {menuItem.title}
                           </div>
                           <small>{menuItem.description}</small>
                        </div>
                     </ListGroup.Item>
                  ))}
               </ListGroup>
               <div className="text-center">
                  <small>{data.footer}</small>
               </div>
            </>
         );
      } else {
         return <Badge variant="danger light">No</Badge>;
      }
   };

   const onAddMenu = async (e) => {
      e.preventDefault();

      if (menu.length < 25) {
         setMenu((menu) => [...menu, { title: "", description: "" }]);
      } else {
         //toast.warn("You can't add more then 5 websites");
         swal("Add Menu", "You can't add more then 5 menus", "error");
      }
   };

   const onChangeMenuTitle = async (i, title) => {
      menu[i].title = title;
      setMenu((menu) => [...menu]);
   };

   const onChangeMenuDescription = async (i, description) => {
      menu[i].description = description;
      setMenu((menu) => [...menu]);
   };

   const onRemoveMenu = async (value) => {
      if (menu.length > 1) {
         const newArray = menu.filter(function (element) {
            return element !== value;
         });
         setMenu(newArray);
      } else {
         swal("Remove Menu", "Yet list 1 menu is required.", "error");
      }
   };

   return (
      <>
         <Modal
            size="lg"
            className="modal fade"
            show={addTemplateModal}
            onHide={setAddTemplateModal}
         >
            <div className="" role="document">
               <div className="">
                  <form onSubmit={onSubmit}>
                     <div className="modal-header">
                        <h4 className="modal-title fs-20">Add Template</h4>
                        <button
                           type="button"
                           className="close"
                           onClick={() => setAddTemplateModal(false)}
                        >
                           <span>×</span>
                        </button>
                     </div>
                     <div className="modal-body">
                        <i className="flaticon-cancel-12 close"></i>
                        <div className="add-contact-box">
                           <div className="add-contact-content">
                              <div className="form-row">
                                 <div className="form-group col-md-6">
                                    <label>Message Type</label>
                                    <select
                                       className="form-control"
                                       value={selectedType}
                                       onChange={(e) => setSelectedType(e.target.value)}
                                    //defaultValue="Choose"
                                    >
                                       {messageTypeList.map((type, i) => (
                                          <option value={type.id}>{type.title}</option>
                                       ))}
                                    </select>
                                 </div>

                                 <div className="form-group col-md-6">
                                    <label className="required-field">Name</label>
                                    <input
                                       type="text"
                                       value={name}
                                       onChange={(e) => setName(e.target.value)}
                                       placeholder="Name"
                                       className="form-control"
                                    />
                                    {errors.name && (
                                       <div className="text-danger fs-12">{errors.name}</div>
                                    )}
                                 </div>
                              </div>

                              <div className="form-row">
                                 <div className="form-group col-md-12">
                                    <label className="required-field">Message</label>


                                    <Editor
                                       apiKey="bx58evs65wyjpf6avtik2wq6avh5g6hpotg9inwnjmbw886q"

                                       value={editedMessage}
                                       onChange={(e) => { }}
                                       onEditorChange={(newValue, editor) => {
                                          var message = newValue;
                                          message = message.replace("<strong>", "*");
                                          message = message.replace("</strong>", "*");

                                          message = message.replace("<em>", "_");
                                          message = message.replace("</em>", "_");

                                          setEditedMessage(message);

                                          console.log(
                                             "newValue - " +
                                             newValue +
                                             ", message - " +
                                             message
                                          );

                                          setMessage(editor.getContent({ format: "text" }));
                                       }}
                                       init={{
                                          plugins: "emoticons",
                                          toolbar: "emoticons",
                                          toolbar_location: "bottom",
                                          menubar: false,
                                       }}
                                    />

                                    {errors.message && (
                                       <div className="text-danger fs-12">
                                          {errors.message}
                                       </div>
                                    )}
                                 </div>
                                 <div className="form-group col-md-6"></div>
                              </div>

                              {selectedType === 2 || selectedType === 3 ? (
                                 <>
                                    <h4 className="mt-2">Quick Reply Button</h4>

                                    <div className="form-row">
                                       <div className="form-group col-md-6">
                                          <label className="required-field">Button 1</label>
                                          <input
                                             type="text"
                                             value={button1}
                                             onChange={(e) => setButton1(e.target.value)}
                                             placeholder="Button Text"
                                             className="form-control"
                                          />
                                          {errors.button1 && (
                                             <div className="text-danger fs-12">
                                                {errors.button1}
                                             </div>
                                          )}
                                       </div>

                                       <div className="form-group col-md-6">
                                          <label>Button 2 (Optional)</label>
                                          <input
                                             type="text"
                                             value={button2}
                                             onChange={(e) => setButton2(e.target.value)}
                                             placeholder="Button Text"
                                             className="form-control"
                                          />
                                       </div>
                                    </div>

                                    <div className="form-row">
                                       <div className="form-group col-md-6">
                                          <label>Button 3 (Optional)</label>
                                          <input
                                             type="text"
                                             value={button3}
                                             onChange={(e) => setButton3(e.target.value)}
                                             placeholder="Button Text"
                                             className="form-control"
                                          />
                                       </div>

                                       <div className="form-group col-md-6">
                                          <label className="required-field">Footer</label>
                                          <input
                                             type="text"
                                             value={footer}
                                             onChange={(e) => setFooter(e.target.value)}
                                             placeholder="Footer Text"
                                             className="form-control"
                                          />
                                       </div>
                                    </div>
                                 </>
                              ) : (
                                 <></>
                              )}

                              {selectedType === 4 || selectedType === 5 ? (
                                 <>
                                    <h4 className="mt-4">Call To Action Button</h4>

                                    <div className="form-row">
                                       <div className="form-group col-md-6">
                                          <label className="required-field">Call Button</label>
                                          <input
                                             type="text"
                                             value={callButton}
                                             onChange={(e) => setCallButton(e.target.value)}
                                             placeholder="Call Button Text"
                                             className="form-control"
                                          />
                                          {errors.callButton && (
                                             <div className="text-danger fs-12">
                                                {errors.callButton}
                                             </div>
                                          )}
                                       </div>

                                       <div className="form-group col-md-6">
                                          <label className="required-field">Calling Number</label>
                                          <input
                                             type="text"
                                             value={callingNumber}
                                             onChange={(e) => setCallingNumber(e.target.value)}
                                             placeholder="Calling Number"
                                             className="form-control"
                                          />
                                       </div>
                                    </div>

                                    <div className="form-row">
                                       <div className="form-group col-md-6">
                                          <label className="required-field">Web Url Button</label>
                                          <input
                                             type="text"
                                             value={webUrlButton}
                                             onChange={(e) => setWebUrlButton(e.target.value)}
                                             placeholder="Web URL Button Text"
                                             className="form-control"
                                          />
                                       </div>

                                       <div className="form-group col-md-6">
                                          <label className="required-field">Web URL</label>
                                          <input
                                             type="text"
                                             value={webUrl}
                                             onChange={(e) => setWebUrl(e.target.value)}
                                             placeholder="https://"
                                             className="form-control"
                                          />
                                       </div>

                                       <div className="form-group col-md-6">
                                          <label className="required-field">Footer</label>
                                          <input
                                             type="text"
                                             value={footer}
                                             onChange={(e) => setFooter(e.target.value)}
                                             placeholder="Footer"
                                             className="form-control"
                                          />
                                       </div>
                                    </div>
                                 </>
                              ) : (
                                 <></>
                              )}

                              {selectedType === 6 ? (
                                 <>
                                    <Row className="mb-3">
                                       <Col>
                                          <h4 className="mt-4">List/Menu Message</h4>
                                       </Col>

                                       <Col className="text-right">

                                       </Col>
                                    </Row>

                                    <div className="form-row">
                                       <div className="form-group col-md-4">
                                          <label>Middle Text</label>
                                          <input
                                             type="text"
                                             value={middle}
                                             onChange={(e) => setMiddle(e.target.value)}
                                             placeholder="Middle Text"
                                             className="form-control"
                                          />
                                       </div>

                                       <div className="form-group col-md-4">
                                          <label className="required-field">Footer Text</label>
                                          <input
                                             type="text"
                                             value={footer}
                                             onChange={(e) => setFooter(e.target.value)}
                                             placeholder="Footer Text"
                                             className="form-control"
                                          />
                                          {errors.footer && (
                                             <div className="text-danger fs-12">
                                                {errors.footer}
                                             </div>
                                          )}
                                       </div>

                                       <div className="form-group col-md-4">
                                          <label className="required-field">Button Text</label>
                                          <input
                                             type="text"
                                             value={button}
                                             onChange={(e) => setButton(e.target.value)}
                                             placeholder="Button Text"
                                             className="form-control"
                                          />
                                          {errors.button && (
                                             <div className="text-danger fs-12">
                                                {errors.button}
                                             </div>
                                          )}
                                       </div>
                                    </div>

                                    <Row className="my-2">
                                       <Col>
                                          <h5 className="mt-4">Menus</h5>
                                       </Col>

                                       <Col className="text-right">
                                          <Link
                                             onClick={onAddMenu}
                                             className="btn btn-sm btn-success"
                                          >
                                             Add Menu
                                          </Link>
                                       </Col>
                                    </Row>

                                    {menu.map((menuItem, i) => (
                                       <Row className="mb-3" key={i}>
                                          <Form.Group as={Col} md={4}>
                                             <label className={i === 0 ? "required-field" : ""}>
                                                Menu {i + 1} Title {i > 0 ? "(Optional)" : ""}
                                             </label>
                                             <Form.Control
                                                className="main"
                                                type="text"
                                                placeholder="Title"
                                                value={menuItem.title}
                                                onChange={(e) =>
                                                   onChangeMenuTitle(i, e.target.value)
                                                }
                                             />
                                          </Form.Group>

                                          <Form.Group as={Col} md={6}>
                                             <label>Menu {i + 1} Description (Optional)</label>
                                             <Form.Control
                                                className="main"
                                                type="text"
                                                placeholder="Description"
                                                value={menuItem.description}
                                                onChange={(e) =>
                                                   onChangeMenuDescription(i, e.target.value)
                                                }
                                             />
                                          </Form.Group>

                                          <Col lg={2} className="text-right">
                                             {menu.length === 1 ? (
                                                <></>
                                             ) : (
                                                <Link
                                                   onClick={(e) => onRemoveMenu(menuItem)}
                                                   className="btn btn-sm btn-danger mt-4"
                                                >
                                                   Remove
                                                </Link>
                                             )}
                                          </Col>
                                       </Row>
                                    ))}
                                 </>
                              ) : (
                                 <></>
                              )}
                           </div>
                        </div>
                     </div>
                     <div className="modal-footer">
                        <button
                           type="button"
                           onClick={() => setAddTemplateModal(false)}
                           className="btn btn-danger"
                        >
                           {" "}
                           <i className="flaticon-delete-1"></i> Discard
                        </button>
                        <button type="submit" className="btn btn-primary">
                           Add
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         </Modal>



         <Modal
            size="lg"
            className="modal fade"
            show={editTemplateModal}
            onHide={setEditTemplateModal}
         >
            <div className="" role="document">
               <div className="">
                  <form onSubmit={onSaveTemplate}>
                     <div className="modal-header">
                        <h4 className="modal-title fs-20">Edit Template</h4>
                        <button
                           type="button"
                           className="close"
                           onClick={() => setEditTemplateModal(false)}
                        >
                           <span>×</span>
                        </button>
                     </div>
                     <div className="modal-body">
                        <i className="flaticon-cancel-12 close"></i>
                        <div className="add-contact-box">
                           <div className="add-contact-content">
                              <div className="form-row">
                                 <div className="form-group col-md-6">
                                    <label>Message Type</label>
                                    <select
                                       className="form-control"
                                       value={selectedType}
                                       onChange={(e) => setSelectedType(e.target.value)}
                                    //defaultValue="Choose"
                                    >
                                       {messageTypeList.map((type, i) => (
                                          <option value={type.id}>{type.title}</option>
                                       ))}
                                    </select>
                                 </div>

                                 <div className="form-group col-md-6">
                                    <label className="required-field">Name</label>
                                    <input
                                       type="text"
                                       value={name}
                                       onChange={(e) => setName(e.target.value)}
                                       placeholder="Name"
                                       className="form-control"
                                    />
                                    {errors.name && (
                                       <div className="text-danger fs-12">{errors.name}</div>
                                    )}
                                 </div>
                              </div>

                              <div className="form-row">
                                 <div className="form-group col-md-12">
                                    <label className="required-field">Message</label>


                                    <Editor
                                       apiKey="bx58evs65wyjpf6avtik2wq6avh5g6hpotg9inwnjmbw886q"

                                       value={editedMessage}
                                       onChange={(e) => { }}
                                       onEditorChange={(newValue, editor) => {
                                          var message = newValue;
                                          message = message.replace("<strong>", "*");
                                          message = message.replace("</strong>", "*");

                                          message = message.replace("<em>", "_");
                                          message = message.replace("</em>", "_");

                                          setEditedMessage(message);

                                          console.log(
                                             "newValue - " +
                                             newValue +
                                             ", message - " +
                                             message
                                          );

                                          setMessage(editor.getContent({ format: "text" }));
                                       }}
                                       init={{
                                          plugins: "emoticons",
                                          toolbar: "emoticons",
                                          toolbar_location: "bottom",
                                          menubar: false,
                                       }}
                                    />

                                    {errors.message && (
                                       <div className="text-danger fs-12">
                                          {errors.message}
                                       </div>
                                    )}
                                 </div>
                                 <div className="form-group col-md-6"></div>
                              </div>

                              {selectedType === 2 || selectedType === 3 ? (
                                 <>
                                    <h4 className="mt-2">Quick Reply Button</h4>

                                    <div className="form-row">
                                       <div className="form-group col-md-6">
                                          <label className="required-field">Button 1</label>
                                          <input
                                             type="text"
                                             value={button1}
                                             onChange={(e) => setButton1(e.target.value)}
                                             placeholder="Button Text"
                                             className="form-control"
                                          />
                                          {errors.button1 && (
                                             <div className="text-danger fs-12">
                                                {errors.button1}
                                             </div>
                                          )}
                                       </div>

                                       <div className="form-group col-md-6">
                                          <label>Button 2 (Optional)</label>
                                          <input
                                             type="text"
                                             value={button2}
                                             onChange={(e) => setButton2(e.target.value)}
                                             placeholder="Button Text"
                                             className="form-control"
                                          />
                                       </div>
                                    </div>

                                    <div className="form-row">
                                       <div className="form-group col-md-6">
                                          <label>Button 3 (Optional)</label>
                                          <input
                                             type="text"
                                             value={button3}
                                             onChange={(e) => setButton3(e.target.value)}
                                             placeholder="Button Text"
                                             className="form-control"
                                          />
                                       </div>

                                       <div className="form-group col-md-6">
                                          <label className="required-field">Footer</label>
                                          <input
                                             type="text"
                                             value={footer}
                                             onChange={(e) => setFooter(e.target.value)}
                                             placeholder="Footer Text"
                                             className="form-control"
                                          />
                                       </div>
                                    </div>
                                 </>
                              ) : (
                                 <></>
                              )}

                              {selectedType === 4 || selectedType === 5 ? (
                                 <>
                                    <h4 className="mt-4">Call To Action Button</h4>

                                    <div className="form-row">
                                       <div className="form-group col-md-6">
                                          <label className="required-field">Call Button</label>
                                          <input
                                             type="text"
                                             value={callButton}
                                             onChange={(e) => setCallButton(e.target.value)}
                                             placeholder="Call Button Text"
                                             className="form-control"
                                          />
                                          {errors.callButton && (
                                             <div className="text-danger fs-12">
                                                {errors.callButton}
                                             </div>
                                          )}
                                       </div>

                                       <div className="form-group col-md-6">
                                          <label className="required-field">Calling Number</label>
                                          <input
                                             type="text"
                                             value={callingNumber}
                                             onChange={(e) => setCallingNumber(e.target.value)}
                                             placeholder="Calling Number"
                                             className="form-control"
                                          />
                                       </div>
                                    </div>

                                    <div className="form-row">
                                       <div className="form-group col-md-6">
                                          <label className="required-field">Web Url Button</label>
                                          <input
                                             type="text"
                                             value={webUrlButton}
                                             onChange={(e) => setWebUrlButton(e.target.value)}
                                             placeholder="Web URL Button Text"
                                             className="form-control"
                                          />
                                       </div>

                                       <div className="form-group col-md-6">
                                          <label className="required-field">Web URL</label>
                                          <input
                                             type="text"
                                             value={webUrl}
                                             onChange={(e) => setWebUrl(e.target.value)}
                                             placeholder="https://"
                                             className="form-control"
                                          />
                                       </div>

                                       <div className="form-group col-md-6">
                                          <label className="required-field">Footer</label>
                                          <input
                                             type="text"
                                             value={footer}
                                             onChange={(e) => setFooter(e.target.value)}
                                             placeholder="Footer"
                                             className="form-control"
                                          />
                                       </div>
                                    </div>
                                 </>
                              ) : (
                                 <></>
                              )}

                              {selectedType === 6 ? (
                                 <>
                                    <Row className="mb-3">
                                       <Col>
                                          <h4 className="mt-4">List/Menu Message</h4>
                                       </Col>

                                       <Col className="text-right">

                                       </Col>
                                    </Row>

                                    <div className="form-row">
                                       <div className="form-group col-md-4">
                                          <label>Middle Text</label>
                                          <input
                                             type="text"
                                             value={middle}
                                             onChange={(e) => setMiddle(e.target.value)}
                                             placeholder="Middle Text"
                                             className="form-control"
                                          />
                                       </div>

                                       <div className="form-group col-md-4">
                                          <label className="required-field">Footer Text</label>
                                          <input
                                             type="text"
                                             value={footer}
                                             onChange={(e) => setFooter(e.target.value)}
                                             placeholder="Footer Text"
                                             className="form-control"
                                          />
                                          {errors.footer && (
                                             <div className="text-danger fs-12">
                                                {errors.footer}
                                             </div>
                                          )}
                                       </div>

                                       <div className="form-group col-md-4">
                                          <label className="required-field">Button Text</label>
                                          <input
                                             type="text"
                                             value={button}
                                             onChange={(e) => setButton(e.target.value)}
                                             placeholder="Button Text"
                                             className="form-control"
                                          />
                                          {errors.button && (
                                             <div className="text-danger fs-12">
                                                {errors.button}
                                             </div>
                                          )}
                                       </div>
                                    </div>

                                    <Row className="my-2">
                                       <Col>
                                          <h5 className="mt-4">Menus</h5>
                                       </Col>

                                       <Col className="text-right">
                                          <Link
                                             onClick={onAddMenu}
                                             className="btn btn-sm btn-success"
                                          >
                                             Add Menu
                                          </Link>
                                       </Col>
                                    </Row>

                                    {menu.map((menuItem, i) => (
                                       <Row className="mb-3" key={i}>
                                          <Form.Group as={Col} md={4}>
                                             <label className={i === 0 ? "required-field" : ""}>
                                                Menu {i + 1} Title {i > 0 ? "(Optional)" : ""}
                                             </label>
                                             <Form.Control
                                                className="main"
                                                type="text"
                                                placeholder="Title"
                                                value={menuItem.title}
                                                onChange={(e) =>
                                                   onChangeMenuTitle(i, e.target.value)
                                                }
                                             />
                                          </Form.Group>

                                          <Form.Group as={Col} md={6}>
                                             <label>Menu {i + 1} Description (Optional)</label>
                                             <Form.Control
                                                className="main"
                                                type="text"
                                                placeholder="Description"
                                                value={menuItem.description}
                                                onChange={(e) =>
                                                   onChangeMenuDescription(i, e.target.value)
                                                }
                                             />
                                          </Form.Group>

                                          <Col lg={2} className="text-right">
                                             {menu.length === 1 ? (
                                                <></>
                                             ) : (
                                                <Link
                                                   onClick={(e) => onRemoveMenu(menuItem)}
                                                   className="btn btn-sm btn-danger mt-4"
                                                >
                                                   Remove
                                                </Link>
                                             )}
                                          </Col>
                                       </Row>
                                    ))}
                                 </>
                              ) : (
                                 <></>
                              )}
                           </div>
                        </div>
                     </div>
                     <div className="modal-footer">
                        <button
                           type="button"
                           onClick={() => setEditTemplateModal(false)}
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

         <Fragment>


            <div className="col-12">
               <div className="card">
                  <div className="card-header">
                     <div class="mr-auto">
                        <h4 className="card-title">Number Filter</h4>
                     </div>

                     <a
                        className="btn btn-light font-w600 mr-2"
                        download
                        target="_blank"
                        href="https://bulkymarketing.com/sample/bulk-upload.xlsx"
                        rel="noreferrer"
                     >
                        Download Sample
                     </a>
                     <Link
                        className="btn btn-primary font-w600 mr-2"
                        onClick={() => setAddTemplateModal(true)}
                     >
                        Manual Import
                     </Link>
                     <Link
                        className="btn btn-primary font-w600 mr-2"
                        id="plus"
                        onClick={upload}
                     >
                        Import
                     </Link>
                     <input
                        id="selectFile"
                        accept=".csv, .xls, .xlsx, text/csv, application/csv,
text/comma-separated-values, application/csv, application/excel,
application/vnd.msexcel, text/anytext, application/vnd. ms-excel,
application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        hidden
                        type="file"
                     />
                  </div>
                  <hr />
                  <div className="card-body">
                  <button className='btn btn-danger'>Add Contact Row</button>
                     <div className='container border rounded'>
                        <div className='row shadow-sm bgclr border rounded'>
                           <div className='col-sm-1 py-2'>Sr No.</div>
                           <div className='col-sm-4 py-2'>Name</div>
                           <div className='col-sm-5 py-2'>Number</div>
                           <div className='col-sm-2 py-2'>Action</div>
                        </div>
                     </div>
                  </div>
                  
               </div>
            </div>
         </Fragment>
      </>
   );
};

export default NumberFilter;

