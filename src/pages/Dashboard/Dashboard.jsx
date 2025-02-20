import React, { useEffect, useState } from "react";
import { BsPeople } from "react-icons/bs";
import { ThreeDots } from "react-loader-spinner"; // Import the spinner
import axios from "axios"; // Import axios
import "./dashboard.scss";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(0);
  const [active, setActive] = useState(0);
  const [suspended, setSuspended] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = sessionStorage.getItem("email");
    if (!email) {
      navigate("/login");
    }

    // Fetch customer counts from the backend APIs using axios
    const fetchCustomerCounts = async () => {
      try {
        // Fetch pending customers
        const pendingResponse = await axios.get(
          "https://kwetu-backend.onrender.com/api/customers/customer-counts/pending"
        );
        setPending(pendingResponse.data.pending);

        // Fetch active customers
        const activeResponse = await axios.get(
          "https://kwetu-backend.onrender.com/api/customers/customer-counts/active"
        );
        setActive(activeResponse.data.active);

        // Fetch suspended customers
        const suspendedResponse = await axios.get(
          "https://kwetu-backend.onrender.com/api/customers/customer-counts/suspended"
        );
        setSuspended(suspendedResponse.data.suspended);

        // Fetch rejected customers
        const rejectedResponse = await axios.get(
          "https://kwetu-backend.onrender.com/api/customers/customer-counts/rejected"
        );
        setRejected(rejectedResponse.data.rejected);
      } catch (error) {
        console.error("Error fetching customer counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerCounts();
  }, [navigate]);

  return (
    <div className="main-container">
      {loading ? (
        <div className="loaderContainer">
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#3498db"
            ariaLabel="three-dots-loading"
          />
          <div className="loadingMessage">Loading...</div>
        </div>
      ) : (
        <>
          <div className="main-title">
            <h3>DASHBOARD</h3>
          </div>
          <div className="main-cards">
            <div className="card">
              <div className="card-inner">
                <h3>PENDING CUSTOMERS</h3>
                <BsPeople className="card_icon" />
              </div>
              <h1 className="number">{pending}</h1>
            </div>

            <div className="card">
              <div className="card-inner">
                <h3>ACTIVE CUSTOMERS</h3>
                <BsPeople className="card_icon" />
              </div>
              <h1 className="number">{active}</h1>
            </div>

            <div className="card">
              <div className="card-inner">
                <h3>SUSPENDED CUSTOMERS</h3>
                <BsPeople className="card_icon" />
              </div>
              <h1 className="number">{suspended}</h1>
            </div>

            <div className="card">
              <div className="card-inner">
                <h3>REJECTED CUSTOMERS</h3>
                <BsPeople className="card_icon" />
              </div>
              <h1 className="number">{rejected}</h1>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
