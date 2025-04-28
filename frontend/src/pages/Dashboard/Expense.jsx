import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import '../../components/css/expense.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Navbar from "../../components/navbar/Navbar";

const Expense = () => {
  const [expenseData, setExpenseData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [icon, setIcon] = useState('');
  const [emojipic, setEmoji] = useState(false);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const navigate = useNavigate();

  const fetchExpense = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Invalid Credential");
      navigate("/login");
      return;
    }
    try {
      const res = await axios.get("http://localhost:8000/api/v1/expense/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);
      setExpenseData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchExpense();
  }, []);

  const handleEmojiClick = (emojiData) => {
    setIcon(emojiData.emoji);
    setEmoji(false);
  };

  useEffect(() => {
    if (!icon) {
      setIcon('💸'); 
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
      await axios.post('http://localhost:8000/api/v1/expense/add', {
        icon,
        category,
        amount,
        date,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIcon('');
      setCategory('');
      setAmount('');
      setDate('');
      setShowForm(false);

      fetchExpense(); 
    } catch (err) {
      console.error(err);
      alert("Failed to add expense");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token"); 
    try{
      await axios.delete(`http://localhost:8000/api/v1/expense/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchExpense();
    }
    catch(err){
      console.log(err.message);
    }
  }

  const handleDownloadExcel = async () => {
    const token = localStorage.getItem("token");
    try{
      const response =  await axios.get('http://localhost:8000/api/v1/expense/downloadexcel',
        {
          responseType: 'blob' ,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expense_details.xlsx'); 
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed", error);
      alert("Failed to download Excel file");
    }
  }

  const chartData = expenseData?.expense?.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
    amount: Number(item.amount)
}))||[];

  return (
    <div id="expense-page">
       <div id="navbar-expense">
          <div id="expense-name">
            <h1>
              <span id="expense-in">In</span>
              <span id="expense-ex">Ex</span>Tracker
              </h1>
            <h1>
              <b>{expenseData?.userInfo?.name.toUpperCase()}</b>
            </h1>
            <h2>{expenseData?.userInfo?.email}</h2>
          </div>
        <Navbar/> 
     </div>
        <div className="expense-page-container">
              
              <div className="expense-chart">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} fill="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
            </div>
              <div className="expense-header">
                <h2>Expense Sources</h2>
                <div className="expense-header-buttons">
                  <button className="download-btn" onClick={handleDownloadExcel}>Download</button>
                  <button className="add-btn" onClick={() => setShowForm(true)}>Add Expense</button>
                </div>
              </div>
        
              {showForm && (
                <form className="expense-form" onSubmit={handleSubmit}>
                  <h1>Add Expense</h1>
        
                  <div className="form-group">
                    <label>Pick Icon</label>
                    <button type="button" className="emoji-button" onClick={() => setEmoji(!emojipic)}>
                      {icon || '😀'}
                    </button>
                    {emojipic && (
                      <div className="emoji-picker">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Gift, Loan, etc"
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
                    <button type="submit" className="submit-btn">Submit</button>
                    <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
                  </div>
                </form>
              )}
        
              <div className="expense-list">
                {expenseData && expenseData.expense.length > 0 ? (
                  expenseData.expense.map((item , index) => (
                    <div className="expense-item" key={index}>
                      <div className="expense-left">
                        <div className="expense-icon">
                          <span role="img" aria-label="icon">{item.icon}</span>
                        </div>
                        <div className="expense-info">
                          <h3>{item.category}</h3>
                          <p>{new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
        
                      <div className="expense-right">
                        <span className="expense-amount">- ${item.amount.toLocaleString()}</span>
                        <button className="delete-btn" onClick={() => handleDelete(item._id)}>🗑</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-expense">No expense records found.</p>
                )}
              </div>
            </div>
            </div>
  );
};

export default Expense;
