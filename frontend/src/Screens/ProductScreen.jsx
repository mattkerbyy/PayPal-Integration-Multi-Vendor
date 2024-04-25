import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Form } from "react-bootstrap";
import Rating from "../Components/Rating";
import { useDispatch, useSelector } from "react-redux";
import { listProductDetails } from "../actions/productActions";
import Loader from "../Components/Loader";
import Message from "../Components/Message";

import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  Grid,
  Divider,
  Button,
} from "@mui/material";

function ProductScreen() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);

  useEffect(() => {
    dispatch(listProductDetails(id));
  }, [dispatch]);
  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  };

  const style = {
    py: 0,
    width: "100%",
    maxWidth: 360,
    borderRadius: 2,
    border: "1px solid",
    borderColor: "divider",
    backgroundColor: "background.paper",
  };

  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          <Col md={6}>
            <Box>
              <Paper md={6}>
                <img
                  width="100%"
                  src={product.image}
                  alt={product.name}
                  fluid
                />
              </Paper>
            </Box>
          </Col>
          <Col md={3}>
            <List>
              <ListItem>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  {product.name}
                </Typography>
              </ListItem>
              <Divider component={"li"} />
              <ListItem>
                <Typography fontWeight="bold" color="text.secondary">
                  {product.description}
                </Typography>
              </ListItem>
              <Divider component={"li"} />
              <ListItem>
                <Typography>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                    color={"#f8e825"}
                  />
                </Typography>
              </ListItem>
            </List>
          </Col>
          <Col md={3}>
            <List sx={style}>
              <ListItem>
                <Grid container spacing={0}>
                  <Grid item xs={6} sm={6}>
                    Price:
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    ${product.price}
                  </Grid>
                </Grid>
              </ListItem>

              <Divider component={"li"} />
              <ListItem>
                <Grid container spacing={0}>
                  <Grid item xs={6} sm={6}>
                    Availability:
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    {product.countInStock > 0 ? "In stock" : "Out of Stock"}
                  </Grid>
                </Grid>
              </ListItem>
              <Divider component={"li"} />
              <ListItem>
                <Grid container spacing={0}>
                  <Grid item xs={6} sm={6} className="py-2">
                    Qty:
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <Form.Control
                      as="select"
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Grid>
                </Grid>
              </ListItem>
              <Divider component={"li"} />
              <ListItem>
                <Grid container>
                  <Grid item xs={12}>
                    <Button
                      onClick={addToCartHandler}
                      disabled={product.countInStock === 0}
                      fullWidth
                      size="large"
                      style={{ borderRadius: "20px" }}
                      color="secondary"
                      variant="contained"
                    >
                      Add To Cart
                    </Button>
                  </Grid>
                </Grid>
              </ListItem>
            </List>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default ProductScreen;
