import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function Wallet() {
  const [wallet, setWallet] = useState(0);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [showRechargeInput, setShowRechargeInput] = useState(false);

  useEffect(() => {
    const fetchWallet = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setWallet(userSnap.data().wallet || 0);
      }
    };

    fetchWallet();
  }, []);

  const handleRecharge = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in first.");
      return;
    }

    const amount = parseFloat(rechargeAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Enter a valid recharge amount.");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const currentWallet = userSnap.data().wallet || 0;
      const newWallet = currentWallet + amount;

      await updateDoc(userRef, { wallet: newWallet });
      setWallet(newWallet);
      setRechargeAmount("");
      setShowRechargeInput(false);
      alert(`Wallet recharged! New Balance: ₹${newWallet}`);
    }
  };

  return (
   <div className="wallet-container">
      <h2 className="wallet-title">Wallet</h2>
      <p className="wallet-balance">
        <strong>Current Balance:</strong> ₹{wallet}
      </p>

      {!showRechargeInput ? (
        <button 
          onClick={() => setShowRechargeInput(true)} 
          className="wallet-btn recharge-btn"
        >
          Recharge
        </button>
      ) : (
        <div className="wallet-recharge-box">
          <input
            type="number"
            placeholder="Enter amount"
            value={rechargeAmount}
            onChange={(e) => setRechargeAmount(e.target.value)}
            className="wallet-input"
          />
          <button onClick={handleRecharge} className="wallet-btn confirm-btn">
            Confirm
          </button>
          <button 
            onClick={() => setShowRechargeInput(false)} 
            className="wallet-btn cancel-btn"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
