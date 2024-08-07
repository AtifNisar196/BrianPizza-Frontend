import React from "react";
import "./ThankYouPopup.scss";
import { RxCross2 } from "react-icons/rx";
import img1 from "../../assets/images/red_chili.png.png";
import img2 from "../../assets/images/tomato_5.png.png";
import img3 from "../../assets/images/capsicum.png.png";
import { Link } from "react-router-dom";

const ThankYouPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="thank-you-popup">
      <div className="popup-content">
        <Link to={"/Home"} className="close-button">
          <RxCross2 />
        </Link>
        <img src={img2} alt="img2" className="img2" />
        <img src={img3} alt="img3" className="img3" />
        <h1>Thank You</h1>
        <p>
          Thanks for placing order <span>RBD111-000-999!</span>
          <br />
          We will send you a notification within 5 days when it ships.
        </p>
        <strong>
          If you have any questions or queries then feel free to <br /> get in
          contact us.
        </strong>
        <br />
        <br />
        <em>All The Best.</em>
        <br />
        <br />
        <h3>Pepperonijoe</h3>
        <img src={img1} alt="img1" className="img1" />
      </div>
    </div>
  );
};

export default ThankYouPopup;
