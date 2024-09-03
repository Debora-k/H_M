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
        <h1>주문 실패</h1>
        <div>
          메인페이지로 돌아가세요
          <Link to={"/"}>메인페이지로 돌아가기</Link>
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
      <h2>예약이 완료됬습니다!</h2>
      <div>예약번호:하드코딩</div>
      <div>
        예약 확인은 내 예약 메뉴에서 확인해주세요
        <div className="text-align-center">
          <Link to={"/account/purchase"}>내 예약 바로가기</Link>
        </div>
      </div>
    </Container>
  );
};

export default OrderCompletePage;
