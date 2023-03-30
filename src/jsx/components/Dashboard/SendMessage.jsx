import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { nanoid } from "nanoid";
import xlsx from "xlsx";
import axios from "axios";
import Moment from "moment";
import { format } from "date-fns";

import { useDispatch, useSelector } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CSVLink } from "react-csv";
import { InputTags } from "react-bootstrap-tagsinput";
import "react-bootstrap-tagsinput/dist/index.css";

import ReactEmojiTextArea from "@nikaera/react-emoji-textarea";

import InputEmoji from "react-input-emoji";

import { Editor } from "@tinymce/tinymce-react";

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
  Form,
} from "react-bootstrap";

import Select from "react-select";

import { getProfile } from "../../../store/actions/AuthActions";
import axiosInstance from "../../../services/AxiosInstance";
import messageTypeList from "../../../utils/message-type";


import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import { Typeahead } from 'react-bootstrap-typeahead';




const SendMessagePage = ({ props, history }) => {
  const dispatch = useDispatch();

  const textAreaRef = useRef(null);

  const [editedMessage, setEditedMessage] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");

  const [instances, setInstances] = useState([]);
  const [templates, setTemplates] = useState([]);

  const [sending, setSending] = useState(false);



  const [selectedInstanceList, setSelectedInstanceList] = useState([]);

  let errorsObj = { instance: "", phone: "", message: "" };
  const [errors, setErrors] = useState(errorsObj);
  const profile = useSelector((state) => state.auth.profile);

  const [selectedInstance, setSelectedInstance] = useState("");

  const [selectedTemplate, setSelectedTemplate] = useState(-1);

  const [showEmoji, setShowEmoji] = useState(false);
  const [isSchedule, setIsSchedule] = useState(false);
  const [datetime, setDateTime] = useState(new Date());

  //button
  const [button1, setButton1] = useState("");
  const [button2, setButton2] = useState("");
  const [button3, setButton3] = useState("");
  const [footer, setFooter] = useState("");

  //list/menu
  const [middle, setMiddle] = useState("");
  const [button, setButton] = useState("");

  const [menu, setMenu] = useState([{ title: "", description: "" }]);

  //call to action
  const [callButton, setCallButton] = useState("");
  const [callingNumber, setCallingNumber] = useState("");

  const [webUrlButton, setWebUrlButton] = useState("");
  const [webUrl, setWebUrl] = useState("");

  const [caption, setCaption] = useState("");

  //media
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const [checkAllNumber, setCheckAllNumber] = useState(false);
  const [bulkUploadModal, setBulkUploadModal] = useState(false);

  const [bulkNumberList, setBulkNumberList] = useState([]);
  const [phoneNumberList, setPhoneNumberList] = useState([]);
  const [numbers, setNumbers] = useState([]);

  const [options, setOption] = useState([]);

  // 0 => 'text'
  // 1 => 'text-with-media
  // 2 => 'quick-reply-button'
  // 3 => 'quick-reply-button-with-media'
  // 4 => 'call-to-action-button'
  // 5 => 'call-to-action-button-with-media'

  const [selectedType, setSelectedType] = useState(0);

  useEffect(() => {
    dispatch(getProfile());
    loadInstance();
    loadTemplates();

  }, [dispatch]);

  const loadInstance = async () => {
    const { data } = await axios.post("http://localhost:5000/api/message/instances");

    if (data.status) {
      setInstances(data.inatances);

      if (data.inatances.length > 0) {
        setSelectedInstance(data.inatances[0].id);
      }
    }
  };

  const loadTemplates = async () => {
    const { data } = await axios.post("http://localhost:5000/api/message/templates");

    if (data.status) {
      setTemplates(data.templates);

      var dummy = options;

      data.templates.forEach((data) => {

        if (!dummy.includes(JSON.stringify(data.button1)) && data.button1 != "") {
          dummy.push(data.button1);
        }

        if (!dummy.includes(JSON.stringify(data.button2)) && data.button2 != "") {
          dummy.push(data.button2);
        }

        if (!dummy.includes(JSON.stringify(data.button3)) && data.button1 != "") {
          dummy.push(data.button3);
        }

      });

      setOption(dummy);

    }

    loadAutoReply();
  };

  const loadAutoReply = async () => {
    const { data } = await axios.post("http://localhost:5000/api/message/auto-replies");

    if (data.status) {
      //setTemplates(data.templates);

      var dummy = [...options];

      data.autoreplies.forEach((data) => {
        if (!dummy.includes(JSON.stringify(data.button1)) && data.button1 != "") {
          dummy.push(data.button1);
        }

        if (!dummy.includes(JSON.stringify(data.button2)) && data.button2 != "") {
          dummy.push(data.button2);
        }

        if (!dummy.includes(JSON.stringify(data.button3)) && data.button1 != "") {
          dummy.push(data.button3);
        }
      });

      setOption(dummy);

    }
  };

  const onChangeTemplate = async (i) => {
    console.log("onChangeTemplate - " + i);

    if (i == -1) {
      setSelectedType(0);
      setButton("");
      setFooter("");
      setMiddle("");

      setButton1("");
      setButton2("");
      setButton3("");

      setMenu([{ title: "", description: "" }]);
    } else {
      const template = templates.at(Number(i));

      console.log("template size - " + templates.length);

      console.log("all templates - " + JSON.stringify(templates));

      console.log("template - " + template);
      console.log("template json - " + JSON.stringify(template));

      setSelectedType(template.type ?? 0);

      //setMessage(template.message ?? "");
      //setEditedMessage(template.message ?? "")

      setMessage(template.message ?? "");
      //setEditedMessage(autoReply.message ?? "");

      var m = template.message ?? "";
      m = m.replace(/\r?\n|\r/g, '<br>');

      setEditedMessage(m);

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

      // setMenu((menu) => [
      //    ...menu,
      //    { title: "", description: "" },
      //  ]);
    }

    setSelectedTemplate(i);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    let error = false;
    const errorObj = { ...errorsObj };

    if (selectedInstance === "") {
      errorObj.instance = "Instance is Required";
      error = true;
    }

    if (numbers.length == 0) {
      errorObj.phone = "Phone is Required";
      error = true;
    }

    if (message === "") {
      errorObj.message = "Message is Required";
      error = true;
    }

    if (selectedType == 2 || selectedType == 3) {
      if (button1 === "") {
        errorObj.button1 = "Button 1 is Required";
        error = true;
      }

      if (footer === "") {
        errorObj.footer = "Footer Text is Required";
        error = true;
      }
    } else if (selectedType == 4 || selectedType == 5) {
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
    } else if (selectedType == 6) {
      if (menu.length === 0) {
        errorObj.menu = "Minimum 1 menu is Required";
        error = true;
      }

      if (footer === "") {
        errorObj.footer = "Footer Text is Required";
        error = true;
      }

      if (button === "") {
        errorObj.button = "Button Text is Required";
        error = true;
      }
    }

    if (
      (selectedType == 1 || selectedType == 3 || selectedType == 5) &&
      selectedFile == null
    ) {
      errorObj.media = "Media is Required";
      error = true;
    }

    if (isSchedule && !datetime) {
      errorObj.media = "Schedule Datetime is Required";
      error = true;
    }

    setErrors(errorObj);
    if (error) {
      console.log("error on send - " + error);
      return;
    }

    try {

      setSending(true);

      var numberData = [];

      for (let key in numbers) {
        const data = numbers[key];
        numberData.push({ number: data ?? "", name: "" });
      }

      const formData = new FormData();

      if (selectedType == 1 || selectedType == 3 || selectedType == 5) {
        formData.append("media", selectedFile);
        formData.append("caption", caption);
      }



      formData.append("message", message);
      formData.append("numbers", JSON.stringify(numberData));
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
      formData.append("is_schedule", isSchedule);
      formData.append("schedule", datetime);
      formData.append("instances", JSON.stringify(selectedInstanceList.map((x) => x.value)));

      /* const data = await axiosInstance({
      method: "post",
      url: "message/send",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    }); */

      const { data } = await axios.post(
        "http://localhost:5000/api/message/send",
        formData,
        { "Content-Type": "multipart/form-data" }
        /* {
               message:message,
              numbers:numberData,
              instance_id:selectedInstance,

              type:selectedType,
              button_1:button1,
              button_2:button2,
              button_3:button3,
              footer:footer,

              menus:menu,
              middle:middle,
              button:button,

              call_button:callButton,
              calling_number:callingNumber,
              web_url_button:webUrlButton,
              web_url:webUrl 
            
            } */
      );

      if (data.status === false) {
        //toast.error(data.message);
        swal("Send Message", data.message, "error");
      } else {
        //toast.success(data.message);
        swal("Send Message", data.message, "success");
        setPhone("");
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
        setCaption("");

        setSelectedFile(null);
      }

      setSending(false);
    } catch (error) {
      setSending(false);
      console.log("send message error - " + error)
      swal("Send Message", error.message, "error");
    }
  };



  const onAddMenu = async (e) => {
    e.preventDefault();

    if (menu.length < 30) {
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
        return element != value;
      });
      setMenu(newArray);
    } else {
      swal("Remove Menu", "Yet list 1 menu is required.", "error");
    }
  };

  const upload = (e) => {
    e.preventDefault();
    document.getElementById("selectFile").click();
  };

  const handleClick = (event) => {
    const { target = {} } = event || {};
    target.value = "";
  };

  const readUploadFile = (e) => {
    e.preventDefault();

    console.log("readUploadFile");

    if (e.target.files) {
      console.log("readUploadFile file found");
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);

        console.log(json);

        //json to array
        var dummy = [];
        for (let i in json) {
          dummy.push({ ...json[i], id: i });
        }

        setBulkNumberList(dummy);
        setBulkUploadModal(true);
        e.target.value = null;
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    } else {
      console.log("readUploadFile file not found");
    }
  };

  function onAllNumberCheck(checked) {
    console.log("onAllNumberCheck - " + checked);

    if (checked) {
      let dummy = [];
      for (let key in bulkNumberList) {
        dummy.push(Number(key));
      }

      setPhoneNumberList(dummy);
      console.log("onAllNumberCheck number - " + JSON.stringify(dummy));
    } else {
      setPhoneNumberList([]);
      console.log("onAllNumberCheck number removed");
    }

    setCheckAllNumber(checked);
  }

  function onNumberCheck(data, checked) {
    console.log("onNumberCheck - " + checked);

    const dummy = [...bulkNumberList];

    if (checked) {
      dummy.push(data);
      setPhoneNumberList(dummy);

      if (dummy.length != phoneNumberList.length) {
        setCheckAllNumber(false);
      } else {
        setCheckAllNumber(true);
      }

      console.log("onNumberCheck item " + data + " added");
    } else {
      const memberIndex = dummy.findIndex((x) => x === data);

      if (memberIndex != -1) {
        dummy.splice(memberIndex, 1);
        console.log("onNumberCheck item " + memberIndex + " removed");
      } else {
        //dummy.push(memberId);
        console.log("onNumberCheck item " + memberIndex + " not found");
      }

      console.log("onNumberCheck members - " + JSON.stringify(dummy));

      setPhoneNumberList(dummy);
      setCheckAllNumber(false);
    }
  }

  async function onBulkAdd() {
    let dummy = [];
    for (let key in phoneNumberList) {
      const data = bulkNumberList[phoneNumberList[key]];
      /* const newData = {
         name:data.name??"",
         email:data.email??"",
         department:data.department??"",
         designation:data.designation??""
      } */
      dummy.push(data.number ? data.number.toString().trim() : "");
    }

    setNumbers(dummy);
    setPhone(dummy.join(","));
    console.log("onBulkAdd members - " + JSON.stringify(dummy));
    setBulkUploadModal(false);

    //invite memner api call
    //dispatch(bulkInviteMemberAction(dummy,history));
  }

  return (
    <>
      <Modal
        className="modal fade"
        show={bulkUploadModal}
        onHide={setBulkUploadModal}
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>Select Numbers</Modal.Title>
          <Button
            variant=""
            className="close"
            onClick={() => setBulkUploadModal(false)}
          >
            <span>&times;</span>
          </Button>
        </Modal.Header>

        <Modal.Body>
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <div className="custom-control custom-checkbox checkbox-success check-lg mr-3">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="checkAll"
                      required=""
                      checked={checkAllNumber}
                      onChange={(e) => onAllNumberCheck(e.target.checked)}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="checkAll"
                    ></label>
                  </div>
                </th>
                {/* <th>
                                 <strong>NAME</strong>
                              </th> */}
                <th>
                  <strong>Phone Number</strong>
                </th>
              </tr>
            </thead>
            <tbody>
              {bulkNumberList.map((item, i) => (
                <tr key={i}>
                  <td>
                    <div className="custom-control custom-checkbox checkbox-success check-lg mr-3">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id={"checkbox-" + i}
                        checked={phoneNumberList.includes(i)}
                        onChange={(e) => onNumberCheck(i, e.target.checked)}
                        required=""
                      />
                      <label
                        className="custom-control-label"
                        htmlFor={"checkbox-" + i}
                      ></label>
                    </div>
                  </td>
                  {/*  <td>
                                 <div className="d-flex align-items-center">
                                  {""}
                                    <span className="w-space-no">
                                       {item.name}
                                    </span>
                                 </div>
                              </td> */}
                  <td>{item.number} </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="danger light"
            onClick={() => setBulkUploadModal(false)}
          >
            Close
          </Button>
          <Button
            variant=""
            type="button"
            className="btn btn-primary"
            onClick={(e) => onBulkAdd()}
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      <Row>
        <Col lg={12}>
          <p>Send Broadcast Messages To Any Numbers Without Saving Number.</p>

          <h5>
            <span className="text-danger">Note</span>
          </h5>
          <p>
            1 .Send Broadcast Messages Can Leads Your Number Blocking Issue (If
            User Report). We Suggest Send Broadcast With Quick Reply Button
            <br />
            2. When Do Broadcast Make Sure Your Targeted Number Is Avaviable On
            Whatsapp (Filter Your Number Before Broadcast)
          </p>

          <Card>
            <Card.Header>
              <div class="d-flex">
                <Card.Title className="mr-auto p-2">Send Message</Card.Title>
              </div>

              <div class="d-flex justify-content-end">
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
                  id="plus"
                  onClick={upload}
                >
                  Bulk Upload
                </Link>

                <input
                  id="selectFile"
                  accept=".csv, .xls, .xlsx, text/csv, application/csv,
text/comma-separated-values, application/csv, application/excel,
application/vnd.msexcel, text/anytext, application/vnd. ms-excel,
application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  hidden
                  type="file"
                  onChange={readUploadFile}
                  onClick={handleClick}
                />
              </div>
            </Card.Header>
            <Card.Body>
              <form onSubmit={onSubmit}>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label className="required-field">Template</label>
                    <select
                      className="form-control"
                      value={selectedTemplate}
                      onChange={(e) => onChangeTemplate(e.target.value)}
                    >
                      <option value={-1}>New Message</option>

                      {templates.map((template, i) => (
                        <option value={i}>
                          {i + 1}. {template.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group col-md-6">
                    <label className="required-field">Instance</label>
                    {instances.length == 0 ? (

                      <p>No Instance Found</p>

                    ) : <select
                      className="form-control"
                      id="inputState"
                      value={selectedInstance}
                      onChange={(e) => setSelectedInstance(e.target.value)}
                    //defaultValue="Choose"
                    >

                      {instances.length > 1 ? <option value="all">All Instances</option> : <></>}

                      {instances.length > 1 ? <option value="multi">Multi Instance</option> : <></>}

                      {instances.map((instance, i) => (
                        <option key={i} className={instance.number !== "" ? "text-green" : "text-danger"} value={instance._id}>{instance.name}({instance.status ==="Ready" ? instance.number :" Not Connected "})</option>
                      ))}
                    </select>}
                  </div>

                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label className="required-field">Message Type</label>
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




                  {selectedInstance == "multi" ? <div className="form-group col-md-6">
                    <label className="required-field">Select Instances For Parallel Send</label>
                    <Select
                      className="form-multi-select"
                      closeMenuOnSelect={false}

                      //components={{ ClearIndicator }}
                      //   styles={{ clearIndicator: (base, state) => ({
                      //     ...base,
                      //     cursor: "pointer",
                      //     color: state.isFocused ? "blue" : "black",
                      //  }) }}

                      defaultValue={[]}
                      isMulti
                      options={instances.map((x) => {
                        return { value: x.id, label: x.code + "(" + x.name + ")" };
                      })}
                      value={selectedInstanceList}
                      onChange={(value) => {
                        setSelectedInstanceList(value)
                        //console.log("multi instance - "+JSON.stringify(value))
                      }}
                    />  </div> : <></>}



                </div>

                <div className="form-row">
                  <div className="form-group col-md-12">
                    <label className="required-field">Phone Number</label>

                    {/*  <div className='input-group'>
        <InputTags placeholder="e.g 91..."   values={numbers} onTags={(value) => setNumbers(value.values)} />
        <button
          className='btn btn-primary'
          type='button'
          data-testid='button-clearAll'
          
          onClick={() => {
            setNumbers([])
          }}
        >
          Delete all
        </button>

      </div> */}

                    <textarea
                      rows="5"
                      type="text"
                      value={phone}
                      className="form-control"
                      autocomplete="off"
                      required="required"
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setNumbers(e.target.value.split(","));
                      }}
                      placeholder="e.g 91987654321,91987654321"
                    />

                    {/*  <input
                                                   type="text"
                                                   value={phone}
                                                   onChange={(e) =>
                                                      setPhone(e.target.value)
                                                   }
                                                   placeholder="e.g 91..."
                                                   className="form-control"
                        
                                                /> */}
                    {errors.phone && (
                      <div className="text-danger fs-12">{errors.phone}</div>
                    )}
                    <small>Total Phone Number: {numbers.length}</small>
                    <p><strong>Note:</strong> Use "," to enter multiple number &amp; number must be with country code</p>

                  </div>

                  {/*   <div className="col-md-12">
                        <p>
                        {numbers.map((item, index) => (
                            ((index > 0) ? ", " : "") + item
                        ))}
                        </p>
                        </div> */}

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


                        //message = message.replace("<p>", "");
                        //message = message.replace("</p>", "");

                        setEditedMessage(message);

                        console.log(
                          "newValue - " + newValue
                        );


                        var msgText = editor.getContent({ format: "text" });

                        //msgText = msgText.replace(/\r?\n|\r/g, '</br>');
                        //msgText = msgText.replace("\n\n", '\n');

                        console.log("message - " + msgText);

                        setMessage(msgText);
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

                    {errors.message && (
                      <div className="text-danger fs-12">{errors.message}</div>
                    )}
                  </div>

                  {/*                                               
<div className="col-md-2">
<Button className="btn btn-sm btn-light m-4" onClick={(e)=>{
   setShowEmoji(!showEmoji);
}}>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="react-input-emoji--button--icon"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10"></path><path d="M8 7a2 2 0 1 0-.001 3.999A2 2 0 0 0 8 7M16 7a2 2 0 1 0-.001 3.999A2 2 0 0 0 16 7M15.232 15c-.693 1.195-1.87 2-3.349 2-1.477 0-2.655-.805-3.347-2H15m3-2H6a6 6 0 1 0 12 0"></path></svg>
</Button>
</div>   
</div>   */}

                  {/* <textarea rows="5" type="text" value={message}  className="form-control"  autocomplete="off"
														name="message" required="required"
                                          onChange={(e) =>
                                             setMessage(e.target.value)
                                          }
														placeholder="Enter Message"
													/> */}
                </div>

                {selectedType == 2 || selectedType == 3 ? (
                  <>
                    <h4 className="mt-4">Quick Reply Button</h4>

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
                          id="basic-typeahead-single"
                          labelKey="name"

                          options={options}
                          placeholder="Button Text"
                          onInputChange={(value) => setButton1(value)}
                          onChange={(value) => setButton1(value[0])}
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
                        {/*  <input
                          type="text"
                          value={button2}
                          onChange={(e) => setButton2(e.target.value)}
                          placeholder="Button Text"
                          className="form-control"
                        /> */}

                        <Typeahead
                          id="basic-typeahead-single"
                          labelKey="name"

                          options={options}
                          placeholder="Button Text"
                          onInputChange={(value) => setButton2(value)}
                          onChange={(value) => setButton2(value[0])}
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
                          id="basic-typeahead-single"
                          labelKey="name"

                          options={options}
                          placeholder="Button Text"
                          onInputChange={(value) => setButton3(value)}
                          onChange={(value) => setButton3(value[0])}
                          defaultInputValue={button3}
                        />
                      </div>

                      <div className="form-group col-md-6">
                        <label>Footer</label>
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

                {selectedType == 4 || selectedType == 5 ? (
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
                        <label>Footer</label>
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

                {selectedType == 6 ? (
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
                          <label className={i == 0 ? "required-field" : ""}>
                            Menu {i + 1} Title {i > 0 ? "(Optional)" : ""}
                          </label>
                          {/*  <Form.Control
                            className="main"
                            type="text"
                            placeholder="Title"
                            value={menuItem.title}
                            onChange={(e) =>
                              onChangeMenuTitle(i, e.target.value)
                            }
                          /> */}

                          <Typeahead
                            id="basic-typeahead-single"
                            labelKey="name"
                            onChange={(value) => onChangeMenuTitle(i, value[0])}
                            options={options}
                            placeholder="Button Text"
                            onInputChange={(value) => onChangeMenuTitle(i, value)}
                            defaultInputValue={menuItem.title}
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
                          {menu.length == 1 ? (
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

                {selectedType == 1 || selectedType == 3 || selectedType == 5 ? (
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
                          onClick={handleClick}
                          placeholder="Caption if any"
                          className="form-control"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}



                <div className="form-row">

                  <div className="form-group col-md-4">
                    <label>Send Now</label>
                    <select
                      className="form-control"
                      value={isSchedule ? "no" : "yes"}
                      onChange={(e) => setIsSchedule(e.target.value == "no")}
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  {isSchedule ? <div className="form-group col-md-4">

                    <label className="required-field">Schedule</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <DateTimePicker
                        label=""
                        inputVariant="outlined"
                        value={datetime}
                        onChange={setDateTime}
                      />
                    </MuiPickersUtilsProvider>

                  </div> : <></>}
                </div>

                {sending ?
                  <div className="ml-2 p-2"><Spinner animation="border" variant="primary" /></div>
                  : <button className="btn btn-primary" type="submit">
                    Send
                  </button>}
              </form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default SendMessagePage;