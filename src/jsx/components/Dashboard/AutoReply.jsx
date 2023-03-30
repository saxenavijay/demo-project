import React, { useState, useEffect, Fragment } from "react";
import {
  Table,
  Pagination,
  Badge,
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

import { Link } from "react-router-dom";

import axios from "axios";
import swal from "sweetalert";

// import { format } from "date-fns";

// import { getProfile } from "../../../store/actions/AuthActions";

// import InputEmoji from "react-input-emoji";

import messageTypeList from "../../../utils/message-type";

import { Editor } from "@tinymce/tinymce-react";
import { Typeahead } from 'react-bootstrap-typeahead';
// import { keyframes } from "styled-components";

//const Orders = () => {
const AutoReply = ({ props, history }) => {
  // const dispatch = useDispatch();
  const [autoReplyData, setAutoReplyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editedMessage, setEditedMessage] = useState("");
  // const profile = useSelector((state) => state.auth.profile);

  const [instances, setInstances] = useState([]);
  const [selectedInstance, setSelectedInstance] = useState("");

  const [templates, setTemplates] = useState([]);

  const sort = 50;
  let pagination = Array(Math.ceil(autoReplyData.length / sort))
    .fill()
    .map((_, i) => i + 1);

  const [activePage, setActivePage] = useState(0);
  const [tableData, setTableData] = useState([]);

  const [addAutoReplyModal, setAddAutoReplyModal] = useState(false);
  const [editAutoReplyModal, setEditAutoReplyModal] = useState(false);
  const [activeId, setActiveId] = useState("");

  const [keyword, setKeyword] = useState("");
  const [message, setMessage] = useState("");
  let errorsObj = { instance: "", phone: "", message: "" };
  const [errors, setErrors] = useState(errorsObj);

  const [button1, setButton1] = useState("");
  const [button2, setButton2] = useState("");
  const [button3, setButton3] = useState("");

  const [footer, setFooter] = useState("");

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

  const [options, setOption] = useState([]);
  const [usedOptions, setUsedOption] = useState([]);



  //media
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);


  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleClick = (event) => {
    const { target = {} } = event || {};
    target.value = "";
  };

  useEffect(() => {
    
    loadAutoReply();
    loadInstance();
    loadTemplates();
  },[]);

  useEffect(() => {
    if (autoReplyData) {
      setLoading(false);
      setTableData(
        autoReplyData.slice(activePage * sort, (activePage + 1) * sort)
      );
    }
  }, [autoReplyData]);

  const loadTemplates = async () => {
    const { data } = await axios.post("http://localhost:5000/api/message/templates");
    if (data.status) {
      setTemplates(data.templates);

      var dummy = [...options];

      data.templates.forEach((data) => {
        if (!usedOptions.includes(JSON.stringify(data.button1)) && !dummy.includes(JSON.stringify(data.button1)) && data.button1 !== "") {
          dummy.push(data.button1);
        }

        if (!usedOptions.includes(JSON.stringify(data.button1)) && !dummy.includes(JSON.stringify(data.button2)) && data.button2 !== "") {
          dummy.push(data.button2);
        }

        if (!usedOptions.includes(JSON.stringify(data.button1)) && !dummy.includes(JSON.stringify(data.button3)) && data.button1 !== "") {
          dummy.push(data.button3);
        }
      });

      setOption(dummy);


    }
  };

  const loadAutoReply = async () => {
    const { data } = await axios.post("http://localhost:5000/api/message/auto-replies");

    if (data.status) {
      setAutoReplyData(data.autoreplies);

      var dummy = [];

      data.autoreplies.forEach((data) => {

        if (!dummy.includes(JSON.stringify(data.button1)) && data.button1 !== "") {
          dummy.push(data.button1);
        }

        if (!dummy.includes(JSON.stringify(data.button2)) && data.button2 !== "") {
          dummy.push(data.button2);
        }

        if (!dummy.includes(JSON.stringify(data.button3)) && data.button1 !== "") {
          dummy.push(data.button3);
        }

      });

      setUsedOption(dummy)

    }
  };

  const loadInstance = async () => {
    const { data } = await axios.post("http://localhost:5000/api/message/instances");

    if (data.status) {
      setInstances(data.inatances);

      if (data.inatances.length > 0) {
        setSelectedInstance(data.inatances[0]._id);
      }
    }
  };

  //const [demo, setdemo] = useState();
  const onClick = (i) => {
    console.log("onClick - " + i);
    setActivePage(i);
    setTableData(autoReplyData.slice(i * sort, (i + 1) * sort));
  };

  const onEdit = async (autoReply) => {
    setActiveId(autoReply._id);
    setKeyword(autoReply.keyword ?? "");

    setSelectedInstance(autoReply.instanceId);

    setSelectedType(autoReply.type ?? 0);
    setMessage(autoReply.message ?? "");
    //setEditedMessage(autoReply.message ?? "");

    var m = autoReply.message ?? "";
    m = m.replace(/\r?\n|\r/g, '<br>');

    setEditedMessage(m);


    setButton(autoReply.button ?? "");
    setFooter(autoReply.footer ?? "");
    setMiddle(autoReply.middle ?? "");

    setButton1(autoReply.button1 ?? "");
    setButton2(autoReply.button2 ?? "");
    setButton3(autoReply.button3 ?? "");

    setMenu(autoReply.menus);

    setCallButton(autoReply.callButton ?? "");
    setCallingNumber(autoReply.callingNumber ?? "");
    setWebUrlButton(autoReply.webUrlButton ?? "");
    setWebUrl(autoReply.webUrl ?? "");

    setEditAutoReplyModal(true);
  };

  const onSaveAutoReply = async (event) => {
    event.preventDefault();

    let error = false;
    const errorObj = { ...errorsObj };

    if (selectedInstance === "") {
      errorObj.instance = "Instance is Required";
      error = true;
    }

    if (keyword === "") {
      errorObj.keyword = "Keyword is Required";
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

    if (
      (selectedType === 1 || selectedType === 3 || selectedType === 5) &&
      selectedFile == null
    ) {
      errorObj.media = "Media is Required";
      error = true;
    }

    setErrors(errorObj);
    if (error) {
      console.log("error on save");
      return;
    }

    try {
      const formData = new FormData();

      if (selectedType === 1 || selectedType === 3 || selectedType === 5) {
        formData.append("media", selectedFile);
        formData.append("caption", caption);
      }

      formData.append("autoreply_id", activeId);
      formData.append("message", message);
      formData.append("keyword", keyword);
      formData.append("instance_id", selectedInstance);
      formData.append("type", selectedType);
      formData.append("button_1", button1);
      formData.append("button_2", button2);
      formData.append("button_3", button3);
      formData.append("footer", footer);
      formData.append("menus", JSON.stringify(menu));
      formData.append("middle", middle);
      formData.append("button", button);
      formData.append("call_button", callButton);
      formData.append("calling_number", callingNumber);
      formData.append("web_url_button", webUrlButton);
      formData.append("web_url", webUrl);

      const { data } = await axios.post("http://localhost:5000/api/message/update-auto-reply",
        formData,
        { "Content-Type": "multipart/form-data" });

      if (data.status === false) {
        //toast.error(data.message);
        swal("Update Auto Reply", data.message, "error");
      } else {
        //toast.success(data.message);
        swal("Update Auto Reply", data.message, "success");

        setEditAutoReplyModal(false);

        setKeyword("");
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

        loadAutoReply();

      }
    } catch (error) {
      swal("Update Auto Reply", error, "error");
    }
  };

  const onDelete = async (id) => {
    const { data } = await axios.post("http://localhost:5000/api/message/delete-auto-reply", {
      auto_reply_id: id,
    });

    if (data.status) {
      //setCampaigns(data.campaigns);
      swal("Delete Auto Reply", data.message, "success");
      loadAutoReply();
    } else {
      swal("Auto Reply Not Deleted", data.message, "error");
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    let error = false;
    const errorObj = { ...errorsObj };

    if (selectedInstance === "") {
      errorObj.instance = "Instance is Required";
      error = true;
    }

    if (keyword === "") {
      errorObj.keyword = "Keyword is Required";
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

    if (
      (selectedType === 1 || selectedType === 3 || selectedType === 5) &&
      selectedFile == null
    ) {
      errorObj.media = "Media is Required";
      error = true;
    }

    setErrors(errorObj);
    if (error) {
      console.log("error on save");
      return;
    }

    try {
      const formData = new FormData();

      if (selectedType === 1 || selectedType === 3 || selectedType === 5) {
        formData.append("media", selectedFile);
        formData.append("caption", caption);
      }

      formData.append("message", message);
      formData.append("keyword", keyword);
      formData.append("instance_id", selectedInstance);
      formData.append("type", selectedType);
      formData.append("button_1", button1);
      formData.append("button_2", button2);
      formData.append("button_3", button3);
      formData.append("footer", footer);
      formData.append("menus", JSON.stringify(menu));
      formData.append("middle", middle);
      formData.append("button", button);
      formData.append("call_button", callButton);
      formData.append("calling_number", callingNumber);
      formData.append("web_url_button", webUrlButton);
      formData.append("web_url", webUrl);

      const { data } = await axios.post("http://localhost:5000/api/message/create-auto-reply", formData,
        { "Content-Type": "multipart/form-data" });

      if (data.status === false) {
        //toast.error(data.message);
        swal("Create Auto Reply", data.message, "error");
      } else {
        //toast.success(data.message);
        swal("Create Auto Reply", data.message, "success");

        setAddAutoReplyModal(false);
        loadAutoReply();
        setKeyword("");
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
      }
    } catch (error) {
      swal("Create Auto Reply", error, "error");
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
              menuItem ? <ListGroup.Item
                key={"menu-" + i}
                as="li"
                className="d-flex justify-content-between align-items-start bg-white"
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold text-primary">
                    {i + 1}. {menuItem.title ?? ""}
                  </div>
                  <small>{menuItem.description ?? ""}</small>
                </div>
              </ListGroup.Item> : <></>
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
        show={addAutoReplyModal}
        onHide={setAddAutoReplyModal}
      >
        <div className="" role="document">
          <div className="">
            <form onSubmit={onSubmit}>
              <div className="modal-header">
                <h4 className="modal-title fs-20">Add Auto Reply</h4>
                <button
                  type="button"
                  className="close"
                  onClick={() => setAddAutoReplyModal(false)}
                >
                  <span>×</span>
                </button>
              </div>
              <div className="modal-body">
                <i className="flaticon-cancel-12 close"></i>
                <div className="add-contact-box">
                  <div className="add-contact-content">
                    <div className="form-row">
                      <div className="form-group col-md-4">
                        <label className="required-field">Message Type</label>
                        <select
                          className="form-control"
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value)}
                        //defaultValue="Choose"
                        >
                          {messageTypeList.map((type, i) => (
                            <option key={i} value={type.id}>{type.title}</option>
                          ))}
                        </select>
                      </div>


                      <div className="form-group col-md-4">
                        <label className="required-field">Instance</label>
                        {instances.length === 0 ? (

                          <p>No Instance Found</p>

                        ) : <select
                          className="form-control"
                          id="inputState"
                          value={selectedInstance}
                          onChange={(e) =>
                            setSelectedInstance(e.target.value)
                          }
                        //defaultValue="Choose"
                        >
                          <option value="">---Select Instance---</option>
                          {instances.map((instance, i) => (
                            <option className={instance.number !== "" ? "text-green" : "text-danger"} key={i} value={instance._id}>
                              {instance.name}({instance.number !== "" ? instance.number : " Not Connected "})
                            </option>
                          ))}
                        </select>

                        }
                      </div>

                      <div className="form-group col-md-4">
                        <label className="required-field">Keyword</label>
                        {/* <input
                          type="text"
                          value={keyword}
                          onChange={(e) => setKeyword(e.target.value)}
                          placeholder="Keyword"
                          className="form-control"
                        /> */}


                        <Typeahead
                          onInputChange={(value) => setKeyword(value)}
                          onChange={(value) => setKeyword(value[0])}
                          id="k1"
                          labelKey="name"

                          defaultInputValue={keyword}
                          options={options}
                          placeholder="Keyword"
                        />

                        {errors.keyword && (
                          <div className="text-danger fs-12">
                            {errors.keyword}
                          </div>
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

                            force_br_newlines: true,
                            force_p_newlines: false,
                            forced_root_block: '' // Needed for 3.x
                          }}
                        />

                        <p className="text-danger">You Can Add Name In Response By Add Variable : %name%</p>
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
                            {/*  <input
                              type="text"
                              value={button1}
                              onChange={(e) => setButton1(e.target.value)}
                              placeholder="Button Text"
                              className="form-control"
                            /> */}

                            <Typeahead
                              id="btn11"
                              labelKey="name"
                              onInputChange={(value) => setButton1(value)}
                              onChange={(value) => setButton1(value[0])}
                              options={options}
                              placeholder="Button Text"
                              defaultInputValue={button1}
                            //selected={button1}
                            />

                            {errors.button1 && (
                              <div className="text-danger fs-12">
                                {errors.button1}
                              </div>
                            )}
                          </div>

                          <div className="form-group col-md-6">
                            <label>Button 2 (Optional)</label>
                            {/* <input
                              type="text"
                              value={button2}
                              onChange={(e) => setButton2(e.target.value)}
                              placeholder="Button Text"
                              className="form-control"
                            /> */}
                            <Typeahead
                              id="btn21"
                              labelKey="name"
                              onInputChange={(value) => setButton2(value)}
                              onChange={(value) => setButton2(value[0])}
                              options={options}
                              placeholder="Button Text"
                              defaultInputValue={button2}
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group col-md-6">
                            <label>Button 3 (Optional)</label>
                            {/*  <input
                              type="text"
                              value={button3}
                              onChange={(e) => setButton3(e.target.value)}
                              placeholder="Button Text"
                              className="form-control"
                            /> */}

                            <Typeahead
                              id="btn31"
                              labelKey="name"
                              onInputChange={(value) => setButton3(value)}
                              onChange={(value) => setButton3(value[0])}
                              defaultInputValue={button3}
                              options={options}
                              placeholder="Button Text"

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
                            {/* <Link onClick={onAddMenu} className="btn btn-sm btn-success">
  Add Menu
</Link> */}
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
                              onClick={handleClick}
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



                    {selectedType === 1 || selectedType === 3 || selectedType === 5 ? (
                      <>
                        <h4 className="mt-4">Media</h4>
                        <small className="text-danger">
                          *support jpg,png,gif,pdf,mp3,mp4. Max 1 Mb
                        </small>

                        <div className="form-row">
                          <div className="form-group col-md-12">
                            <input
                              type="file"
                              onChange={handleFileSelect}
                              placeholder="Upload any Image / Video / Audio / Document File "
                              className="form-control mt-2"
                            />
                            {errors.media && (
                              <div className="text-danger fs-12">
                                {errors.media}
                              </div>
                            )}
                          </div>

                          <div className="form-group col-md-12">
                            <label>Caption (Optional)</label>
                            <input
                              type="text"
                              value={caption}
                              onChange={(e) => setCaption(e.target.value)}
                              placeholder="Caption if any"
                              className="form-control"
                            />
                          </div>
                        </div>
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
                  onClick={() => setAddAutoReplyModal(false)}
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
        show={editAutoReplyModal}
        onHide={setEditAutoReplyModal}
      >
        <div className="" role="document">
          <div className="">
            <form onSubmit={onSaveAutoReply}>
              <div className="modal-header">
                <h4 className="modal-title fs-20">Edit Auto Reply</h4>
                <button
                  type="button"
                  className="close"
                  onClick={() => setEditAutoReplyModal(false)}
                >
                  <span>×</span>
                </button>
              </div>
              <div className="modal-body">
                <i className="flaticon-cancel-12 close"></i>
                <div className="add-contact-box">
                  <div className="add-contact-content">
                    <div className="form-row">
                      <div className="form-group col-md-4">
                        <label className="required-field">Message Type</label>
                        <select
                          className="form-control"
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value)}
                        //defaultValue="Choose"
                        >
                          {messageTypeList.map((type, i) => (
                            <option key={i} value={type.id}>{type.title}</option>
                          ))}
                        </select>
                      </div>

                      {instances.length === 0 ? (
                        <div className="form-group col-md-4">
                          <p>No Instance Found</p>
                        </div>
                      ) : (
                        <div className="form-group col-md-4">
                          <label className="required-field">Instance</label>
                          <select
                            className="form-control"
                            id="inputState"
                            value={selectedInstance}
                            onChange={(e) =>
                              setSelectedInstance(e.target.value)
                            }
                          //defaultValue="Choose"
                          >
                            <option value="">---Select Instance---</option>
                            {instances.map((instance, i) => (
                              <option className={instance.number !== "" ? "text-green" : "text-danger"} key={i} value={instance._id}>
                                {instance.name}({instance.number !== "" ? instance.number : " Not Connected "})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="form-group col-md-4">
                        <label className="required-field">Keyword</label>
                        {/* <input
                          type="text"
                          value={keyword}
                          onChange={(e) => setKeyword(e.target.value)}
                          placeholder="Keyword"
                          className="form-control"
                        /> */}

                        <Typeahead
                          id="k2"
                          onInputChange={(value) => {
                            console.log("onInputChange - " + value)
                            setKeyword(value)
                          }}
                          onChange={(value) => {
                            console.log("onChange - " + value[0])
                            setKeyword(value[0])
                          }}
                          labelKey="keyword"
                          defaultInputValue={keyword}
                          options={options}
                          placeholder="Keyword"
                        //selected={keyword}
                        //selected={keyword}
                        />

                        {errors.keyword && (
                          <div className="text-danger fs-12">
                            {errors.keyword}
                          </div>
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
                        <p className="text-danger">You Can Add Name In Response By Add Variable : %name%</p>
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
                            {/*  <input
                              type="text"
                              value={button1}
                              onChange={(e) => setButton1(e.target.value)}
                              placeholder="Button Text"
                              className="form-control"
                            /> */}


                            <Typeahead
                              id="btn12"
                              labelKey="name"
                              onInputChange={(value) => setButton1(value)}
                              onChange={(value) => setButton1(value[0])}
                              options={options}
                              placeholder="Button Text"
                              defaultInputValue={button1}
                            />

                            {errors.button1 && (
                              <div className="text-danger fs-12">
                                {errors.button1}
                              </div>
                            )}
                          </div>

                          <div className="form-group col-md-6">
                            <label>Button 2 (Optional)</label>
                            {/* <input
                              type="text"
                              value={button2}
                              onChange={(e) => setButton2(e.target.value)}
                              placeholder="Button Text"
                              className="form-control"
                            /> */}
                            <Typeahead

                              id="btn22"
                              labelKey="name"
                              onInputChange={(value) => setButton2(value)}
                              onChange={(value) => setButton2(value[0])}
                              options={options}
                              placeholder="Button Text"
                              defaultInputValue={button2}
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group col-md-6">
                            <label>Button 3 (Optional)</label>
                            {/*  <input
                              type="text"
                              value={button3}
                              onChange={(e) => setButton3(e.target.value)}
                              placeholder="Button Text"
                              className="form-control"
                            /> */}
                            <Typeahead
                              id="btn32"
                              labelKey="name"
                              onInputChange={(value) => setButton3(value)}
                              onChange={(value) => setButton3(value[0])}
                              options={options}
                              placeholder="Button Text"
                              defaultInputValue={button3}
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
                            {/* <Link onClick={onAddMenu} className="btn btn-sm btn-success">
  Add Menu
</Link> */}
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
                              onClick={handleClick}
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



                    {selectedType === 1 || selectedType === 3 || selectedType === 5 ? (
                      <>
                        <h4 className="mt-4">Media</h4>
                        <small className="text-danger">
                          *support jpg,png,gif,pdf,mp3,mp4. Max 1 Mb
                        </small>

                        <div className="form-row">
                          <div className="form-group col-md-12">
                            <input
                              type="file"
                              onChange={handleFileSelect}
                              placeholder="Upload any Image / Video / Audio / Document File "
                              className="form-control mt-2"
                            />
                            {errors.media && (
                              <div className="text-danger fs-12">
                                {errors.media}
                              </div>
                            )}
                          </div>

                          <div className="form-group col-md-12">
                            <label>Caption (Optional)</label>
                            <input
                              type="text"
                              value={caption}
                              onChange={(e) => setCaption(e.target.value)}
                              placeholder="Caption if any"
                              className="form-control"
                            />
                          </div>
                        </div>
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
                  onClick={() => setEditAutoReplyModal(false)}
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
              <div className="mr-auto">
                <h4 className="card-title">Auto Reply</h4>
              </div>

              <Link
                className="btn btn-primary font-w600 mr-2"
                onClick={() => setAddAutoReplyModal(true)}
              >
                Add Auto Reply
              </Link>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center mt-4">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : autoReplyData.length === 0 ? (
                <p>No Auto Reply Found</p>
              ) : (
                <Table responsive className="w-100">
                  <div id="example_wrapper" className="dataTables_wrapper">
                    <table id="example" className="display w-100 dataTable">
                      <thead>
                        <tr role="row">
                          <th>Sr No.</th>
                          <th className="text-center">Instance</th>
                          <th>Keyword</th>
                          <th>Type</th>
                          <th>Response</th>
                          <th>Preview</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.map((d, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td className="text-center">
                              <b>{d.iname}</b>
                              <br/>({d.inumber !==""? d.inumber:" Not Connected "})
                            </td>
                            <td>{d.keyword}</td>
                            <td>{messageTypeList[d.type].title}</td>
                            <td>{d.message}</td>
                            <td>{getResponse(d)}</td>

                            <td>
                              <Button className="btn btn-primary p-2 border-1"><i className="flaticon-381-edit-1" onClick={(e) => onEdit(d)}></i></Button>&nbsp;&nbsp;
                              <Button className="btn btn-danger p-2 border-1"><i className="flaticon-381-trash-1" onClick={(e) => onDelete(d._id)}></i></Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr role="row">
                          <th>Sr No.</th>
                          <th className="text-center">Instance</th>
                          <th>Keyword</th>
                          <th>Type</th>
                          <th>Response</th>
                          <th>Preview</th>
                          <th>Action</th>
                        </tr>
                      </tfoot>
                    </table>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="dataTables_info">
                        Showing {activePage * sort + 1} to&nbsp;
                        {autoReplyData.length < (activePage + 1) * sort
                          ? autoReplyData.length
                          : (activePage + 1) * sort}
                        &nbsp;of {autoReplyData.length} entries
                      </div>
                      <div className="dataTables_paginate paging_simple_numbers">
                        <Pagination
                          className="pagination-primary pagination-circle"
                          size="lg"
                        >
                          <li
                            className="page-item page-indicator "
                            onClick={() =>
                              activePage > 1 && onClick(activePage - 1)
                            }
                          >
                            <Link className="page-link" to="#">
                              <i className="la la-angle-left" />
                            </Link>
                          </li>
                          {pagination.map((number, i) => (
                            <Pagination.Item
                              key={i}
                              className={activePage === i ? "active" : ""}
                              onClick={() => onClick(i)}
                            >
                              {number}
                            </Pagination.Item>
                          ))}
                          <li
                            className="page-item page-indicator"
                            onClick={() =>
                              activePage + 1 < pagination.length &&
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

export default AutoReply;
