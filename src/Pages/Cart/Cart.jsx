import React, { useEffect, useState } from "react";
import "./cart.scss";
import Header from "../../Components/CommonComponents/Header/Header";
import Footer from "../../Components/CommonComponents/Footer/Footer";
import Tomato from "../../assets/images/tomato_5.png.png";
import Capsicum from "../../assets/images/capsicum.png";
import RedChili from "../../assets/images/red_chili.png";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import PizzaOne from "../../assets/images/cart-pizza1.png";
import PizzaTwo from "../../assets/images/cart-pizza2.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";

import axios from "axios";
import Cookies from "js-cookie";

const Cart = () => {
  const apiUrl = "https://stage688.devdesignbuild.com/api";
  const [cartItems, setCartItems] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const sessionId = Cookies.get("sessionId");
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchCartItems();
  }, [quantity]);
  useEffect(() => {
    fetchCartItems();
  }, []);
  // console.log(cartItems);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/cart/get?session_id=${sessionId}`
      );
      console.log("responseeeeefetchCartItems", response.data.data[0].items);
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
  // Quantity Functions
  const handleDecrease = (id, qty) => {
    if (qty > 1) {
      const newQuantity = qty - 1;
      setQuantity(newQuantity);
      updateQuantity(newQuantity, id);
      fetchCartItems();
    }
  };

  const handleIncrease = (id, qty) => {
    console.log("selected", id, qty);
    const newQuantity = qty + 1;
    setQuantity(newQuantity);
    updateQuantity(newQuantity, id);
    fetchCartItems();
  };

  const updateQuantity = (newQuantity, id) => {
    console.log("product id", id, newQuantity);
    axios
      .post(`${apiUrl}/cart/quantity-update`, {
        session_id: sessionId,
        product_id: id,
        quantity: newQuantity,
      })
      .then((response) => {
        console.log("responseeeee", response);
        if (response.status === 200) {
          fetchCartItems()
        toast.success("Product successfully updated to cart!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
        });
        }
        
      })
      .catch((error) => {
        console.error("Error updating quantity:", error.message);
        toast.error("An error occurred while updating the product!", {
          position: "top-right",
          autoClose: 5000,
        });
      });
  };

  // Delete Functions
  const handleDelete = async (productId) => {
    try {
      const deleteData = {
        session_id: sessionId,
        product_id: productId,
      };

      const res = await axios.post(`${apiUrl}/cart/remove`, deleteData);
      console.log(res.data.message);
      window.location.reload();
    } catch (error) {
      console.error("Error Deleting Cart Product", error.message);
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="add-to-cart">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <img src={Tomato} alt="Tomato" className="Tomato" />
              <img src={Capsicum} alt="Capsicum" className="Capsicum" />
              <img src={RedChili} alt="RedChili" className="RedChili" />
              <h1 className="mb-5">Add to cart</h1>
            </div>
          </div>
          <div>
            {cartItems.length > 0 ? (
              cartItems.map((item) => {
                const totalPrice = item.product.price * item.quantity

                return(
                <div className="row border-b mb-5" key={item.id}>
                  <div className="col-md-4">
                    <div className="d-flex align-items-center card-item">
                      <img src={item.product.image} alt="PizzaOne" />
                      <div className="ml">
                        <h5>{item.product.name}</h5>
                        <p>{item.product.description.slice(0, 26)}...</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="cart-product-quantity">
                      <FaPlus
                        onClick={() =>
                          handleIncrease(item.product.id, item.quantity)
                        }
                      />
                      <input type="text" value={item.quantity} readOnly />
                      <FaMinus
                        onClick={() =>
                          handleDecrease(item.product.id, item.quantity)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="delete-icon">
                      { 
                      <h5>${item.total} USD</h5>
}
                      <MdDelete onClick={() => handleDelete(item.product.id)} />
                    </div>
                  </div>
                </div>
              )})
            ) : (
              <div className="empty">
                <h3>Nothing available in this cart right now.</h3>
              </div>
            )}
          </div>
        
          <div className="row">
            <div className="col-md-6">
              {/* <div className="promo-code my-5">
                <h6>Code Promo</h6>
                <input type="text" placeholder="INDONESIA" />
                <h6>35% OFF</h6>
              </div> */}
              <Link to={"/CustomOrder"} className="btn-txt" >CHECKOUT</Link>
            </div>
            <div className="col-md-6">
              <div className="total-icon">
                <h5>Subtotal</h5>
                <h4>${totalPrice.toFixed(2)}USD</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
