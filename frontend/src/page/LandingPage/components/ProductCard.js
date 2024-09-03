import React from "react";
import { useNavigate } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";

const ProductCard = ({ item }) => {
  const navigate = useNavigate();
  const showProduct = (id) => {
    navigate(`/item/${id}`);
  };
  return (
    <div className="card" onClick={() => showProduct(item._id)}>
      <img src={item?.image} alt={item?.image} />
      <div>{item?.name}</div>
      <div>$ {currencyFormat(item?.price)}</div>
    </div>
  );
};

export default ProductCard;
