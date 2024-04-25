import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/Loader";
import UnauthorizedError from "../Screens/UnauthorizedError";
import { Table, Form, Button } from "react-bootstrap"; // Import Table from react-bootstrap for consistent styling

const SellerDashboardScreen = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [isLoading, setIsLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false);
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [productBrand, setProductBrand] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        const response = await fetch("/api/check-seller-group", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setIsSeller(data.is_seller);
          if (data.is_seller) {
            // Fetch orders and transactions if user is a seller
            fetchOrders();
            fetchTransactions();
          }
        } else {
          throw new Error("Failed to fetch user group");
        }
      } catch (error) {
        console.error("Error fetching user group:", error);
        setIsSeller(false); // Set isSeller to false in case of error
      } finally {
        setIsLoading(false);
      }
    };

    const fetchOrders = async () => {
      // Placeholder data for orders (replace with actual API call)
      const ordersData = [
        {
          id: 1,
          orderDate: "2024-03-27",
          buyerUsername: "buyer1",
          total: 50.0,
          paidStatus: "Paid",
          deliveredStatus: "Not Delivered",
        },
        // Add more orders as needed
      ];
      setOrders(ordersData);
    };

    const fetchTransactions = async () => {
      // Placeholder data for transactions (replace with actual API call)
      const transactionsData = [
        {
          transactionId: "123456789",
          referenceId: "REF123",
          totalAmount: 50.0,
          currency: "USD",
          description: "Product A",
          quantity: 1,
          buyerUsername: "buyer1",
        },
        // Add more transactions as needed
      ];
      setTransactions(transactionsData);
    };

    if (userInfo) {
      fetchSellerInfo();
    }
  }, [userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("image", productImage);
    formData.append("brand", productBrand);
    formData.append("description", productDescription);
    // Append more product data to formData as needed

    try {
      const response = await fetch("/api/products/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: formData,
      });
      if (response.ok) {
        // Product created successfully, you can redirect or show a success message
        console.log("Product created successfully");
      } else {
        // Handle error
        throw new Error("Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!isSeller) {
    return <UnauthorizedError />;
  }

  return (
    <div>
      <h1>Seller Dashboard</h1>
      {/* Product form */}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="productName">
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="productImage">
          <Form.Label>Product Image</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setProductImage(e.target.files[0])}
          />
        </Form.Group>
        <Form.Group controlId="productBrand">
          <Form.Label>Product Brand</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product brand"
            value={productBrand}
            onChange={(e) => setProductBrand(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="productDescription">
          <Form.Label>Product Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product description"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          />
        </Form.Group>
        {/* Add more form fields for other product attributes */}
        <Button variant="primary" type="submit" style={{ marginTop: "20px" }}>
          Submit
        </Button>
      </Form>
      <div className="orders-table">
        <h2 style={{ marginTop: "20px" }}>Orders</h2>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Order Date Created</th>
              <th>Buyer's Username</th>
              <th>Total</th>
              <th>Paid Status</th>
              <th>Delivered Status</th>
              <th>Order Details Link</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.orderDate}</td>
                <td>{order.buyerUsername}</td>
                <td>{order.total}</td>
                <td>{order.paidStatus}</td>
                <td>{order.deliveredStatus}</td>
                <td>
                  <a href={`/order/${order.id}`}>Details</a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="transactions-table">
        <h2 style={{ marginTop: "20px" }}>Transactions</h2>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Transaction ID from PayPal</th>
              <th>Reference ID of the unit</th>
              <th>Total Amount of the Transaction</th>
              <th>Currency</th>
              <th>Description of the order</th>
              <th>Quantity</th>
              <th>Buyer Username</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.transactionId}</td>
                <td>{transaction.referenceId}</td>
                <td>{transaction.totalAmount}</td>
                <td>{transaction.currency}</td>
                <td>{transaction.description}</td>
                <td>{transaction.quantity}</td>
                <td>{transaction.buyerUsername}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default SellerDashboardScreen;
