import React from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../PaymentPage/style/paymentPage.style.css";

const OrderCompletePage = () => {
  const { orderNum } = useSelector((state) => state.order);
  if (orderNum === "")
    return (
      <Container className="confirmation-page">
        <h1>Order failed</h1>
        <div>
          Please go back to the main page
          <Link to={"/"}>To Main Page</Link>
        </div>
      </Container>
    );
  return (
    <Container className="confirmation-page">
      <img
        src="/image/greenCheck.png"
        width={100}
        className="check-image"
        alt="greenCheck.png"
      />
      <h2>Completed Your Order!</h2>
      <div>Order Number: {orderNum}</div>
      <div>
        Now you can see your this order from your order history.
        <div className="text-align-center">
          <Link to={"/account/purchase"}>Go to my order page</Link>
        </div>
      </div>
    </Container>
  );
};

export default OrderCompletePage;
