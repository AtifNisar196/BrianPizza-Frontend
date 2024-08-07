import React, { useRef, useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/navigation";
import Marquee from "../../Components/Marquee/Marquee";
import Header from "../../Components/CommonComponents/Header/Header";
import { Link } from "react-router-dom";
import SelectPizza from "../../Components/SelectPizza/SelectPizza";
import Footer from "../../Components/CommonComponents/Footer/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Custom.scss";
import Check from "../../assets/images/Check.png";
import Cash from "../../assets/images/cash.png";
import { useLocation } from "react-router-dom";
import Card from "../../assets/images/atm-card.png";
import axios from "axios";
import Cookies from "js-cookie";
import StripeCheckOut from "../../Components/StripeCheckOut/StripeCheckOut";
import ThankYouPopup from "../../Components/ThankYouPopup/ThankYouPopup";
const CustomOrder = () => {
  const [isChecked, setIsChecked] = useState(true);
  const [isChecked2, setIsChecked2] = useState(false);
  const [productDetails, setProductDetails] = useState([]);
  const [selectedOption, setSelectedOption] = useState("delivery");
  const [selectedTime, setSelectedTime] = useState("SelectHours");
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedHour, setSelectedHour] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedMinutes, setSelectedMinutes] = useState(0);
  const sessionId = Cookies.get("sessionId");
  // const [sessionId, setSessionId] = useState(null);
  const [activeMinutes, setActiveMinutes] = useState(0);
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    contactNumber: "",
    Suburb: "",
    address: "",
    note: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log("valueeee", e);
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  // const { from } = location.state
  // console.log("propss",from)
  const apiUrl = `https://stage688.devdesignbuild.com/api`;

  useEffect(() => {
    // ProductsDetails(from);
  }, []);

  const ProductsDetails = async (from) => {
    try {
      const response = await axios.get(`${apiUrl}/product-detail/${from}`);
      console.log("response", response);
      setProductDetails(response.data.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const SelectPayment = (e) => {
    setIsChecked(!isChecked);
    setIsChecked2(false);
  };
  const SelectPayment2 = (e) => {
    setIsChecked2(!isChecked2);
    setIsChecked(false);
  };

  const handleOptionClick = (option) => {
    console.log("option  value", option);
    setSelectedOption(option);
  };
  const handleTimeClick = (time) => {
    console.log("time  value", time);
   
    setSelectedTime(time);
  };

  const handleHourClick = (index, hour) => {
    console.log("index  value", index, hour);
    setSelectedTime("SelectMinutes")
    setActiveIndex(index);
    setSelectedHour(parseInt(hour.substring(0, 1)));
  };
  const handleMinuteClick = (index, minute) => {
    console.log("index mints value", index, minute);
    setActiveMinutes(index);
    setSelectedMinutes(minute);
  };

  const times = ["6:00 PM", "7:00 PM", "8:00 PM", "5:00 PM", "4:00 PM"];
  const minutes = [
    `${selectedHour}:15 pm To ${selectedHour} :30 pm`,
    `${selectedHour}:30 pm To ${selectedHour} :45 pm`,
    `${selectedHour}:45 pm To ${parseInt(selectedHour + 1)} :00 pm`,
    `${selectedHour}:00 pm To ${selectedHour} :15 PM`,
  ];
  console.log(
    "props  value",
    formData,
    times,
    minutes,
    selectedOption,
    selectedTime,
    activeIndex,
    activeMinutes
  );

  const generateSessionId = (length = 32) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let sessionId = "";
    for (let i = 0; i < length; i++) {
      sessionId += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return sessionId;
  };

  // useEffect(() => {
  //   const existingSessionId = Cookies.get("sessionId");
  //   if (!existingSessionId) {
  //     const newSessionId = generateSessionId(32);
  //     setSessionId(newSessionId);
  //     Cookies.set("sessionId", newSessionId);
  //   } else {
  //     setSessionId(existingSessionId);
  //   }
  // }, []);

  const handlePlaceOrder = (e) => {
    let addonList = [];
    let variationList = [];

    // Iterate over each object in the array
    e.forEach((item) => {
      // Iterate over each addon in the addons array
      item.addons.forEach((addon) => {
        // Extract addon id and price
        let addonId = addon.id;
        let addonPrice = addon.price;

        // Create an object with addon id and price
        let addonInfo = {
          id: addonId,
          price: addonPrice,
        };

        // Add the addon info to the list
        addonList.push(addonInfo);
      });
    });

    e.forEach((item) => {
      // Iterate over each addon in the addons array
      item.variations.forEach((addon) => {
        // Extract addon id and price
        let addonId = addon.id;
        let addonPrice = addon.price;

        // Create an object with addon id and price
        let addonInfo = {
          id: addonId,
          price: addonPrice,
        };

        // Add the addon info to the list
        variationList.push(addonInfo);
      });
    });

    const formattedData = e.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: parseFloat(item.price),
      addons: item.addons.map(addon => ({
        addon_id: addon.addon_cart.addon.id,
        price: parseFloat(addon.price)
      })),
      variations: item.variations.map(variation => ({
        variation_id: variation.variation_cart.variation.id,
        price: parseFloat(variation.price)
      }))
    }));
    
    console.log(formattedData);
// return
    // Output addon list
    // console.log(addonList);
    // console.log(variationList);
    let data = JSON.stringify({
      session_id:sessionId,
      first_name: formData.name,
      last_name: formData.lastname,
      email: formData.email,
      phone: formData.contactNumber,
      suburb: formData.Suburb,
      address: formData.address,
      order_type: selectedOption === "pickup" ? 2 : 1,
      timings: selectedMinutes,
      payment_method: isChecked === false ? "Credit Card" : "COD",
      comments: formData.comment,

      products: 
        formattedData
     
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${apiUrl}/order/save`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if(response.data.status == 1){
        console.log("Product added to cart:", response.data.status);
        setIsOpen(true)
        // toast.success("Order Placed Successfully", {
        //   position: "top-right",
        //   autoClose: 1000,
        //   hideProgressBar: true,
        // });
      }})
  
      .catch((error) => {
        console.error("Error adding product to cart:", error);
        toast.error("An error occurred while Placing Order", {
          position: "top-right",
          autoClose: 1000,
      });
      })
  };

  useEffect(() => {
    fetchCartItems();
  }, []);
  // console.log(cartItems);
 
  const fetchCartItems = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/cart/get?session_id=${sessionId}`
      );
      console.log("fdgdf", response.data.data[0].items);
      setCartItems(response.data.data[0].items);
      let total = 0;

      for (const item of response.data.data[0].items) {
          total += parseFloat(item.total);
          setTotalPrice(total)
      }
      
      console.log("response",total);
    } catch (error) {
      console.error("Error fetching cart items", error.message);
    }
  };
  return (
    <div className="">
      <Header />
      <ThankYouPopup isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <ToastContainer />
      <section className="middle-sections">
        <SelectPizza
          times={times}
          minutes={minutes}
          selectedOption={selectedOption}
          selectedTime={selectedTime}
          activeIndex={activeIndex}
          activeMinutes={activeMinutes}
          handleOptionClick={handleOptionClick}
          handleTimeClick={handleTimeClick}
          handleHourClick={handleHourClick}
          handleMinuteClick={handleMinuteClick}
        />
        <Marquee />
      </section>
      <section className="Form-section2">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="Contact-us-Form">
                <div className="row">
                  <h2>Your Details</h2>
                  <form id="form">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-control">
                          <input
                            type="text"
                            id="name"
                            name="name"
                            onChange={handleChange}
                            placeholder="First Name"
                          />
                          <input
                            type="text"
                            id="lastname"
                            name="lastname"
                            onChange={handleChange}
                            placeholder="Last Name"
                          />
                        </div>

                        <div className="form-control">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            onChange={handleChange}
                            placeholder="Email Address"
                          />
                          <input
                            type="tel"
                            id="contactNumber"
                            name="contactNumber"
                            onChange={handleChange}
                            placeholder="Mobile Phone Number"
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div
                          className="form-control"
                          style={{
                            display:
                              selectedOption === "pickup" ? "none" : "block",
                          }}
                        >
                          <input
                            type="text"
                            id="Suburb"
                            name="Suburb"
                            onChange={handleChange}
                            placeholder="Suburb"
                          />
                          <input
                            type="text"
                            id="address"
                            name="address"
                            onChange={handleChange}
                            placeholder="Address"
                          />
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="form-control">
                          <textarea
                            name="comment"
                            id="comment"
                            onChange={handleChange}
                            placeholder="Enter your comment here"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </form>

                  <h2>Payment</h2>
                  <div className="col-md-6 box-size">
                    <div className="select-size">
                      <button
                        onClick={(e) => SelectPayment(e)}
                        className="image-box"
                        style={{
                          backgroundColor:
                            isChecked === true ? "#C4E2E9" : "#fff",
                        }}
                      >
                        <img
                          src={Check}
                          alt="Size"
                          style={{
                            float: "right",
                            display: isChecked ? "block" : "none",
                            position: "absolute",
                            right: 3,
                            top: 3,
                          }}
                        />

                        <img src={Cash} alt="pizza" />
                        <h5>Cash on delivery</h5>
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6 box-size">
                    <div className="select-size">
                      <button
                        onClick={(e) => SelectPayment2()}
                        className="image-box"
                        style={{
                          backgroundColor:
                            isChecked2 === true ? "#C4E2E9" : "#fff",
                        }}
                      >
                        <img
                          src={Check}
                          alt="Size"
                          style={{
                            float: "right",
                            display: isChecked2 ? "block" : "none",
                            position: "absolute",
                            right: 3,
                            top: 3,
                          }}
                        />

                        <img src={Card} alt="pizza" />
                        <h5>Credit Card</h5>
                      </button>
                    </div>
                  </div>
                  {isChecked === false ? (
                    <div className="row">
                      <div className="col-md-12">
                        <div
                          className="payment-strpe"
                          style={{ marginTop: 50 }}
                        >
                          <StripeCheckOut />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="payment-tab">
                <h2>What you have seletcted</h2>
                <div></div>
                <div>
                  {cartItems.length > 0 &&
                    cartItems.map((item) => {
                      return (
                        <div className="payment-line">
                          <h4>{item?.product?.name}</h4>
                          <h5>${item?.total}</h5>
                        </div>
                      );
                    })}
                </div>

                <div>
                <div className="payment-line last-col">
                <div className="">
                    <h4>SUB TOTAL</h4>
                    <h4>Tax (VAT 6%)</h4>
                    <h4>TOTAL</h4>
                   
                  
                    </div>
                    <div className="">
                    <h5>${totalPrice.toFixed(2)}</h5>
                    <h5>${(totalPrice * 0.06).toFixed(2)}</h5>
                    <h5>${(totalPrice+(totalPrice * 0.06)).toFixed(2)}</h5>
                    </div>
                    
                  </div>
             
                  <div className="payment-line-2">
                    <button
                      // href="/Home"
                      className="btn-sumit-footer"
                      // type="submit
                      onClick={() => handlePlaceOrder(cartItems)}
                      // value="submit"
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
export default CustomOrder;
