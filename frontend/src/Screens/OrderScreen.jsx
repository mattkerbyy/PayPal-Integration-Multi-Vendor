import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../Components/Message";
import Loader from "../Components/Loader";
import { getOrderDetails, payOrder } from "../actions/orderActions";
import { ORDER_PAY_RESET } from "../constants/orderConstants";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function OrderScreen() {
  const orderId = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;
  const [sdkReady, setSdkReady] = useState(false);

  let updatedOrder = { ...order };
  if (!loading && !error) {
    const itemsPrice = order.orderItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2);

    updatedOrder = {
      ...updatedOrder,
      itemsPrice: itemsPrice,
    };
  }

  const addPayPalScript = () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://www.paypal.com/sdk/js?client-id=Adu9d8fTx_iirJv8jw-cCgSnKCapCpVMr7YiqBXSPCVpxiXJV8inLZG0DbeRK-7SnUFHjHUXuMTdxDxL&currency=USD";
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (!order || successPay || order._id !== Number(orderId.id)) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(getOrderDetails(orderId.id));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, orderId.id, order, successPay]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId.id, paymentResult));
  };

  const onApproveHandler = (data, actions) => {};

  const onError = (err) => {
    console.error("createOrder_error:", err);
  };

  const createOrderHandler = (data, actions) => {
    console.log(order);
    const purchaseUnits = order.orderItems.map((item) => ({
      amount: {
        currency_code: "USD",
        value: (
          parseFloat(item.price) * parseFloat(item.qty) +
          parseFloat(item.taxPrice || 0) +
          parseFloat(item.shippingPrice || 0)
        ).toFixed(2),
        breakdown: {
          item_total: {
            currency_code: "USD",
            value: (parseFloat(item.price) * parseFloat(item.qty)).toFixed(2),
          },
          tax_total: {
            currency_code: "USD",
            value: parseFloat(item.taxPrice || 0).toFixed(2),
          },
          shipping: {
            currency_code: "USD",
            value: parseFloat(item.shippingPrice || 0).toFixed(2),
          },
        },
      },
      description: item.name,
      reference_id: item.merchant_id,
      payee: {
        merchant_id: item.merchant_id,
      },
      items: [
        {
          name: item.name,
          unit_amount: {
            currency_code: "USD",
            value: item.price,
          },
          quantity: item.qty,
        },
      ],
    }));
    return actions.order
      .create({
        purchase_units: purchaseUnits,
      })
      .catch(onError);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <h2>Order: {order._id}</h2>
          <Row>
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Shipping</h2>
                  <p>
                    <strong>Name:</strong>
                    {order.user.name}
                  </p>
                  <p>
                    <strong>Email:</strong>
                    <a href={`mailto:${order.user.email}`}>
                      {order.user.email}
                    </a>
                  </p>
                  <p>
                    <strong>Shipping: </strong>
                    {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city}
                    {"  "}
                    {order.shippingAddress.postalCode},{"  "}
                    {order.shippingAddress.country}
                  </p>

                  {order.isDelivered ? (
                    <Message variant="success">
                      Delivered on {order.deliveredAt}
                    </Message>
                  ) : (
                    <Message variant="danger">Not Delivered</Message>
                  )}
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>Payment Method</h2>
                  <p>
                    <strong>Method: </strong>
                    {order.paymentMethod}
                  </p>
                  {order.isPaid ? (
                    <Message variant="success">Paid on {order.paidAt}</Message>
                  ) : (
                    <Message variant="danger">Not Paid</Message>
                  )}
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>Order Items</h2>
                  {order.orderItems.length === 0 ? (
                    <Message variant="info">Your Cart is Empty</Message>
                  ) : (
                    <ListGroup variant="flush">
                      {order.orderItems.map((item, index) => (
                        <ListGroup.Item key={item.product}>
                          <Row>
                            <Col md={1}>
                              <Image
                                src={item.image}
                                alt={item.name}
                                fluid
                                rounded
                              />
                            </Col>
                            <Col>
                              <Link to={`/products/${item.product}`}>
                                {item.name}
                              </Link>
                            </Col>
                            <Col md={4}>
                              {item.qty} X ${item.price} = $
                              {(item.qty * item.price).toFixed(2)}
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={4}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h2>Order Summary</h2>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Item:</Col>
                      <Col>${updatedOrder.itemsPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping:</Col>
                      <Col>${order.shippingPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tax:</Col>
                      <Col>${order.taxPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Total:</Col>
                      <Col>${order.totalPrice}</Col>
                    </Row>
                  </ListGroup.Item>

                  {!order.isPaid && (
                    <ListGroup.Item>
                      {loadingPay && <Loader />}
                      {!sdkReady ? (
                        <Loader />
                      ) : (
                        <PayPalScriptProvider
                          options={{
                            "client-id":
                              "Adu9d8fTx_iirJv8jw-cCgSnKCapCpVMr7YiqBXSPCVpxiXJV8inLZG0DbeRK-7SnUFHjHUXuMTdxDxL",
                            merchantId: order.orderItems.map(
                              (item) => item.merchant_id
                            ),
                          }}
                        >
                          <PayPalButtons
                            createOrder={createOrderHandler}
                            style={{ layout: "vertical" }}
                            onApprove={successPaymentHandler}
                            onError={onError}
                          />
                        </PayPalScriptProvider>
                      )}

                      {error && <div>Error: {error}</div>}
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
}

export default OrderScreen;
