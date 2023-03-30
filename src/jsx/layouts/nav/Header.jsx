import React, { useState, useEffect } from "react";
import axios from "axios";
// import axiosInstance from '../../../services/AxiosInstance';

const Header = () => {
const [user, setUser]=useState("Hpwebmart");
useEffect(()=>{
	loadUser();
},[])
const loadUser=async()=>{
	const { data } = await axios.post("http://localhost:5000/api/message/getuser");
	if(data.status){
		setUser(data.data[0]);
	}
}

	return (
		<div className="header">
			<div className="header-content">
				<nav className="navbar navbar-expand">
					<div className="collapse navbar-collapse justify-content-between">
						<div className="header-left">
							<div>
								Welcome {user.user}
							</div>
						</div>
						<ul className="navbar-nav header-right">
							<div className="nav-item notification_dropdown">
								<p className="text-warning bg-danger-subtle fs-6">Your licence will expire on &nbsp;: <span className="border border-danger text-danger expdate">&nbsp;{user.validity}&nbsp;</span></p>
							</div>
						</ul>
					</div>
				</nav>
			</div>
		</div>
	);
};

export default Header;
