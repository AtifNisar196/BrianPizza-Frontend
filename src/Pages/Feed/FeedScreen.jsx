import React, { useRef, useState, useEffect } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Marquee from "../../Components/Marquee/Marquee";
import Header from "../../Components/CommonComponents/Header/Header";
import Footer from "../../Components/CommonComponents/Footer/Footer";
import "./feed.scss";
import SiteImage from "../../assets/images/site-image1.png";
import SiteImage3 from "../../assets/images/site-image3.png";
import Check from "../../assets/images/Check.png";
import { Link, useLocation } from "react-router-dom";
import ShapeImage from "../../assets/images/shape_2.png.png";
import axios from "axios";
import Cookies from "js-cookie";
import { useHref } from "react-router-dom";
const CreatePizza = () => {
  const apiUrl = `https://stage688.devdesignbuild.com/api`;
  const location = useLocation();
  // const { from } = location?.state;
  const history = useHref();
  // console.log("propssaaaaa", from);
  useEffect(() => {
    document.getElementById("top-page").scrollIntoView();
    ProductsDetails();
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
  const [totalPriceArray, setTotalPriceArray] = useState(0);
  // addons states
  const [allAddons, setAllAddons] = useState([]);
  const [pizzaSizeAddons, setPizzaSizeAddons] = useState([]);
  const [pizzaSauseAddons, setPizzaSauseAddons] = useState([]);
  const [pizzaCheeseAddons, setPizzaCheeseAddons] = useState([]);
  const [pizzaMeatAddons, setPizzaMeatAddons] = useState([]);
  const [pizzaVegetablesAddons, setPizzaVegetablesAddons] = useState([]);
  const [pizzaCrustAddons, setPizzaCrustAddons] = useState([]);
  const [pizzaSizeAddonsData, setPizzaSizeAddonsdata] = useState([]);
  const [pizzaCrushAddonsData, setPizzaCrushAddonsdata] = useState([]);
  const [pizzaSauseAddonsData, setPizzaSauseAddonsData] = useState([]);
  const [pizzaCheeseAddonsData, setPizzaCheeseAddonsdata] = useState([]);
  const [pizzaMeatAddonsData, setpizzaMeatAddonsData] = useState([]);
  const [pizzaVegetablesAddonsData, setpizzaVegetablesAddonsdata] = useState(
    []
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

  const mapDataArrays = (...arrays) => {
    return arrays.map((dataArray) => {
      return dataArray.map((item) => ({
        price: parseInt(item.price),
      }));
    });
  };

  // Usage:
  const combinedMappedDataAddons = mapDataArrays(
    pizzaSauseAddonsData,
    pizzaCheeseAddonsData,
    pizzaMeatAddonsData,
    pizzaVegetablesAddonsData,
    pizzaCrushAddonsData,
    pizzaSizeAddonsData,
    sizeVariationData,
    crustVariationData
  );

  const flatArrayPrice = combinedMappedDataAddons.flatMap((array) => array);
  console.log("totaaall", flatArrayPrice);

  var totalPrice = flatArrayPrice.reduce((accumulator, current) => {
    return accumulator + current.price;
  }, 0);

  console.log("Total price:", totalPrice);
  // setTotalPriceArray(totalPrice)
  const handleAddToCart = () => {
    const addonsDatas = [
      pizzaSauseAddonsData,
      pizzaCheeseAddonsData,
      pizzaMeatAddonsData,
      pizzaVegetablesAddonsData,
      pizzaCrushAddonsData,
      pizzaSizeAddonsData,
    ];

    const addonRows = addonsDatas.map((variationData) => {
      return variationData.map((item) => ({
        id: parseInt(item.id),
        price: parseInt(item.price),
      }));
    });
    // const variationRows = crustVariationData.map((item) => ({
    //   id: parseInt(item.id),
    //   price: parseInt(item.price),
    // }));
    const variationDatas = [crustVariationData, sizeVariationData];

    const combinedMappedData = variationDatas.map((variationData) => {
      return variationData.map((item) => ({
        id: parseInt(item.id),
        price: parseInt(item.price),
      }));
    });

    const flatArrayVariation = combinedMappedData.flatMap((array) => array);

    console.log("Flattened flatArrayVariation:", flatArrayVariation);

    const mapDataArrays = (...arrays) => {
      return arrays.map((dataArray) => {
        return dataArray.map((item) => ({
          id: parseInt(item.id),
          price: parseInt(item.price),
        }));
      });
    };

    // Usage:
    const combinedMappedDataAddons = mapDataArrays(
      pizzaSauseAddonsData,
      pizzaCheeseAddonsData,
      pizzaMeatAddonsData,
      pizzaVegetablesAddonsData,
      pizzaCrushAddonsData,
      pizzaSizeAddonsData
    );

    const flatArrayAddons = combinedMappedDataAddons.flatMap((array) => array);

    console.log("Combined mapped data:", flatArrayAddons);
    console.log("combinedddd", flatArrayVariation);

    const data = {
      session_id: sessionId,
      product_id: 1,
      quantity: quantity,
      price: productDetails?.price,
      addons: flatArrayAddons,
      variations: flatArrayVariation,
    };
    console.log("Product added to cart:addons", data);

    axios
      .post(`${apiUrl}/cart/add`, data)
      .then((response) => {
        console.log("response", response);
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

  const ProductsDetails = async () => {
    try {
      const response = await axios.get(`${apiUrl}/product-detail/${1}`);
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

  const setCrustVariationfun = (item, value) => {
    document.getElementById("size-section-crust-2").scrollIntoView();
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

  const handleAddons = (item, addonsArray, setDataFunction) => {
    const result = addonsArray.filter((word) => word.id === item.id);
    result[0].status = result[0].status === 1 ? true : 1;

    const resultSelected = addonsArray.filter((word) => word.status === true);
    console.log("Selected addons:", resultSelected);
    setDataFunction(resultSelected);
  };

  const setSizeAddonsfun = (item, value) => {
    document.getElementById("size-section-crust-3").scrollIntoView();
    handleAddons(item, pizzaSizeAddons, setPizzaSizeAddonsdata);
  };

  const setCrushAddonsfun = (item, value) => {
    document.getElementById("size-section-crust-4").scrollIntoView();
    handleAddons(item, pizzaCrustAddons, setPizzaCrushAddonsdata);
  };

  const setSauceAddonsfun = (item, value) => {
    document.getElementById("size-section-crust-5").scrollIntoView();
    handleAddons(item, pizzaSauseAddons, setPizzaSauseAddonsData);
  };

  const setCheeseAddonsfun = (item, value) => {
    document.getElementById("size-section-crust-6").scrollIntoView();
    handleAddons(item, pizzaCheeseAddons, setPizzaCheeseAddonsdata);
  };

  const setMeatAddonsfun = (item, value) => {
    document.getElementById("size-section-crust-7").scrollIntoView();
    handleAddons(item, pizzaMeatAddons, setpizzaMeatAddonsData);
  };

  const setVegetablesAddonsfun = (item, value) => {
    document.getElementById("top-page").scrollIntoView();
    handleAddons(item, pizzaVegetablesAddons, setpizzaVegetablesAddonsdata);
  };

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
        console.log("addons Pizza Size", PizzaAddonData);
        setPizzaSizeAddons(PizzaAddonData);

        const pizzaTypeCrust = allAddonsData.find(
          (type) => type.name === "Crust"
        );
        const PizzaAddonDataCrust = pizzaTypeCrust ? pizzaTypeCrust.addons : [];
        console.log("addons Sause", PizzaAddonDataCrust);
        setPizzaCrustAddons(PizzaAddonDataCrust);

        const pizzaTypeSause = allAddonsData.find(
          (type) => type.name === "Sause"
        );
        const PizzaAddonDataSause = pizzaTypeSause ? pizzaTypeSause.addons : [];
        console.log("addons PizzaAddonDataSause", PizzaAddonDataSause);
        setPizzaSauseAddons(PizzaAddonDataSause);

        const pizzaTypeCheese = allAddonsData.find(
          (type) => type.name === "Cheese"
        );
        const PizzaAddonDataCheese = pizzaTypeCheese
          ? pizzaTypeCheese.addons
          : [];
        console.log("addons Cheese", PizzaAddonDataCheese);
        setPizzaCheeseAddons(PizzaAddonDataCheese);

        const pizzaTypeMeat = allAddonsData.find(
          (type) => type.name === "Meat"
        );
        const PizzaAddonDataMeat = pizzaTypeMeat ? pizzaTypeMeat.addons : [];
        console.log("addons Meat", PizzaAddonDataMeat);
        setPizzaMeatAddons(PizzaAddonDataMeat);

        const pizzaTypeVegetables = allAddonsData.find(
          (type) => type.name === "Vegetables"
        );
        const PizzaAddonDataVegetables = pizzaTypeVegetables
          ? pizzaTypeVegetables.addons
          : [];
        console.log("addons Vegetables", PizzaAddonDataVegetables);
        setPizzaVegetablesAddons(PizzaAddonDataVegetables);
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
        <img src={SiteImage} alt="Menu" className="site-image22" />
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
                          <p style={{ fontWeight: "500" }}>{variation?.name}</p>
                          <p>$ {variation?.price.toFixed(2)}</p>
                        </div>
                      ))
                    : null}
                  {crustVariationData.length > 0
                    ? crustVariationData.map((variation) => (
                        <div className="selected-row">
                          <p style={{ fontWeight: "500" }}>{variation?.name}</p>
                          <p>$ {variation?.price.toFixed(2)}</p>
                        </div>
                      ))
                    : null}
                  {pizzaSizeAddonsData.length > 0
                    ? pizzaSizeAddonsData.map((variation) => (
                        <div className="selected-row">
                          <p style={{ fontWeight: "500" }}>{variation?.name}</p>
                          <p>$ {variation?.price.toFixed(2)}</p>
                        </div>
                      ))
                    : null}
                  {pizzaCrushAddonsData.length > 0
                    ? pizzaCrushAddonsData.map((variation) => (
                        <div className="selected-row">
                          <p style={{ fontWeight: "500" }}>{variation?.name}</p>
                          <p>$ {variation?.price.toFixed(2)}</p>
                        </div>
                      ))
                    : null}
                  {pizzaSauseAddonsData.length > 0
                    ? pizzaSauseAddonsData.map((variation) => (
                        <div className="selected-row">
                          <p style={{ fontWeight: "500" }}>{variation?.name}</p>
                          <p>$ {variation?.price.toFixed(2)}</p>
                        </div>
                      ))
                    : null}
                  {pizzaCheeseAddonsData.length > 0
                    ? pizzaCheeseAddonsData.map((variation) => (
                        <div className="selected-row">
                          <p style={{ fontWeight: "500" }}>{variation?.name}</p>
                          <p>$ {variation?.price.toFixed(2)}</p>
                        </div>
                      ))
                    : null}
                  {pizzaMeatAddonsData.length > 0
                    ? pizzaMeatAddonsData.map((variation) => (
                        <div className="selected-row">
                          <p style={{ fontWeight: "500" }}>{variation?.name}</p>
                          <p>$ {variation?.price.toFixed(2)}</p>
                        </div>
                      ))
                    : null}
                  {pizzaVegetablesAddonsData.length > 0
                    ? pizzaVegetablesAddonsData.map((variation) => (
                        <div className="selected-row">
                          <p style={{ fontWeight: "500" }}>{variation?.name}</p>
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
      <section className="size-section">
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
                          <h3
                            style={{
                              color:
                                sizeVariationData[0]?.id === variation?.id
                                  ? "#f54333"
                                  : "#000",
                            }}
                          >
                            {variation?.name}
                          </h3>
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
                          <h3
                            style={{
                              color:
                                crustVariationData[0]?.id === variation?.id
                                  ? "#f54333"
                                  : "#000",
                            }}
                          >
                            {variation?.name}
                          </h3>
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
        <Marquee />
        <section
          className="size-section"
          id="size-section-crust-2"
          style={{ background: "#FBFBFB", border: "1px solid #E0E0E0" }}
        >
          <div className="container">
            <div className="row">
              <h2>
                {allAddons.length > 0
                  ? `Select your  ${allAddons[0].name}`
                  : "Loading..."}
              </h2>
              <div>
                <Swiper
                  rewind={true}
                  navigation={false}
                  modules={[Navigation, Autoplay]}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    768: {
                      slidesPerView: 4,
                      spaceBetween: 40,
                    },
                    1024: {
                      slidesPerView: 5,
                      spaceBetween: 50,
                    },
                  }}
                  className="mySwiper"
                >
                  {pizzaSizeAddons.length > 0 ? (
                    pizzaSizeAddons.map((variation) => (
                      <SwiperSlide key={variation.id}>
                        <div className="box-size mt-1">
                          <button
                            onClick={() => setSizeAddonsfun(variation)}
                            className="image-box"
                            style={{
                              backgroundColor:
                                variation.status === true ? "#C4E2E9" : "#fff",
                            }}
                          >
                            <img
                              src={Check}
                              alt="Size"
                              style={{
                                float: "right",
                                display:
                                  variation.status === true ? "block" : "none",
                                position: "absolute",
                                right: 3,
                                top: 3,
                                width: 30,
                                height: 30,
                              }}
                            />
                            <img src={variation?.image} alt={variation?.name} />
                          </button>
                          <h3>{variation?.name}</h3>
                          <p>{variation?.description.substring(0, 30)}...</p>
                        </div>
                      </SwiperSlide>
                    ))
                  ) : (
                    <p>Loading...</p>
                  )}
                </Swiper>
              </div>
            </div>
          </div>
        </section>
        <section
          className="size-section"
          id="size-section-crust-3"
          style={{ background: "#FBFBFB", border: "1px solid #E0E0E0" }}
        >
          <div className="container">
            <div className="row">
              <h2>
                {allAddons.length > 0
                  ? `Select your  ${allAddons[1].name}`
                  : "Loading..."}
              </h2>
              <div>
                <Swiper
                  rewind={true}
                  navigation={false}
                  modules={[Navigation, Autoplay]}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    768: {
                      slidesPerView: 4,
                      spaceBetween: 40,
                    },
                    1024: {
                      slidesPerView: 5,
                      spaceBetween: 50,
                    },
                  }}
                  className="mySwiper"
                >
                  {pizzaCrustAddons.length > 0 ? (
                    pizzaCrustAddons.map((variation) => (
                      <SwiperSlide key={variation.id}>
                        <div className="box-size mt-1">
                          <button
                            onClick={() => setCrushAddonsfun(variation)}
                            className="image-box"
                            style={{
                              backgroundColor:
                                variation.status === true ? "#C4E2E9" : "#fff",
                            }}
                          >
                            <img
                              src={Check}
                              alt="Size"
                              style={{
                                float: "right",
                                display:
                                  variation.status === true ? "block" : "none",
                                position: "absolute",
                                right: 3,
                                top: 3,
                                width: 30,
                                height: 30,
                              }}
                            />
                            <img src={variation?.image} alt={variation?.name} />
                          </button>
                          <h3>{variation?.name}</h3>
                          <p>{variation?.description.substring(0, 30)}...</p>
                        </div>
                      </SwiperSlide>
                    ))
                  ) : (
                    <p>Loading...</p>
                  )}
                </Swiper>
              </div>
            </div>
          </div>
        </section>
        <section
          id="size-section-crust-4"
          className="size-section"
          style={{ background: "#FBFBFB", border: "1px solid #E0E0E0" }}
        >
          <div className="container">
            <div className="row">
              <h2>
                {allAddons.length > 0
                  ? `Select your  ${allAddons[2].name}`
                  : "Loading..."}
              </h2>
              <div>
                <Swiper
                  rewind={true}
                  navigation={false}
                  modules={[Navigation, Autoplay]}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    768: {
                      slidesPerView: 4,
                      spaceBetween: 40,
                    },
                    1024: {
                      slidesPerView: 5,
                      spaceBetween: 50,
                    },
                  }}
                  className="mySwiper"
                >
                  {pizzaSauseAddons.length > 0 ? (
                    pizzaSauseAddons.map((variation) => (
                      <SwiperSlide key={variation.id}>
                        <div className="box-size mt-1">
                          <button
                            onClick={() => setSauceAddonsfun(variation)}
                            className="image-box"
                            style={{
                              backgroundColor:
                                variation.status === true ? "#C4E2E9" : "#fff",
                            }}
                          >
                            <img
                              src={Check}
                              alt="Size"
                              style={{
                                float: "right",
                                display:
                                  variation.status === true ? "block" : "none",
                                position: "absolute",
                                right: 3,
                                top: 3,
                                width: 30,
                                height: 30,
                              }}
                            />
                            <img src={variation?.image} alt={variation?.name} />
                          </button>
                          <h3>{variation?.name}</h3>
                          <p>{variation?.description.substring(0, 30)}...</p>
                        </div>
                      </SwiperSlide>
                    ))
                  ) : (
                    <p>Loading...</p>
                  )}
                </Swiper>
              </div>
            </div>
          </div>
        </section>

        <section
          className="size-section"
          id="size-section-crust-5"
          style={{ background: "#FBFBFB", border: "1px solid #E0E0E0" }}
        >
          <div className="container">
            <div className="row">
              <h2>
                {allAddons.length > 0
                  ? `Select your  ${allAddons[3].name}`
                  : "Loading..."}
              </h2>
              <div>
                <Swiper
                  rewind={true}
                  navigation={false}
                  modules={[Navigation, Autoplay]}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    768: {
                      slidesPerView: 4,
                      spaceBetween: 40,
                    },
                    1024: {
                      slidesPerView: 5,
                      spaceBetween: 50,
                    },
                  }}
                  className="mySwiper"
                >
                  {pizzaCheeseAddons.length > 0 ? (
                    pizzaCheeseAddons.map((variation) => (
                      <SwiperSlide key={variation.id}>
                        <div className="box-size mt-1">
                          <button
                            onClick={() => setCheeseAddonsfun(variation)}
                            className="image-box"
                            style={{
                              backgroundColor:
                                variation.status === true ? "#C4E2E9" : "#fff",
                            }}
                          >
                            <img
                              src={Check}
                              alt="Size"
                              style={{
                                float: "right",
                                display:
                                  variation.status === true ? "block" : "none",
                                position: "absolute",
                                right: 3,
                                top: 3,
                                width: 30,
                                height: 30,
                              }}
                            />
                            <img src={variation?.image} alt={variation?.name} />
                          </button>
                          <h3>{variation?.name}</h3>
                          <p>{variation?.description.substring(0, 30)}...</p>
                        </div>
                      </SwiperSlide>
                    ))
                  ) : (
                    <p>Loading...</p>
                  )}
                </Swiper>
              </div>
            </div>
          </div>
        </section>

        <section
          className="size-section"
          id="size-section-crust-6"
          style={{ background: "#FBFBFB", border: "1px solid #E0E0E0" }}
        >
          <div className="container">
            <div className="row">
              <h2>
                {allAddons.length > 0
                  ? `Select your  ${allAddons[4].name}`
                  : "Loading..."}
              </h2>
              <div>
                <Swiper
                  rewind={true}
                  navigation={false}
                  modules={[Navigation, Autoplay]}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    768: {
                      slidesPerView: 4,
                      spaceBetween: 40,
                    },
                    1024: {
                      slidesPerView: 5,
                      spaceBetween: 50,
                    },
                  }}
                  className="mySwiper"
                >
                  {pizzaMeatAddons.length > 0 ? (
                    pizzaMeatAddons.map((variation) => (
                      <SwiperSlide key={variation.id}>
                        <div className="box-size mt-1">
                          <button
                            onClick={() => setMeatAddonsfun(variation)}
                            className="image-box"
                            style={{
                              backgroundColor:
                                variation.status === true ? "#C4E2E9" : "#fff",
                            }}
                          >
                            <img
                              src={Check}
                              alt="Size"
                              style={{
                                float: "right",
                                display:
                                  variation.status === true ? "block" : "none",
                                position: "absolute",
                                right: 3,
                                top: 3,
                                width: 30,
                                height: 30,
                              }}
                            />
                            <img src={variation?.image} alt={variation?.name} />
                          </button>
                          <h3>{variation?.name}</h3>
                          <p>{variation?.description.substring(0, 30)}...</p>
                        </div>
                      </SwiperSlide>
                    ))
                  ) : (
                    <p>Loading...</p>
                  )}
                </Swiper>
              </div>
            </div>
          </div>
        </section>
        <section
          className="size-section"
          id="size-section-crust-7"
          style={{ background: "#FBFBFB", border: "1px solid #E0E0E0" }}
        >
          <div className="container">
            <div className="row">
              <h2>
                {allAddons.length > 0
                  ? `Select your  ${allAddons[5].name}`
                  : "Loading..."}
              </h2>
              <div>
                <Swiper
                  rewind={true}
                  navigation={false}
                  modules={[Navigation, Autoplay]}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    768: {
                      slidesPerView: 4,
                      spaceBetween: 40,
                    },
                    1024: {
                      slidesPerView: 5,
                      spaceBetween: 50,
                    },
                  }}
                  className="mySwiper"
                >
                  {pizzaVegetablesAddons.length > 0 ? (
                    pizzaVegetablesAddons.map((variation) => (
                      <SwiperSlide key={variation.id}>
                        <div className="box-size mt-1">
                          <button
                            onClick={() => setVegetablesAddonsfun(variation)}
                            className="image-box"
                            style={{
                              backgroundColor:
                                variation.status === true ? "#C4E2E9" : "#fff",
                            }}
                          >
                            <img
                              src={Check}
                              alt="Size"
                              style={{
                                float: "right",
                                display:
                                  variation.status === true ? "block" : "none",
                                position: "absolute",
                                right: 3,
                                top: 3,
                                width: 30,
                                height: 30,
                              }}
                            />
                            <img src={variation?.image} alt={variation?.name} />
                          </button>
                          <h3>{variation?.name}</h3>
                          <p>{variation?.description.substring(0, 30)}...</p>
                        </div>
                      </SwiperSlide>
                    ))
                  ) : (
                    <p>Loading...</p>
                  )}
                </Swiper>
              </div>
            </div>
          </div>
        </section>
      </section>
      <img src={ShapeImage} alt="contactus" className="site-img" />

      <Footer />
    </div>
  );
};

export default CreatePizza;
