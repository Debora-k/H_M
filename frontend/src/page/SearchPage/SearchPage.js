import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "./components/ProductCard";
import "./style/search.style.css";

const SearchPage = () => {
    const productList = useSelector((state) => state.product.productList);
    return (
        <Container>
            <Row>
                {productList !== undefined && productList.length > 0 (
                    productList.map((item) => (
                    <Col md={3} sm={12} key={item._id}>
                        <ProductCard item={item} />
                    </Col>
                    ))
                )}
                <div className="">What are you looking for?</div>
                <button className="search-home-hints" role="button">
                    <div className="button-lines-wrapper">Evening bags</div>
                    <div className="button-lines-wrapper">Total look</div>
                    <div className="button-lines-wrapper">Animal print</div>
                    <div className="button-lines-wrapper">Elegant tops</div>
                    <div className="button-lines-wrapper">Long dress</div>
                    <div className="button-lines-wrapper">Grey jeans</div>
                </button>
                <div claaName="">You might be interested in</div>

            </Row>
        </Container>
    );
};

export default SearchPage;