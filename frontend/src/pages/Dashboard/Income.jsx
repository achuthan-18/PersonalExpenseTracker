import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import "../../components/css/income.css";
import Navbar from "../../components/navbar/Navbar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const Income = () => {
  const [incomeData, setIncomeData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [icon, setIcon] = useState("");
  const [emojipic, setEmoji] = useState(false);
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const navigate = useNavigate();

  

  const fetchIncome = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Invalid Credential");
      navigate("/login");
      return;
    }
    try {
      const res = await axios.get("http://localhost:8000/api/v1/income/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);
      setIncomeData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  const handleEmojiClick = (emojiData) => {
    setIcon(emojiData.emoji);
    setEmoji(false);
  };

  useEffect(() => {
    if (!icon) {
      setIcon("💰");
      setEmoji(false);
    }
  }, [icon]);

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:8000/api/v1/income/add",
        {
          icon,
          source,
          amount,
          date,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIcon("");
      setSource("");
      setAmount("");
      setDate("");
      setShowForm(false);

      fetchIncome();
    } catch (err) {
      console.error(err);
      alert("Failed to add income");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8000/api/v1/income/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchIncome();
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleDownloadExcel = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/income/downloadexcel",
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed", error);
      alert("Failed to download Excel file");
    }
  };

  const chartdata =
    incomeData?.income?.map((item) => ({
      data: new Date(item.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      }),
      amount: item.amount,
    })) || [];

  return (
    
    <div id="income-page">
     <div id="navbar-income">
          <div id="income-name">
            <h1 id="income-title">
              <span id="income-in">In</span>
              <span id="income-ex">Ex</span>Tracker
            </h1>
            <h1 id="income-info">
              <div>
                <img src={incomeData?.userInfo?.selectedImage} alt="User" id="userimage"/>
              </div>
              <b>{incomeData?.userInfo?.name.toUpperCase()}</b>
            </h1>
            <h2>{incomeData?.userInfo?.email}</h2>
          </div>
        <Navbar/> 
     </div>
     
      <div className="income-page-container">
      <div className="income-chart">
        <ResponsiveContainer width="100%" height={300}>
           <BarChart data={chartdata} margin={{top:20,right:30,left:20,bottom:5}}>
             <CartesianGrid strokeDasharray="3,3"/>
             <XAxis dataKey="data"/>
             <YAxis dataKey="amount"/>
             <Tooltip/>
             <Bar dataKey="amount" fill="#1b8c92" radius={[10,10,0,0]} />
           </BarChart>
        </ResponsiveContainer>
      </div>
        <div className="income-header">
          <h2>Income Sources</h2>
          <div className="income-header-buttons">
            <button className="download-btn" onClick={handleDownloadExcel}>
              Download
            </button>
            <button className="add-btn" onClick={() => setShowForm(true)}>
              Add Income
            </button>
          </div>
        </div>

        {showForm && (
          <form className="income-form" onSubmit={handleSubmit}>
            <h1>Add Income</h1>

            <div className="form-group">
              <label>Pick Icon</label>
              <button
                type="button"
                className="emoji-button"
                onClick={() => setEmoji(!emojipic)}
              >
                {icon || "😀"}
              </button>
              {emojipic && (
                <div className="emoji-picker">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Source</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Salary, Freelance, etc"
                required
              />
            </div>

            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="submit-btn">
                Submit
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="income-list">
          {incomeData && incomeData.income.length > 0 ? (
            incomeData.income.map((item, index) => (
              <div className="income-item" key={index}>
                <div className="income-left">
                  <div className="income-icon">
                    <span role="img" aria-label="icon">
                      {item.icon}
                    </span>
                  </div>
                  <div className="income-info">
                    <h3>{item.source}</h3>
                    <p>
                      {new Date(item.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="income-right">
                  <span className="income-amount">
                    + ${item.amount.toLocaleString()}
                  </span>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item._id)}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-income">No income records found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Income;
