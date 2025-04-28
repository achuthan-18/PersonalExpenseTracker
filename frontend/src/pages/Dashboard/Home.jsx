import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../components/css/dashboard.css"; 
import Navbar from "../../components/navbar/Navbar";
import { ClipLoader } from "react-spinners"; 

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [userInfo , setUserInfo] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get("http://localhost:8000/api/v1/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        setUserInfo(response.data.getUser);
        setDashboardData(response.data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (!dashboardData) {
    return <div className="loader-container"><ClipLoader color={"#36D7B7"} size={50} /></div>;
  }

  const { totalBalance, totalIncome, totalExpenses, recentTransaction } = dashboardData;

  const chartData = [
    { name: "Total Balance", value: totalBalance, color: "#6a5acd" },
    { name: "Total Expenses", value: totalExpenses, color: "#ff4d4f" },
    { name: "Total Income", value: totalIncome, color: "#ff7f0e" },
  ];

  return (
    <div id="home-container">
      <div id="navbar-home">
          <div id="home-name">
            <h1 id="home-title">
              <span id="home-in">In</span>
              <span id="home-ex">Ex</span>Tracker
            </h1>
            <h1 id="home-info">
              <div>
                <img src={userInfo?.selectedImage} alt="User" id="userimage"/>
              </div>
              <b>{userInfo?.name.toUpperCase()}</b>
            </h1>
            <h2>{userInfo?.email}</h2>
          </div>
        <Navbar/> 
     </div>
    <div className="dashboard-container">
      
      <div className="cards-container">
        <div className="card">
          <div className="icon purple">
            <span role="img" aria-label="balance">💳</span>
          </div>
          <div>
            <h4 className="card-title">Total Balance</h4>
            <p className="card-amount">${(totalBalance).toLocaleString()}</p>
          </div>
        </div>

        <div className="card">
          <div className="icon orange">
            <span role="img" aria-label="income">💰</span>
          </div>
          <div>
            <h4 className="card-title">Total Income</h4>
            <p className="card-amount">${(totalIncome).toLocaleString()}</p>
          </div>
        </div>

        <div className="card">
          <div className="icon red">
            <span role="img" aria-label="expenses">💸</span>
          </div>
          <div>
            <h4 className="card-title">Total Expenses</h4>
            <p className="card-amount">${(totalExpenses).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bottom-section">
        <div className="transactions">
          <div className="transactions-header">
            <h2>Recent Transactions</h2>
            <button className="see-all">See All</button>
          </div>
          <div className="transactions-list">
            
            
            {recentTransaction.length > 0 ? (
              recentTransaction.slice(0, 5).map((tx, index) => (
            
              <div key={index} className="transaction-item">
                <div className="transaction-left">
                  <div className="transaction-icon">
                    {tx.type === "income" ? `${tx.icon}` : `${tx.icon}`}
                  </div>
                  <div>
                  <h4 className="transaction-title">{tx.title || (tx.type === "income" ? `${tx.source}` :`${tx.category}` )}</h4>
                    <p className="transaction-date">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className={`transaction-amount ${tx.type === "income" ? "green" : "red"}`}>
                  {tx.type === "income" ? `+ $${tx.amount}` : `- $${tx.amount}`}
                </div>
              </div>
            ))): (
              <p>No recent transactions found.</p>
            )}
          </div>
        </div>

        <div className="overview">
          <h2>Financial Overview</h2>
          <PieChart width={400} height={400}>
            <Pie
              data={chartData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
          <p className="card-amount">${totalBalance?.toLocaleString() || 0}</p>
          <p className="overview-label">Total Balance</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;