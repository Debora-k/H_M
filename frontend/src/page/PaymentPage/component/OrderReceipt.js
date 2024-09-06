import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";

const OrderReceipt = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="receipt-container">
      <h3 className="receipt-title">Order List</h3>
      <ul className="receipt-list">
        <li>
          <div className="display-flex space-between">
            <div>Shopping Bag</div>

            <div>$ total price</div>
          </div>
        </li>
      </ul>
      <div className="display-flex space-between receipt-title">
        <div>
          <strong>Total:</strong>
        </div>
        <div>
          <strong>$ total price</strong>
        </div>
      </div>
      {/* {location.pathname.includes("/cart") && cartList.length > 0 && (
        <Button
          variant="dark"
          className="payment-button"
          onClick={() => navigate("/payment")}
        >
          결제 계속하기
        </Button>
      )} */}

      <div>
          Prices and shipping costs are not confirmed until you've reached checkout.
        <div>
          30-day returns. Read more about our return and refund policy.
        </div>
      </div>
    </div>
  );
};

export default OrderReceipt;
