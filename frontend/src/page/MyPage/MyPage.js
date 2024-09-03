import React from "react";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import OrderStatusCard from "./component/OrderStatusCard";
import "./style/orderStatus.style.css";
import { getOrder } from "../../features/order/orderSlice";

const MyPage = () => {
  const dispatch = useDispatch();
  const { orderList } = useSelector((state) => state.order);
  console.log(orderList);
  useEffect(() => {
    dispatch(getOrder());
  }, [dispatch]);

  if (orderList?.length === 0) {
    return (
      <Container className="no-order-box">
        <div>진행중인 주문이 없습니다.</div>
      </Container>
    );
  }
  return (
    <Container className="status-card-container">
      {orderList.map((item) => (
        <OrderStatusCard
          orderItem={item}
          className="status-card-container"
          key={item._id}
        />
      ))}
    </Container>
  );
};

export default MyPage;
