import React from "react";

const Footer = () => {
  return (
    <div className="footer shadow-lg bg-white">
      <div className="copyright">
        <p>
          Copyright © Designed &amp; Developed by{" "}
          <a href="https://hpwebmart.com/" target="_blank"  rel="noreferrer">
          Hpwebmart
          </a>{" "}
          2023
        </p>
      </div>
      <div className="text-black text-bold" style={{position:"fixed",bottom:10,right:10}}><strong>v3.3.6</strong></div>
    </div>
  );
};

export default Footer;
