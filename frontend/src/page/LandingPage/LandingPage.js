import React, { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import { Row, Col, Container } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";
import ReactPaginate from "react-paginate";


const LandingPage = () => {
  const totalPageNum = useSelector((state) => state.product.totalPageNum);

  const [query] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    name: query.get("name") || "",
  }); //검색 조건들을 저장하는 객체

  const productList = useSelector((state) => state.product.productList);
  const name = query.get("name");

  const handlePageClick = ({ selected }) => {
    //  쿼리에 페이지값 바꿔주기
    setSearchQuery({page:selected +1, name:searchQuery.name});
  };

useEffect(() => {
  dispatch(getProductList({...searchQuery, specialty:true})); // specialty is setting up difference between admin product page & landing page
}, [query]);


useEffect(() => {
    //검색어나 페이지가 바뀌면 url바꿔주기 (검색어또는 페이지가 바뀜 => url 바꿔줌=> url쿼리 읽어옴=> 이 쿼리값 맞춰서  상품리스트 가져오기)
    if(searchQuery.name === "") {
      delete searchQuery.name;
    };
    const params = new URLSearchParams(searchQuery);
    // to change to be readable in url by using toString
    const query = params.toString();
    navigate("?" + query);
}, [searchQuery]);

  return (
    <Container>
      <Row>
        {productList !== undefined && productList.length > 0 ? (
          productList.map((item) => (
            <Col md={3} sm={12} key={item._id}>
              <ProductCard item={item} />
            </Col>
          ))
        ) : (
          <div className="text-align-center empty-bag">
            {name === "" ? (
              <h2>There's no items!</h2>
            ) : (
              <h2>can't find {name}</h2>
            )}
          </div>
        )}
      </Row>
      <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={totalPageNum}
          forcePage={searchQuery.page - 1} //forcePage = 1 means page 2
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          className="display-center list-style-none"
        />
    </Container>
  );
};

export default LandingPage;
