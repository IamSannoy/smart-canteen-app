import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export default function AdminDashboard() {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);

  // Live fetch menu
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "menu"), (snapshot) => {
      setMenu(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Fetch orders once
  useEffect(() => {
    const fetchOrders = async () => {
      const snapshot = await getDocs(collection(db, "orders"));
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchOrders();
  }, []);

  // Add menu item
  const addMenuItem = async () => {
    const name = prompt("Enter item name:");
    const price = prompt("Enter item price:");
    if (name && price) {
      await addDoc(collection(db, "menu"), { name, price: Number(price) });
      alert("Item added!");
    }
  };

  // Remove menu item
  const removeMenuItem = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this item?");
    if (confirmDelete) {
      await deleteDoc(doc(db, "menu", id));
      alert("Item removed!");
    }
  };

  // Update order status
  const updateStatus = async (id, newStatus, userEmail) => {
  const orderRef = doc(db, "orders", id);
  await updateDoc(orderRef, { status: newStatus });

  setOrders(orders.map(order =>
    order.id === id ? { ...order, status: newStatus } : order
  ));

  if (newStatus === "Ready") {
    // Call backend API to send email
    await fetch("/send-ready-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, item: orderRef.itemName })
    });
  }
};

  return (
    <>
    <div className="admin-container"> {/* Menu Section */} <section className="admin-section"> <h2 className="section-title"> Menu </h2> <button onClick={addMenuItem} className="btn btn-green"> Add Item </button> <ul className="menu-list"> {menu.map((item) => ( <li key={item.id} className="menu-row"> <span className="menu-text"> {item.name} - ₹{item.price} </span> <button onClick={() => removeMenuItem(item.id)} className="btn btn-red" > Remove </button> </li> ))} </ul> </section></div>
<section className="admin-section">
  <h2 className="section-title"> Order List</h2>
  {orders.length === 0 ? (
    <p className="empty-text">No orders yet.</p>
  ) : (
    <table className="admin-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Item</th>
          <th>Quantity</th>
          <th>Total Price</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.userEmail}</td>
            <td>{order.itemName}</td>
            <td>{order.quantity}</td>
            <td>₹{order.totalPrice}</td>
            <td>
              <button
                onClick={() =>
                  updateStatus(
                    order.id,
                    order.status === "Pending" ? "Ready" : "Pending",
                    order.userEmail
                  )
                }
                className={`btn ${
                  order.status === "Pending" ? "btn-red" : "btn-green"
                }`}
              >
                {order.status === "Pending" ? "Pending" : "Ready"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</section>
</>
  );
}