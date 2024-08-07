import React, { useRef, useState, useEffect } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { ToastContainer, toast } from "react-toastify";
import Check from "../../assets/images/Check.png";
import "react-toastify/dist/ReactToastify.css";
import Marquee from "../../Components/Marquee/Marquee";
import Header from "../../Components/CommonComponents/Header/Header";
import Footer from "../../Components/CommonComponents/Footer/Footer";
import "./MenuProduct.scss";
import SiteImage from "../../assets/images/site-image1.png";
import SiteImage3 from "../../assets/images/site-image3.png";
import { Link, useLocation } from "react-router-dom";
import ShapeImage from "../../assets/images/shape_2.png.png";
import axios from "axios";
import Cookies from "js-cookie";
import { useHref } from "react-router-dom";
const MenuProduct = () => {
  const apiUrl = `https://stage688.devdesignbuild.com/api`;
  const location = useLocation();
  const { from } = location?.state;
  const history = useHref();
  console.log("propssaaaaa", from);
  useEffect(() => {
    document.getElementById("top-page").scrollIntoView();
    ProductsDetails(from);
  }, []);

  const [isChecked, setIsChecked] = useState(false);
  const [productDetails, setProductDetails] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  // variation states
  const [allVariations, setAllVariations] = useState([]);
  const [sizeVariations, setSizeVariations] = useState([]);
  const [crustVariations, setCrustVariations] = useState([]);
  const [crustVariationData, setCrustVariationdata] = useState([]);
  const [sizeVariationData, setSizeVariationData] = useState([]);
  const [error, setError] = useState(null);

  // addons states
  const [allAddons, setAllAddons] = useState([]);
  const [pizzaSizeAddons, setPizzaSizeAddons] = useState([]);
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
  const handleNavigation = () => {
    window.location.href = "/cart";
  };

  const handleAddToCart = () => {
    const addonRows = sizeVariationData.map((item) => ({
      id: parseInt(item.id),
      price: parseInt(item.price),
    }));
    const variationRows = crustVariationData.map((item) => ({
      id: parseInt(item.id),
      price: parseInt(item.price),
    }));

    const data = {
      session_id: sessionId,
      product_id: from,
      quantity: quantity,
      price: productDetails?.price,
      addons: addonRows,
      variations: variationRows,
    };
    console.log("Product added to cart:addons", data);

    axios
      .post(`${apiUrl}/cart/add`, data)
      .then((response) => {
        if (response.data.status == 1) {
          handleNavigation();
          console.log(
            "Product added to response:response",
            response.data.status
          );
          toast.success("Product successfully added to cart!", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: true,
          });
        }
      })
      .catch((error) => {
        console.log("Product added to response:response", error);
        console.error("Error adding product to cart:", error);
        toast.error("An error occurred while adding the product!", {
          position: "top-right",
          autoClose: 1000,
        });
      });
  };

  // console.log(sessionId);

  // Quantity Functions
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  const ProductsDetails = async (from) => {
    try {
      const response = await axios.get(`${apiUrl}/product-detail/${from}`);
      // console.log("response", response);
      setProductDetails(response.data.data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/variations`);
        const allVariationsData = response.data.data;
        console.log("variations", allVariationsData);
        setAllVariations(allVariationsData);

        const sizeType = allVariationsData.find((type) => type.name === "Size");
        const sizeVariationsData = sizeType ? sizeType.variations : [];
        setSizeVariations(sizeVariationsData);

        const crustType = allVariationsData.find(
          (type) => type.name === "Crust"
        );
        const crustVariationsData = crustType ? crustType.variations : [];
        setCrustVariations(crustVariationsData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const mapDataArrays = (...arrays) => {
    return arrays.map((dataArray) => {
      return dataArray.map((item) => ({
        price: parseInt(item.price),
      }));
    });
  };

  // Usage:
  const combinedMappedDataAddons = mapDataArrays(
    sizeVariationData,
    crustVariationData
  );

  const flatArrayPrice = combinedMappedDataAddons.flatMap((array) => array);
  console.log("totaaall", flatArrayPrice);

  var totalPrice = flatArrayPrice.reduce((accumulator, current) => {
    return accumulator + current.price;
  }, 0);

  console.log("Total price:", totalPrice);

  const setCrustVariationfun = (item, value) => {
    document.getElementById("top-page").scrollIntoView();
    const result = crustVariations.filter((word) => word.id === item.id);
    // result[0].status = result[0].status === 1 ? true : false;
    console.log("selected sizeee results", result[0]);
    const resultSelected = crustVariations.filter(
      (word) => word.id === result[0].id
    );
    setCrustVariationdata(resultSelected);
  };

  const setSizeVariationfun = (item, value) => {
    document.getElementById("size-section-crust").scrollIntoView();
    console.log("selected sizeeee", item, value);
    const result = sizeVariations.filter((word) => word.id === item.id);
    // result[0].status = result[0].status === 1 ? true : false;
    console.log("selected sizeee results", result[0]);
    const resultSelected = sizeVariations.filter(
      (word) => word.id === result[0].id
    );
    console.log("setSizeVariationData", resultSelected);
    setSizeVariationData(resultSelected);
  };
  // const setCrustVariationfun = (item, value) => {
  //   const result = crustVariations.filter((word) => word.id === item.id);
  //   result[0].status = result[0].status === 1 ? true : 1;

  //   const resultSelected = crustVariations.filter(
  //     (word) => word.status === true
  //   );
  //   console.log("slect div", resultSelected);
  //   setCrustVariationdata(resultSelected);
  // };

  // const setSizeVariationfun = (item, value) => {
  //   const result = sizeVariations.filter((word) => word.id === item.id);
  //   result[0].status = result[0].status === 1 ? true : 1;

  //   const resultSelected = sizeVariations.filter(
  //     (word) => word.status === true
  //   );
  //   console.log("setSizeVariationData", resultSelected);
  //   setSizeVariationData(resultSelected);
  // };

  useEffect(() => {
    const fetchAddonsData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/addons`);
        const allAddonsData = response.data.data;
        // console.log("allAddonsData", allAddonsData);

        setAllAddons(allAddonsData);

        const pizzaType = allAddonsData.find(
          (type) => type.name === "Pizza Size"
        );
        const PizzaAddonData = pizzaType ? pizzaType.addons : [];
        setPizzaSizeAddons(PizzaAddonData);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchAddonsData();
  }, []);

  return (
    <div className="">
      <Header />
      <ToastContainer />
      <section className="middle-sections" id="top-page">
        <div className="pep-banner-content">
          <h2>Product Details</h2>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <div className="banner-cart">
                <div>
                  <img
                    src={productDetails?.image}
                    alt="Pizza"
                    className="cart-ban"
                  />
                </div>
                <div
                  className="slider-content"
                  style={{ position: "relative" }}
                >
                  <h2>{productDetails?.name}</h2>
                  <p>{productDetails?.description}</p>
                  <img src={SiteImage} alt="Menu" className="site-image22" />
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div className="banner-cart">
                <div className="slider-content">
                  <h3>Select Items</h3>
                  {sizeVariationData.length > 0
                    ? sizeVariationData.map((variation) => (
                        <div className="selected-row">
                          <p style={{ fontWeight: "bold" }}>
                            {variation?.name}
                          </p>
                          <p>$ {variation?.price.toFixed(2)}</p>
                        </div>
                      ))
                    : null}
                  {crustVariationData.length > 0
                    ? crustVariationData.map((variation) => (
                        <div className="selected-row">
                          <p style={{ fontWeight: "bold" }}>
                            {variation?.name}
                          </p>
                          <p>$ {variation?.price.toFixed(2)}</p>
                        </div>
                      ))
                    : null}
                  {totalPrice > 0 ? (
                    <div className="total-price">
                      <h3>Total</h3>
                      <h3>$ {totalPrice}</h3>
                    </div>
                  ) : null}
                  {/* <div>
                    <h3>Total</h3>
                    <h3>Total</h3>
                  </div> */}
                </div>
              </div>
              <div className="btn-div">
                <button onClick={handleAddToCart} className="add-cartbtn">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <img src={ShapeImage} alt="contactus" className="site-img" />
      <section
        className="size-section"
        style={{ background: "#FBFBFB", border: "1px solid #E0E0E0" }}
      >
        <div className="container">
          <div className="row">
            <h2>
              {allVariations.length > 0
                ? `Select your pizza ${allVariations[0].name}`
                : "Loading..."}
            </h2>
            <div>
              {sizeVariations.length > 0 ? (
                sizeVariations.map((variation) => (
                  <div
                    className="box-size-list"
                    onClick={() => setSizeVariationfun(variation)}
                    style={{
                      backgroundColor:
                        sizeVariationData[0]?.id === variation?.id
                          ? "#C4E2E9"
                          : "#fff",
                    }}
                  >
                    <div className="image-box-sec">
                      <img src={variation?.image} alt={variation?.name} />
                      <div>
                        <h3  style={{
                      color:
                        sizeVariationData[0]?.id === variation?.id
                          ? "#f54333"
                          : "#000"
                        }}>{variation?.name}</h3>
                        <p>{variation?.description.substring(0, 30)}...</p>
                      </div>
                    </div>
                    <h3>$ {variation?.price.toFixed(2)}</h3>
                  </div>
                ))
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        className="size-section"
        id="size-section-crust"
        style={{ background: "#FBFBFB", border: "1px solid#E0E0E0" }}
      >
        <div className="container">
          <div className="row">
            <h2>
              {allVariations.length > 0
                ? `Select your pizza ${allVariations[1].name}`
                : "Loading..."}
            </h2>
            <div>
              {crustVariations.length > 0 ? (
                crustVariations.map((variation) => (
                  <div
                    className="box-size-list"
                    onClick={() => setCrustVariationfun(variation)}
                    style={{
                      backgroundColor:
                        crustVariationData[0]?.id === variation?.id
                          ? "#C4E2E9"
                          : "#fff",
                    }}
                  >
                    <div className="image-box-sec">
                      <img src={variation?.image} alt={variation?.name} />
                      <div>
                        <h3  style={{
                      color:
                        crustVariationData[0]?.id === variation?.id
                          ? "#f54333"
                          : "#000"
                        }}>{variation?.name}</h3>
                        <p>{variation?.description.substring(0, 30)}...</p>
                      </div>
                    </div>
                    <h3>$ {variation?.price.toFixed(2)}</h3>
                  </div>
                ))
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MenuProduct;
