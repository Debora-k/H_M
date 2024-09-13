import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import OrderReceipt from "./component/OrderReceipt";
import PaymentForm from "./component/PaymentForm";
import "./style/paymentPage.style.css";
import { cc_expires_format } from "../../utils/number";
import { createOrder } from "../../features/order/orderSlice";

const PaymentPage = () => {
  const dispatch = useDispatch();
  const { orderNum } = useSelector((state) => state.order);
  const [cardValue, setCardValue] = useState({
    cvc: "",
    expiry: "",
    focus: "",
    name: "",
    number: "",
  });
  const navigate = useNavigate();
  const [firstLoading, setFirstLoading] = useState(true);
  const [shipInfo, setShipInfo] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    address: "",
    city: "",
    zip: "",
  });

  const {cartList, totalPrice} = useSelector(state => state.cart);

  useEffect(() => {
    // 오더번호를 받으면 어디로 갈까?
  }, [orderNum]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // create an order
    const {firstName, lastName, contact, address, city, zip} = shipInfo;
    dispatch(createOrder({
      totalPrice,
      shipTo:{address, city, zip},
      contact:{firstName, lastName, contact},
      orderList: cartList.map((items) => {
        return {
          itemId: items.itemId._id,
          price:items.itemId.price,
          qty:items.qty,
          size:items.size,
        };
      })
    }))
  };

  const handleFormChange = (event) => {
    //adding info into shipInfo
    const {name, value} = event.target;
    setShipInfo({...shipInfo,[name]: value});
  };

  const handlePaymentInfoChange = (event) => {
    //credit card's info
    const {name, value} =event.target;
    if(name === "expiry") {
      //cc_expires_format does help to users not add '0' for inputting months
      let newValue = cc_expires_format(value);
      setCardValue({...cardValue, [name]: newValue});
      return;
    }
    setCardValue({...cardValue, [name]: value});

  };


  const handleInputFocus = (e) => {
    setCardValue({ ...cardValue, focus: e.target.name });
  };
    if (cartList?.length === 0) {
      navigate("/cart");
    } // if there's no items to order, than redirect to the cart page
  return (
    <Container>
      <Row>
        <Col lg={7}>
          <div>
            <h2 className="mb-2">Shipping Address</h2>
            <div>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="lastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleFormChange}
                      required
                      name="lastName"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleFormChange}
                      required
                      name="firstName"
                    />
                  </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="formGridAddress1">
                  <Form.Label>Contact Info</Form.Label>
                  <Form.Control
                    placeholder="010-xxx-xxxxx"
                    onChange={handleFormChange}
                    required
                    name="contact"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGridAddress2">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    placeholder="Apartment, studio, or floor"
                    onChange={handleFormChange}
                    required
                    name="address"
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      onChange={handleFormChange}
                      required
                      name="city"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridZip">
                    <Form.Label>Zip</Form.Label>
                    <Form.Control
                      onChange={handleFormChange}
                      required
                      name="zip"
                    />
                  </Form.Group>
                </Row>
                <div className="mobile-receipt-area">
                  {<OrderReceipt cartList={cartList} totalPrice={totalPrice}/>}
                </div>
                <div>
                  <h2 className="payment-title">Payment</h2>
                  <PaymentForm 
                  cardValue={cardValue} 
                  handleInputFocus={handleInputFocus}
                  handlePaymentInfoChange={handlePaymentInfoChange}
                  />

                </div>

                <Button
                  variant="dark"
                  className="payment-button pay-button"
                  type="submit"
                >
                  Complete Purchase
                </Button>
              </Form>
            </div>
          </div>
        </Col>
        <Col lg={5} className="receipt-area">
        {/** because of mobile version, added one more OrderReceipt */}
          <OrderReceipt cartList={cartList} totalPrice={totalPrice}/>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;
