import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import Header from "../../Components/CommonComponents/Header/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../Components/CommonComponents/Footer/Footer";
import Banner from "../../Components/Banner/Banner";
import Marquee from "../../Components/Marquee/Marquee";
import Rating from "../../assets/images/rating.png";
import SiteImage from "../../assets/images/site-image1.png";
import SiteImage3 from "../../assets/images/site-image3.png";
import DeleteIcon from "../../assets/images/deletebtn.png";
import "./menu.scss";
import VisitsBanner from "../../Components/VisitsBanner/VisitsBanner";
import axios from "axios";
import Cookies from "js-cookie";
const MenuScreen = () => {
  const apiUrl = `https://stage688.devdesignbuild.com/api`;

  const [allMenus, setAllMenus] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(1);
  const [sessionId, setSessionId] = useState(null);
  const [quantity, setQuantity] = useState(1);
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

  useEffect(() => {
    const existingSessionId = Cookies.get("sessionId");
    if (!existingSessionId) {
      const newSessionId = generateSessionId(32);
      setSessionId(newSessionId);
      Cookies.set("sessionId", newSessionId);
    } else {
      setSessionId(existingSessionId);
    }
  }, []);

  const handleAddToCart = (id) => {
    const data = {
      session_id: sessionId,
      product_id: id,
      quantity: quantity,
      addons: [1, 6, 8, 4],
      variations: [6, 11, 12, 13],
    };

    axios
      .post(`${apiUrl}/cart/add`, data)
      .then((response) => {
        console.log("Product added to cart:", response.data);
        toast.success("Product successfully added to cart!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
        });
      })
      .catch((error) => {
        console.error("Error adding product to cart:", error);
        toast.error("An error occurred while adding the product!", {
          position: "top-right",
          autoClose: 5000,
        });
      });
  };
  const handleTabClick = (categoryId) => {
    setActiveTab(categoryId);
  };
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/category-products`);
        setAllMenus(response.data?.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchAllCategories();
  }, []);

  return (
    <div className="">
      <Header />
      <ToastContainer />
      <section className="middle-sections">
        <Banner
          title={"ENJOY YOUR FAVOURITE FOOD WITH FAMILY"}
          description={"PIZZA SHOP in MICHIGAN"}
          btnText={false}
        />
        <Marquee />
      </section>
      <section className="menu-parent">
        <div className="container">
          <div className="row">
            <h2>MENU</h2>
            <div className="border-row"></div>
            <h3>our best food menu</h3>
            <img src={SiteImage} alt="Menu" />
          </div>
          <img src={SiteImage3} alt="Menu" className="site-image" />
          <div className="menu-list">
            {allMenus.map((category) => (
              <div
                key={category.id}
                className={`menu-div ${
                  activeTab === category.id ? "active" : ""
                }`}
                onClick={() => handleTabClick(category.id)}
              >
                <div className="container row">
                  <div className="tabbar">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="product-img"
                    />
                    <h4 className="menu-text">{category.name}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="tab-content">
            {allMenus.map((category) => (
              <div
                key={category.id}
                className={`tab-pane ${
                  activeTab === category.id ? "active" : ""
                }`}
              >
                <div className="container">
                  <div className="row">
                    <h2>{category.name}</h2>
                    <div className="col-md-12">
                      <div className="card-list">
                        <div className="products">
                          {category.products.map((product) => (
                            <div className="card1" key={product.id}>
                              <img
                                src={product.image}
                                alt={product.name}
                                className="product-img"
                              />
                              <div className="card-text">
                                <Link
                                  to="/menu-product"
                                  state={{ from: product.id }}
                                >
                                  <h2>{product.name}</h2>
                                </Link>
                                <h5>{product.description.slice(0, 40)}...</h5>
                                <img src={Rating} alt="Rating" />
                              </div>
                              {/* <div className="border-row"></div> */}
                              <div className="pricing-div">
                                <h3>${product.price}</h3>
                                <button>
                                  <Link
                                    to="/menu-product"
                                    state={{ from: product.id }}
                                  >
                                    <img src={DeleteIcon} alt="Delete" />
                                  </Link>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="visit">
        <VisitsBanner />
      </section>
      <Footer />
    </div>
  );
};

export default MenuScreen;
