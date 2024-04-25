import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../Components/Loader";
import UnauthorizedError from "../Screens/UnauthorizedError";
import { Table } from "react-bootstrap"; // Import Table from react-bootstrap for consistent styling

const AdminDashboardScreen = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const response = await fetch("/api/check-admin-group", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.is_admin);
          if (data.is_admin) {
            // Fetch orders and transactions if user is an admin
            fetchOrders();
            fetchTransactions();
          }
        } else {
          throw new Error("Failed to fetch user group");
        }
      } catch (error) {
        console.error("Error fetching user group:", error);
        setIsAdmin(false); // Set isAdmin to false in case of error
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
          sellerUsername: "seller1",
          description: "Product A",
          quantity: 1,
          buyerUsername: "buyer1",
        },
        // Add more transactions as needed
      ];
      setTransactions(transactionsData);
    };

    if (userInfo) {
      fetchAdminInfo();
    }
  }, [userInfo]);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAdmin) {
    return <UnauthorizedError />;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
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
              <th>Seller Username</th>
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
                <td>{transaction.sellerUsername}</td>
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

export default AdminDashboardScreen;
