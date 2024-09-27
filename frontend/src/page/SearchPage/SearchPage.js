import React, { useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "../LandingPage/components/ProductCard";
import { getProductList } from "../../features/product/productSlice";
import "./style/search.style.css";

const SearchPage = () => {
    const [query] = useSearchParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState({
      page: query.get("page") || 1,
      name: query.get("name") || "",
    });
    const productList = useSelector((state) => state.product.productList);
    const name = query.get("name");

    useEffect(() => {
        dispatch(getProductList({...searchQuery, specialty:true}));
      }, [query]);

      useEffect(() => {
        if(searchQuery.name === "") {
          delete searchQuery.name;
        };
        const params = new URLSearchParams(searchQuery);
        const query = params.toString();
        navigate("?" + query);
    }, [searchQuery]);

    return (
        <Container>

            <div className="">What are you looking for?</div>
            <button className="search-home-hints" role="button">
                <div className="button-lines-wrapper">Evening bags</div>
                <div className="button-lines-wrapper">Total look</div>
                <div className="button-lines-wrapper">Animal print</div>
                <div className="button-lines-wrapper">Elegant tops</div>
                <div className="button-lines-wrapper">Long dress</div>
                <div className="button-lines-wrapper">Grey jeans</div>
            </button>
            <div className="">You might be interested in</div>
            <Row>
                {productList.map((item) => (
                <Col md={3} sm={12} key={item._id}>
                        <ProductCard item={item} />
                </Col>
                    ))
                }
            </Row>
        </Container>
    );
};

export default SearchPage;