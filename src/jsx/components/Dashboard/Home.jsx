import React,{ useState,useEffect} from "react";
import { Link } from "react-router-dom";

import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import axios from "axios";

import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import menu03 from "../../../images/menus/3.png";
import menu02 from "../../../images/menus/2.png";
import menu01 from "../../../images/menus/1.png";

import testimonial from "../../../images/testimonial/1.jpg";
import testimonial2 from "../../../images/testimonial/2.jpg";
import testimonial3 from "../../../images/testimonial/3.jpg";

import {Spinner,Table, Pagination,Col,Row,Card,Badge, Dropdown, Tab, Nav } from "react-bootstrap";

import { useDispatch,useSelector } from "react-redux";

import axiosInstance from '../../../services/AxiosInstance';

import {
	getProfile,
 } from '../../../store/actions/AuthActions';

// import Ext from "../../layouts/Ext";




const Home = () => {

   const dispatch = useDispatch();

   const [statistics, setStatistics] = useState(null);
   const profile = useSelector((state) => state.auth.profile);
   
   useEffect(() => {
		// dispatch(getProfile());
      loadStatistics();
	  }, [dispatch]);



   async function loadStatistics(){
		
      try {
         
         const { data } = await axios.get(
              "http://localhost:5000/api/auth/statistics"
         );
   

     console.log("statistics data - "+JSON.stringify(data));
   
      if(data.status === false){
         
      }else{
         setStatistics(data);
      }
      
      }catch (error) {
         
   
      }
   
     }
   


   function SampleNextArrow(props) {
      const { onClick } = props;
      return (
         <div className="owl-next" onClick={onClick} style={{ zIndex: 99 }}>
            <i className="fa fa-caret-right" />
         </div>
      );
   }

   function SamplePrevArrow(props) {
      const { onClick } = props;
      return (
         <div
            className="owl-prev disabled"
            onClick={onClick}
            style={{ zIndex: 99 }}
         >
            <i className="fa fa-caret-left" />
         </div>
      );
   }

   const settings = {
      focusOnSelect: true,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      speed: 500,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
      responsive: [
         {
            breakpoint: 1599,
            settings: {
               slidesToShow: 2,
               slidesToScroll: 1,
            },
         },
         {
            breakpoint: 990,
            settings: {
               slidesToShow: 1,
               slidesToScroll: 1,
            },
         },
      ],
   };
   return (
      <>
        


         <div className="row">

       
        <div className='col-xl-3 col-xxl-4 col-lg-6 col-sm-6'>
          <div className='widget-stat card bg-success'>
            <div className='card-body p-4'>
              <div className='media'>
                <span className='mr-3'>
                  <img alt="svgImg" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNDgiIGhlaWdodD0iNDgiCnZpZXdCb3g9IjAgMCA0OCA0OCIKc3R5bGU9IiBmaWxsOiMwMDAwMDA7Ij48cGF0aCBmaWxsPSIjZmZmIiBkPSJNNC44NjgsNDMuMzAzbDIuNjk0LTkuODM1QzUuOSwzMC41OSw1LjAyNiwyNy4zMjQsNS4wMjcsMjMuOTc5QzUuMDMyLDEzLjUxNCwxMy41NDgsNSwyNC4wMTQsNWM1LjA3OSwwLjAwMiw5Ljg0NSwxLjk3OSwxMy40Myw1LjU2NmMzLjU4NCwzLjU4OCw1LjU1OCw4LjM1Niw1LjU1NiwxMy40MjhjLTAuMDA0LDEwLjQ2NS04LjUyMiwxOC45OC0xOC45ODYsMTguOThjLTAuMDAxLDAsMCwwLDAsMGgtMC4wMDhjLTMuMTc3LTAuMDAxLTYuMy0wLjc5OC05LjA3My0yLjMxMUw0Ljg2OCw0My4zMDN6Ij48L3BhdGg+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTQuODY4LDQzLjgwM2MtMC4xMzIsMC0wLjI2LTAuMDUyLTAuMzU1LTAuMTQ4Yy0wLjEyNS0wLjEyNy0wLjE3NC0wLjMxMi0wLjEyNy0wLjQ4M2wyLjYzOS05LjYzNmMtMS42MzYtMi45MDYtMi40OTktNi4yMDYtMi40OTctOS41NTZDNC41MzIsMTMuMjM4LDEzLjI3Myw0LjUsMjQuMDE0LDQuNWM1LjIxLDAuMDAyLDEwLjEwNSwyLjAzMSwxMy43ODQsNS43MTNjMy42NzksMy42ODMsNS43MDQsOC41NzcsNS43MDIsMTMuNzgxYy0wLjAwNCwxMC43NDEtOC43NDYsMTkuNDgtMTkuNDg2LDE5LjQ4Yy0zLjE4OS0wLjAwMS02LjM0NC0wLjc4OC05LjE0NC0yLjI3N2wtOS44NzUsMi41ODlDNC45NTMsNDMuNzk4LDQuOTExLDQzLjgwMyw0Ljg2OCw0My44MDN6Ij48L3BhdGg+PHBhdGggZmlsbD0iI2NmZDhkYyIgZD0iTTI0LjAxNCw1YzUuMDc5LDAuMDAyLDkuODQ1LDEuOTc5LDEzLjQzLDUuNTY2YzMuNTg0LDMuNTg4LDUuNTU4LDguMzU2LDUuNTU2LDEzLjQyOGMtMC4wMDQsMTAuNDY1LTguNTIyLDE4Ljk4LTE4Ljk4NiwxOC45OGgtMC4wMDhjLTMuMTc3LTAuMDAxLTYuMy0wLjc5OC05LjA3My0yLjMxMUw0Ljg2OCw0My4zMDNsMi42OTQtOS44MzVDNS45LDMwLjU5LDUuMDI2LDI3LjMyNCw1LjAyNywyMy45NzlDNS4wMzIsMTMuNTE0LDEzLjU0OCw1LDI0LjAxNCw1IE0yNC4wMTQsNDIuOTc0QzI0LjAxNCw0Mi45NzQsMjQuMDE0LDQyLjk3NCwyNC4wMTQsNDIuOTc0QzI0LjAxNCw0Mi45NzQsMjQuMDE0LDQyLjk3NCwyNC4wMTQsNDIuOTc0IE0yNC4wMTQsNDIuOTc0QzI0LjAxNCw0Mi45NzQsMjQuMDE0LDQyLjk3NCwyNC4wMTQsNDIuOTc0QzI0LjAxNCw0Mi45NzQsMjQuMDE0LDQyLjk3NCwyNC4wMTQsNDIuOTc0IE0yNC4wMTQsNEMyNC4wMTQsNCwyNC4wMTQsNCwyNC4wMTQsNEMxMi45OTgsNCw0LjAzMiwxMi45NjIsNC4wMjcsMjMuOTc5Yy0wLjAwMSwzLjM2NywwLjg0OSw2LjY4NSwyLjQ2MSw5LjYyMmwtMi41ODUsOS40MzljLTAuMDk0LDAuMzQ1LDAuMDAyLDAuNzEzLDAuMjU0LDAuOTY3YzAuMTksMC4xOTIsMC40NDcsMC4yOTcsMC43MTEsMC4yOTdjMC4wODUsMCwwLjE3LTAuMDExLDAuMjU0LTAuMDMzbDkuNjg3LTIuNTRjMi44MjgsMS40NjgsNS45OTgsMi4yNDMsOS4xOTcsMi4yNDRjMTEuMDI0LDAsMTkuOTktOC45NjMsMTkuOTk1LTE5Ljk4YzAuMDAyLTUuMzM5LTIuMDc1LTEwLjM1OS01Ljg0OC0xNC4xMzVDMzQuMzc4LDYuMDgzLDI5LjM1Nyw0LjAwMiwyNC4wMTQsNEwyNC4wMTQsNHoiPjwvcGF0aD48cGF0aCBmaWxsPSIjNDBjMzUxIiBkPSJNMzUuMTc2LDEyLjgzMmMtMi45OC0yLjk4Mi02Ljk0MS00LjYyNS0xMS4xNTctNC42MjZjLTguNzA0LDAtMTUuNzgzLDcuMDc2LTE1Ljc4NywxNS43NzRjLTAuMDAxLDIuOTgxLDAuODMzLDUuODgzLDIuNDEzLDguMzk2bDAuMzc2LDAuNTk3bC0xLjU5NSw1LjgyMWw1Ljk3My0xLjU2NmwwLjU3NywwLjM0MmMyLjQyMiwxLjQzOCw1LjIsMi4xOTgsOC4wMzIsMi4xOTloMC4wMDZjOC42OTgsMCwxNS43NzctNy4wNzcsMTUuNzgtMTUuNzc2QzM5Ljc5NSwxOS43NzgsMzguMTU2LDE1LjgxNCwzNS4xNzYsMTIuODMyeiI+PC9wYXRoPjxwYXRoIGZpbGw9IiNmZmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTE5LjI2OCwxNi4wNDVjLTAuMzU1LTAuNzktMC43MjktMC44MDYtMS4wNjgtMC44MmMtMC4yNzctMC4wMTItMC41OTMtMC4wMTEtMC45MDktMC4wMTFjLTAuMzE2LDAtMC44MywwLjExOS0xLjI2NSwwLjU5NGMtMC40MzUsMC40NzUtMS42NjEsMS42MjItMS42NjEsMy45NTZjMCwyLjMzNCwxLjcsNC41OSwxLjkzNyw0LjkwNmMwLjIzNywwLjMxNiwzLjI4Miw1LjI1OSw4LjEwNCw3LjE2MWM0LjAwNywxLjU4LDQuODIzLDEuMjY2LDUuNjkzLDEuMTg3YzAuODctMC4wNzksMi44MDctMS4xNDcsMy4yMDItMi4yNTVjMC4zOTUtMS4xMDgsMC4zOTUtMi4wNTcsMC4yNzctMi4yNTVjLTAuMTE5LTAuMTk4LTAuNDM1LTAuMzE2LTAuOTA5LTAuNTU0cy0yLjgwNy0xLjM4NS0zLjI0Mi0xLjU0M2MtMC40MzUtMC4xNTgtMC43NTEtMC4yMzctMS4wNjgsMC4yMzhjLTAuMzE2LDAuNDc0LTEuMjI1LDEuNTQzLTEuNTAyLDEuODU5Yy0wLjI3NywwLjMxNy0wLjU1NCwwLjM1Ny0xLjAyOCwwLjExOWMtMC40NzQtMC4yMzgtMi4wMDItMC43MzgtMy44MTUtMi4zNTRjLTEuNDEtMS4yNTctMi4zNjItMi44MS0yLjYzOS0zLjI4NWMtMC4yNzctMC40NzQtMC4wMy0wLjczMSwwLjIwOC0wLjk2OGMwLjIxMy0wLjIxMywwLjQ3NC0wLjU1NCwwLjcxMi0wLjgzMWMwLjIzNy0wLjI3NywwLjMxNi0wLjQ3NSwwLjQ3NC0wLjc5MWMwLjE1OC0wLjMxNywwLjA3OS0wLjU5NC0wLjA0LTAuODMxQzIwLjYxMiwxOS4zMjksMTkuNjksMTYuOTgzLDE5LjI2OCwxNi4wNDV6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjwvcGF0aD48L3N2Zz4="/>
                
                </span>
                <div className='media-body text-white text-right'>
                  <p className='mb-1'>Whatsapp Instance</p>
                  <h3 className='text-white'>{statistics ? statistics.instances : 0}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='col-xl-3 col-xxl-4 col-lg-6 col-sm-6'>
          <div className='widget-stat card bg-primary'>
            <div className='card-body p-4'>
              <div className='media'>
                <span className='mr-3'>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAEbElEQVRoge2YzU9cVRiHn3PO/ZgZBgYKVLFNjDsjIbqSFpO68CPGxvDRjHTTpIl/golbMX4vjBtdGVcu3BibJmpSo8ZYLCQuKlalxkjTATuF1gEGkPlg7nFBpzMw9965d2CgJjzLmXPe9/d7z3vOPffCAQcc8L9G7LcAT7QWg/M8Lh1GNQytLhbWvum1+7YPM/ZDmx9Dc/oxLRkVaUaBhzSwksnzb7a44Tb+njAwmNaPCIcXtWAUeLi6LVYyebL/5InEjSm3uftmYOSGftCBIQ1JoXkCUdvPZfEA0pQfusXZ0z0wMqePOpJTGpICBvzyV4tXhtyYHIjbCOFsH9f0FRie052O4qTQnHHgKUD4Va1UdJifXUWXKr9ZlvrJTTw0ycDJ67rDsHhBOCS14Dmhg+VZXFjn+m9LHLo/ijJkRaTN+15zdq2FkhmdKOQZFA5JBM8CVtC5pQ2H1PQyC6lVOntaiLZW/CpTFiYHWm2vuTtageSsjhYkTwtBspjjlIBY2JIsLeSYuZKhmCsRazO3iAewbDXhNz+0gbPXdGTR4hkhSBZhWEA8bAyAjaLD7NXNqgMoQ9LeHa0VaMv3/OIEqldSa7WR5riGM8BpoC285ApLt3Jc+yVDIVfZqZ0PxIjGzS3jDEutTxyPx/xiea7AmNZyKs2AA8limtPA4Z2Ihq29Xk1Lm1UjHsC0xMV6MV0NDP2tX/k5zcvA4d3a5cu3c8xMba06bLZOojvioU6+Wy+uq76hG/o20BleZi1eVS/TdaSFSEttHQ1brU0ci9fdX9LtR6F5CSiE1FrDSibPr+PznuJjbZareADLkt8FyeFq4NwRcV4LhoF8QK1bcEqa1NVlpicXyK25XiLvnDoerQMok3eC5PJt8cG0fl5oPgc8HyTbWVnMMzOV8RRexqt1AExbZi8da00Eyee6AmXO94ivtGCEACtxt+oT3lUv05Lwbh0A01YX6uUr42sAgplYXcxz5eJN0n9l0do/nu+pw2ZLaMt4u56u6vGBcGsnp6SZ+zPLzZn6wsv4tQ6AGVGZS/3xwCdg3RUos30lVhYLgateJt7u3zoApim/DKoJQhiAionU70ul6Yn5ur1ejWFKEl21d51qBGAJ+XoYTQ09aHs+SgWseSVL99E4dlT5DrMj6tZ4fzzUlSXUCjRKPGHVFQ+gbHUubOymGwjSOrD5nmkr/UbY+M01IKDjvigiQBYrotJf98Vmw6ZoqoF4u40dC/bOpCz5WSM5mmbAsCSJzmA3ECEEhnLebChPI5Pqcrd1gh1yVlSlvu1rmW8kVWMrIBj3+7ut3caOBq+NYapPG9JBk77MnZhafzW3XBgL8oQWUuiOQ61dF3pFppFcTdkDPzwafS2SsMZ8P8HdwYqomUbFQxM3cVAT0pKf7CRPU4/ReiaEFFoaEd/vPvVo+pPYz4QVNf74vle4vzAHZE/uQl4mDJOPdxp7TwxArQmphENb9IO9yr9rPHl5/a3+H7OlE5fXv9hvLQcccMA9wH9yVnqIzvQo3QAAAABJRU5ErkJggg=="/>
              
                </span>
                <div className='media-body text-white text-right'>
                  <p className='mb-1'>Message Sent</p>
                  <h3 className='text-white'>{statistics? statistics.messages : 0}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='col-xl-3 col-xxl-4 col-lg-6 col-sm-6'>
          <div className='widget-stat card bg-info'>
            <div className='card-body  p-4'>
              <div className='media'>
                <span className='mr-3'>

                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAEsElEQVRoge2YPWwcRRiGn9m9H8c+mzgBQmIHJ0YKDan4kRwK5AKkyMhNCpo0UJgCKZGQsGgpEAiBUCQECRKih1AiqkRCEX9dJCguAhkjGynh5BDH+Oyzb+ej8N7d7uzs7txdfor4k2zf3M7OvO/3ve8364Xd2I3d2I3deJBDmV88fXl1BuQCMCYCIIgAAonxzi9af5DwGuFckfB7kPBCZy1jHC6S3KO97rIWNffX6YPfRfEWkpzkPMJYEpBEFjQBRIG6ke5h3XGFvgA8nklAhPFMQGkA0jMXA+REOnpvfM/DJt5kBfKy3otc+iRtrptXgZyyOunVArR7GdrudSDgrtdEdnrxSJeknSpgBZBa1hBQEKA3NxAErzyI4FkAWNbpUoZmeAkCWtpVEN2pSEtatrFubjPUuM25qVHee2YvQX09MRcdybqWDvh29cxxlGS8KpkV6Nak0mgwUdzg85kJJkbKCDD/ww38buSSlnWbDPMISJZeo2Mt6K06J0bh3PQkIyUf2DkZRbcy7+gDA3gWaQcCDpnTmqD+H68cKfPOiTF8L36gSxDQvL0SAwsKlA+FEqpQdPeIQdqJQKaZdBN/c413n3uYU8f2WbPy59zxxHf1bc3CrU0uL67y5a//siIDqGI5vzUbYzOSJk6YNG7YYGODj58/kAo+LQaLHk89MsiZZw9y5fSTnHwMdH29Y1IdSZ6OJM80dx6B9sRE1zC6Qh9RKfmcn5nk5LiP3mpkdLhk98slkNc2VWkPZ6/c4GJ1pS8SCvjopSOMsonoILZHogqR6piRbmLTBy2jKZ9maZj5n25y7eYmb08dwldxEx/+5CrK89sJQeDRwQKnjo3w1tQYRX9n/nDJ59Xjo3x4tQ6Fcrb3ujnI2rrTEfAx+XiogQpfXNvgtW8XWNsK4tn1fFRlX/izH1XZzz8M8+lvdT748e/Y3Bcn9yLbDSf5OEooXT6xzwDlIb6v+cx+/TuLtxqEyevM0511QEFxDxerq7H9jo6W0c2m3bRR72m79+yP0yGSvJYmCKpYYmHbY/abP3j/hUOsNQLEL6JSevr19e3YdpWSH3rA8SEyj4DTQWZ4BM9nlWFev1QDAVUeTPGSvRXGDWzfQ9qbORGIGsjtOV3w28Azn3tsaRTzuvtBZn0WcgHQ+//I9gqg8/YHG/sUE0vkgYz4Z6u5082OGD1dFfhlaa29389La+D5tDtcVHpR0hEymRWI3ZhlJpsnUvXbqY4qVXj5qwWkuXN4Kd+DUgUx101TQR6BqJliAHqRiw2A8mDgIVRLEpF56Xt0kplPQDuchlkeSbvXmXS215wqkLwx5zk9RS49yTC6jiUhDgQyAHQrlyzSls5kJ23skUcAYVmEcRdwTlnvgbR9XUFgyYSbaKNayZyILLu2yeQbDAk/Z8xNGcdbaDjWbZJLSsmciTfxdto1Dny2KPYsxrJe9QpquvbG0eu97pMXlrfTbuGg16p/l8FDXwQseu1UpOpvedO1s3cXPPRBIMOkO+Dn7z546FNCiZ4O1cI9BA93QkIt7d8H8NAPAQ0R01YLzXsPHmzvhRyj1cP1fQQPfVRACZcCZCgoyGztzSdqdxLUAxX/A1GadjeBWLaxAAAAAElFTkSuQmCC"/>
                </span>
                <div className='media-body text-white text-right'>
                  <p className='mb-1'>Auto Reply</p>
                  <h3 className='text-white'>{statistics? statistics.autoReply : 0}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='col-xl-3 col-xxl-4 col-lg-6 col-sm-6'>
          <div className='widget-stat card bg-secondary'>
            <div className='card-body p-4'>
              <div className='media'>
                <span className='mr-3'>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAAjUlEQVRoge3XsQmAMBRFURUF53AXxUlcwNbS1gWcRHQX5xAstFYCRow8PtxThhD+JUVIFAEAPojvC8u6H4pBfJVFdpk5UQ0SCgFq5gNSn019O/89h1M3VI97zN8AAWrmA3iJ1QhQ83rImml7ffBY58HPcDF/AwSoEaBGgBoBagSoEaBGgBp/YjUCAACmnVi/FUZVo5JzAAAAAElFTkSuQmCC"/></span>
                <div className='media-body text-white text-right'>
                  <p className='mb-1'>Templates</p>
                  <h3 className='text-white'>{statistics? statistics.templates : 0}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        

         </div>

        
      </>
   );
};

export default Home;
