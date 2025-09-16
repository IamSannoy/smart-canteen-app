import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import PlaceOrderButton from "./placeOrderbutton";

export default function MenuBar() {
  const [menu, setMenu] = useState([]);

  // Fetch menu live (read-only)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "menu"), (snapshot) => {
      setMenu(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleOrder = (item) => {
    alert(`Ordering: ${item.name} - ₹${item.price}`);
    // later you will save order to Firestore
  };

  return (
     <div className="menu-container">
  <h2 className="menu-title">Menu</h2>
  <ul className="menu-list">
    {menu.map((item) => {
      // Generate random rating between 3.5 and 5.0
      const rating = (Math.random() * (5 - 3.5) + 3.5).toFixed(1);

      return (
        <li key={item.id} className="menu-item">
          <span className="menu-text">
            {item.name} - ₹{item.price}
          </span>
          <span className="menu-rating">⭐ {rating}/5</span>
          <div className="place-order-btn">
            <PlaceOrderButton item={item} />
          </div>
        </li>
      );
    })}
  </ul>
</div>

  );
}
