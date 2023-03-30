import axios from 'axios';
import swal from 'sweetalert';

const onLogin = async (key = '') => {
    if (key === "") {
      let response = await axios.post('http://localhost:5000/api/message/login');
      if(response.data.type==="success"){
        return true;
      }else if(response.data.type==="error"){
        return response.data.type;
      }else{
        console.log(response.data);
        return false;
      }
    } else {
      let response = await axios.post('http://localhost:5000/api/message/login', { key: key });
      console.log(response.data);
      if (response.data.type === "success") {
        swal(response.data.msg,"Welcome "+response.data.user, "success");
        window.location.reload();
        return true;
      } else if (response.data.type === 'error') {
        swal("Please Enter Valid Key...!", response.data.msg, "error");
        return false;
      } else {
        return false;
      }
    }
}

export default onLogin;