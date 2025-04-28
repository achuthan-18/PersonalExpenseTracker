import React, { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome} from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { faMoneyBillTransfer } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
    const navigate = useNavigate();
    
    return (
        <div className='navbar-container'>
            
            <nav className='navbar-nav'>
                <ul className='navbar-ul'>
                    <li className='navbar-list' onClick={() => {navigate('/dashboard')}}>
                    <FontAwesomeIcon icon={faHome} className='fonts'/>
                    <span>Dashboard</span>
                    </li>
                    <li className='navbar-list' onClick={() => {navigate('/income')}}>
                    <FontAwesomeIcon icon={faDollarSign} className='fonts' />
                    <span>Income</span></li>

                    <li className='navbar-list' onClick={() => {navigate('/expense')}}>
                    <FontAwesomeIcon icon={faMoneyBillTransfer} className='fonts' />
                    <span>Expense</span>
                    </li>
                    <li className='navbar-list' onClick={() => {navigate('/login')}}>
                    <FontAwesomeIcon icon={faRightFromBracket} className='fonts' /> 
                    <span>Logout</span>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;