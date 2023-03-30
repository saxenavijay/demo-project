import React, { useRef, useState, useEffect, Fragment } from "react";
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

import PageTitle from "../../layouts/PageTitle";

import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";

import axios from "axios";
import swal from "sweetalert";

import { format } from "date-fns";

import messageTypeList from "../../../utils/message-type";

import { CSVLink } from "react-csv";

import DTable from "../../components/Table";

//const Orders = () => {
const Messages = ({ props, history }) => {
  const dispatch = useDispatch();
  const [messageData, setMessageData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [xlsData, setXlsData] = useState([]);
  const csvInstance = useRef(null);

  const profile = useSelector((state) => state.auth.profile);

  const sort = 50;
  let pagination = Array(Math.ceil(messageData.length / sort))
    .fill()
    .map((_, i) => i + 1);

  const [activePage, setActivePage] = useState(0);
  const [tableData, setTableData] = useState([]);

  const [addTemplateModal, setAddTemplateModal] = useState(false);

  const [message, setMessage] = useState("");
  let errorsObj = { instance: "", phone: "", message: "" };
  const [errors, setErrors] = useState(errorsObj);

  const [selectedInstance, setSelectedInstance] = useState("");

  const [name, setName] = useState("");
  const [button1, setButton1] = useState("");
  const [button2, setButton2] = useState("");
  const [button3, setButton3] = useState("");

  const [footer, setFooter] = useState("");

  //menu
  const [middle, setMiddle] = useState("");
  const [button, setButton] = useState("");
  const [menu, setMenu] = useState([]);

  // const messageTypeList = [
  //    {
  //      id:0,
  //      title:"Text"
  //    },
  //    {
  //      id:2,
  //      title:"Quick Reply Button"
  //    }
  //  ];
  const [selectedType, setSelectedType] = useState(0);

  // Data Table Start
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = useState(10);
  const pageSizes = [10, 25, 50, 100];
  const [maxPage, setMaxPage] = useState(1);

  const handlePageChange = (value) => {
    setPage(value);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setPage(0);
  };

  useEffect(() => {
    loadMesssages();
  }, [page, pageSize]);

  // Data Table End

  useEffect(() => {
    loadMesssages();
  }, []);

  useEffect(() => {
    if (
      xlsData &&
      csvInstance &&
      csvInstance.current &&
      csvInstance.current.link
    ) {
      setTimeout(() => {
        csvInstance.current.link.click();
        setXlsData([]);
      });
    }  }, [xlsData]);

  useEffect(() => {
    if (messageData) {
      setLoading(false);
      setTableData(
        messageData.slice(activePage * sort, (activePage + 1) * sort)
      );
    }
  }, [messageData]);

  const loadMesssages = async () => {
    const { data } = await axios.post("http://localhost:5000/api/message/all", {
      page: page,
      limit: pageSize,
    });
    console.log(data);
    if (data.status) {
      var maxPage2 = Math.ceil(data.total / pageSize);
      console.log("max page - " + maxPage2);
      setMaxPage(maxPage2);
      setLoading(false);
      setMessageData(data.messages);
    }
  };

  //const [demo, setdemo] = useState();
  const onClick = (i) => {
    console.log("onClick - " + i);
    setActivePage(i);
    setTableData(messageData.slice(i * sort, (i + 1) * sort));
  };

  const onCancelSending = async () => {
    const { data } = await axios.post("http://localhost:5000/api/message/cancel");

    if (data.status) {
      //setCampaigns(data.campaigns);
      swal("Cancel Sending", data.message, "success");
      loadMesssages();
    } else {
      swal("Cancel Sending", data.message, "error");
    }
  };

  const onStartSending = async () => {
    const { data } = await axios.post("http://localhost:5000/api/message/start");

    if (data.status) {
      //setCampaigns(data.campaigns);
      swal("Start Sending", data.message, "success");
      loadMesssages();
    } else {
      swal("Start Sending", data.message, "error");
    }
  };

  const onPauseSending = async () => {
    const { data } = await axios.post("http://localhost:5000/api/message/pause");

    if (data.status) {
      //setCampaigns(data.campaigns);
      swal("Pause Sending", data.message, "success");
      loadMesssages();
    } else {
      swal("Pause Sending", data.message, "error");
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

    if (selectedType == 2) {
      if (button1 === "") {
        errorObj.button1 = "Button 1 is Required";
        error = true;
      }

      if (footer === "") {
        errorObj.button1 = "Footer is Required";
        error = true;
      }
    }

    if (selectedType == 6) {
      if (footer === "") {
        errorObj.footer = "Footer is Required";
        error = true;
      }

      if (button === "") {
        errorObj.button = "Button is Required";
        error = true;
      }

      if (menu.length == 0) {
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
      const { data } = await axios.post("http://localhost:5000/api/message/create-template", {
        name: name,
        message: message,
        type: selectedType,
        button_1: button1,
        button_2: button2,
        button_3: button3,
        footer: footer,
        middle: middle,
        menus: menu,
      });

      if (data.status === false) {
        //toast.error(data.message);
        swal("Create Template", data.message, "error");
      } else {
        //toast.success(data.message);
        swal("Create Template", data.message, "success");

        setAddTemplateModal(false);
        loadMesssages();
        setMessage("");
        setButton1("");
        setButton2("");
        setButton3("");
        setFooter("");
      }
    } catch (error) {
      swal("Create Template", error, "error");
    }
  };

  const getResponse = (data) => {
    if (data.type == 0) {
      return <p></p>;
    } else if (data.type == 2 || data.type == 3) {
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
    } else if (data.type == 4 || data.type == 5) {
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
    } else if (data.type == 6) {
      return (
        <>
          <div className="text-center">
            <small>{data.middle}</small>
          </div>
          <ListGroup as="ol" numbered>
            {data.menus.map((menuItem, i) =>
              menuItem ? (
                <ListGroup.Item
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
                </ListGroup.Item>
              ) : (
                <></>
              )
            )}
          </ListGroup>
          <div className="text-center">
            <small>{data.footer}</small>
          </div>
        </>
      );
    } else {
      return <></>;
    }
  };

  const getStatus = (data) => {
    if (data.status == 0) {
      return <Badge variant="warning light">Pending</Badge>;
    } else if (data.status == 1) {
      return <Badge variant="success light">Sent</Badge>;
    } else if (data.status == 2) {
      return <Badge variant="danger light">Failed</Badge>;
    } else if (data.status == 3) {
      return <Badge variant="danger light">Instance Not Found</Badge>;
    } else if (data.status == 4) {
      return <Badge variant="danger light">Number invalid</Badge>;
    } else if (data.status == 5) {
      return <Badge variant="danger light">Cancelled</Badge>;
    } else if (data.status == 6) {
      return <Badge variant="warning light">Pause</Badge>;
    } else {
      return "";
    }
  };

  const getStatusText = (data) => {
    if (data.status == 0) {
      return "Pending";
    } else if (data.status == 1) {
      return "Sent";
    } else if (data.status == 2) {
      return "Failed";
    } else if (data.status == 3) {
      return "Instance Not Found";
    } else if (data.status == 4) {
      return "Number invalid";
    } else if (data.status == 5) {
      return "Cancelled";
    } else if (data.status == 6) {
      return "Pause";
    } else {
      return "Unknown";
    }
  };

  const onAddMenu = async (e) => {
    e.preventDefault();

    if (menu.length < 5) {
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

  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  async function sleep(millis) {
    return new Promise((resolve) => setTimeout(resolve, millis));
  }

  const initXlsData = async (done) => {
    var dummy = [];

    const { data } = await axios.post("message/all");

    if (data.status) {
      console.log("total messages - " + data.messages.length);

      var i = 0;
      await asyncForEach(data.messages, async (d) => {
        //data.messages.map((d, i) => {

        //var dummy = [];
        //messageData.map((data,i)=>{

        i++;

        var menuData = d.menus
          .map((m, i) => {
            return i + 1 + ". " + m.title + "\n" + m.description;
          })
          .join("\n\n");

        dummy.push({
          sr_no: i,
          instance:d.instanceId.code+"("+d.instanceId.name+")",
          instance_number:d.instanceNumber??"",
          number: d.number,
          type: messageTypeList[d.type].title,
          message: d.message,
          reply_button_1: d.button1,
          reply_button_2: d.button2,
          reply_button_3: d.button3,

          call_button: d.callButton,
          calling_number: d.callingNumber,
          web_url_button: d.webUrlButton,
          web_url: d.webUrl,

          menu_middle: d.middle,
          footer: d.footer,
          menu_button: d.button,
          menus: menuData,
          is_autoreply: d.autoReply ? "Yes" : "No",
          status: getStatusText(d),
          created_at: format(new Date(d.createdAt), "dd/MM/yyyy H:mma"),
        });
      });

      setXlsData(dummy);
    }

    return dummy;
  };

  const columns = [
    {
      Header: "SN",
      accessor: "_id",
      sort: false,
      

      Cell: (row) => {
        return <div>{Number(row.row.id) + page * pageSize + 1}</div>;
      },
    },
    {
      Header: "Instance",
      accessor: "instanceId",
      //colspan:2,
      //width: getColumnWidth(rows, 'key', 'Key'),
      //style: { width: '40%', textAlign: 'center' },
      Cell: ({ row }) => {
        const d = row.original;
        return (
          <div>
            <b>{d.iname}</b>
            <br />({d.inumber})
          </div>
        );

        //return <span style={{whiteSpace:"nowrap"}} onClick={() => {navigator.clipboard.writeText(d.key)}}>{d.key}</span>;
        //return <input  className="form-control" style={{ width: '40%', textAlign: 'center' }} type="text" value={d.key} readOnly={true}></input>;
      },
    },
    {
      Header: "From Number",
      accessor: "instanceNumber",
      sort: false,
    },
    {
      Header: "To Number",
      accessor: "number",
      sort: false,
    },
    {
      Header: "Type",
      accessor: "type",
      sort: false,
      Cell: ({ row }) => {
        const d = row.original;

        return messageTypeList[d.type].title;
      },
    },

    {
      Header: "Message",
      accessor: "message",
      sort: false,
    },

    {
      Header: "Preview",
      accessor: "",
      sort: true,
      Cell: ({ row }) => {
        const d = row.original;
        return getResponse(d);
        //return d.campaignId ? d.campaignId.name : "";
      },
    },

    {
      Header: "Is Auto Reply",
      accessor: "autoReply",
      sort: true,
      Cell: ({ row }) => {
        const d = row.original;
        return d.autoReply ? "Yes" : "No";
        //return d.valid + " Days";
      },
    },

    {
      Header: "Status",
      accessor: "status",
      sort: true,
      Cell: ({ row }) => {
        const d = row.original;
        return getStatus(d);
        //return <></>;
        //return <div className="text-center">{keyStatus(d)}</div>
      },
    },

    {
      Header: "Time",
      accessor: "createdAt",
      sort: true,
      Cell: ({ row }) => {
        const d = row.original;
        return d.createdAt
          ? format(new Date(d.createdAt), "dd/MM/yyyy H:mma")
          : "No";
      },
    },
  ];

  return (
    <>
      <Fragment>
        {/* <PageTitle activeMenu="Datatable" motherMenu="Table" /> */}

        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="mr-auto">
                <h4 className="card-title">All Messages</h4>
              </div>

              {xlsData.length > 0 ? (
                <CSVLink
                  ref={csvInstance}
                  data={xlsData}
                  filename={"sent-messages.csv"}
                  className="btn btn-sm btn-primary mr-2"
                  target="_blank"
                >
                  Export
                </CSVLink>
              ) : (
                <Button
                  className="btn btn-sm btn-primary mr-2"
                  onClick={() => initXlsData()}
                >
                  Export
                </Button>
              )}

              <Button
                className="btn btn-sm btn-primary font-w600 mr-2"
                onClick={() => onStartSending()}
              >
                <i className="flaticon-381-play-button"></i>&nbsp;&nbsp; Start
                Sending
              </Button>

              <Button
                className="btn btn-sm btn-secondary font-w600 mr-2"
                onClick={() => onPauseSending()}
              >
                <i className="flaticon-381-pause"></i>&nbsp;&nbsp; Pause Sending
              </Button>

              <Button
                className="btn btn-sm btn-danger font-w600 mr-2"
                onClick={() => onCancelSending()}
              >
                <i className="flaticon-381-error"></i>&nbsp;&nbsp; Cancel
                Sending
              </Button>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center mt-4">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : messageData.length === 0 ? (
                <p>No Message Found</p>
              ) : (
                <DTable
                  columns={columns}
                  data={messageData}
                  pageSize={pageSize}
                  isSortable={true}
                  pagination={false}
                  pageSizes={pageSizes}
                  page={page}
                  maxPage={maxPage}
                  handlePageChange={handlePageChange}
                  handlePageSizeChange={handlePageSizeChange}
                />
              )}

              {/* <Table responsive className="w-100">
                  <div id="example_wrapper" className="dataTables_wrapper">
                    <table id="example" className="display w-100 dataTable">
                      <thead>
                        <tr role="row">
                          <th>Sr No.</th>
                          <th>Instance</th>
                          <th>Number</th>
                          <th>Type</th>
                          <th>Message</th>
                          <th>Preview</th>
                          <th>Is Auto Reply</th>
                        
                          <th>Status</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.map((d, i) => (
                          <tr key={d.id}>
                            <td>{i + 1}</td>
                            <td>
                              <b>{d.instanceId.code}</b>
                              <br />({d.instanceId.name})
                            </td>
                            <td>{d.number}</td>
                            <td>{messageTypeList[d.type].title}</td>
                            <td>{d.message}</td>
                            <td>{getResponse(d)}</td>
                            <td>{d.autoReply ? "Yes" : "No"}</td>
                            
                            <td>{getStatus(d)}</td>

                            <td>
                              {format(
                                new Date(d.createdAt),
                                "dd/MM/yyyy H:mma"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr role="row">
                          <th>Sr No.</th>
                          <th>Instance</th>
                          <th>Number</th>
                          <th>Type</th>
                          <th>Message</th>
                          <th>Preview</th>
                          <th>Is Auto Reply</th>
                         
                          <th>Status</th>
                          <th>Time</th>
                        </tr>
                      </tfoot>
                    </table>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="dataTables_info">
                        Showing {activePage * sort + 1} to&nbsp;
                        {messageData.length < (activePage + 1) * sort
                          ? messageData.length
                          : (activePage + 1) * sort}
                        &nbsp;of {messageData.length} entries
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
              )}*/}
            </div>
          </div>
        </div>
      </Fragment>
    </>
  );
};

export default Messages;
