import React,{useState} from "react";
import { Modal } from "reactstrap";

function MyComponent() {
    const [modal, setModal] = useState(false);
    
  
    return (
      <div>
        <Modal
        size="lg"
        isOpen={modal}
        toggle={()=>setModal(!modal)}
      >
          <h4>Hello Popup</h4>
      </Modal>
      <button className="btn btn-primary" onClick={() => setModal(true)}>Show</button>
      </div>
    );
  }
  export default MyComponent;