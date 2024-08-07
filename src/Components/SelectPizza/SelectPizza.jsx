import React, { useState } from "react";
import "./selectpizza.scss";
import pizzaImage from "../../assets/images/pizza-shape.png";
import riderImage from "../../assets/images/rider.png";
import Clock1 from "../../assets/images/clock-1.png";
import Clock2 from "../../assets/images/clock-2.png";
import { TbCircleDotFilled } from "react-icons/tb";
import { MdDeliveryDining } from "react-icons/md";
import { FaShoppingBasket } from "react-icons/fa";

const SelectPizza = ({
  times,
  minutes,
  selectedOption,
  selectedTime,
  activeIndex,
  activeMinutes,
  handleOptionClick,
  handleTimeClick,
  handleHourClick,
  handleMinuteClick,
}) => {
  // const [selectedOption, setSelectedOption] = useState("delivery");
  // const [selectedTime, setSelectedTime] = useState("SelectHours");
  // const [activeIndex, setActiveIndex] = useState(0);
  // const [activeMinutes, setActiveMinutes] = useState(0);

  // const handleOptionClick = (option) => {
  //   setSelectedOption(option);
  // };
  // const handleTimeClick = (time) => {
  //   setSelectedTime(time);
  // };

  // const handleHourClick = (index) => {
  //   setActiveIndex(index);
  // };
  // const handleMinuteClick = (index) => {
  //   setActiveMinutes(index);
  // };

  // const times = ["6:00 PM", "7:00 PM", "8:00 PM", "5:00 PM", "4:00 PM"];
  // const minutes = [
  //   "06:00 pm To 06:15 PM",
  //   "06:15 pm To 06:30 pm",
  //   "06:30 pm To 06:45 pm",
  //   "06:45 pm To 07:00 pm",
  // ];

  return (
    <div className="feed-banner">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="feed-banner-content">
              <h2>
                Get your slice of the pie
                <br />
                <span>Reserve Your order today</span>
              </h2>
              <div className="banner-btn-wrap">
                <button
                  className={`feed-table-btn ${
                    selectedOption === "delivery" ? "active" : ""
                  }`}
                  onClick={() => handleOptionClick("delivery")}
                >
                  <MdDeliveryDining /> Delivery
                </button>
                <button
                  className={`feed-view-btn ${
                    selectedOption === "pickup" ? "active" : ""
                  }`}
                  onClick={() => handleOptionClick("pickup")}
                >
                  <FaShoppingBasket /> Pick up
                </button>
              </div>
              <div className="times-btn-wrap">
                <button
                  className={`time-table-btn ${
                    selectedTime === "SelectHours" ? "active" : ""
                  }`}
                  onClick={() => handleTimeClick("SelectHours")}
                >
                  <img src={Clock1} alt="Clock1" /> Select Hours
                </button>
                <button
                  className={`time-view-btn ${
                    selectedTime === "SelectMinutes" ? "active" : ""
                  }`}
                  onClick={() => handleTimeClick("SelectMinutes")}
                >
                  <img src={Clock2} alt="Clock2" /> Select Minutes
                </button>
              </div>
              <div className="pizza-container">
                <div className="time-border">
                  <div className="time-tab">
                    {selectedTime === "SelectHours" &&
                      times.map((hours, index) => (
                        <div
                          key={index}
                          className={`times time-${index} ${
                            activeIndex === index ? "active" : ""
                          }`}
                          onClick={() => handleHourClick(index, hours)}
                        >
                          {hours}
                          <TbCircleDotFilled className="dots" />
                        </div>
                      ))}

                    {selectedTime === "SelectMinutes" &&
                      minutes.map((minute, index) => (
                        <div
                          key={index}
                          className={`minutes minute-${index} ${
                            activeMinutes === index ? "active" : ""
                          }`}
                          onClick={() => handleMinuteClick(index, minute)}
                        >
                          {minute}
                          <TbCircleDotFilled className="dots" />
                        </div>
                      ))}
                  </div>
                  <div className="rider-border">
                    <img src={pizzaImage} alt="Pizza" className="pizza" />
                    <img src={riderImage} alt="Rider" className="rider" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectPizza;
