import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import './index.css'

import Capital from '../../components/capital'
import Currency from '../../components/currency'
import MyTransaction from '../../components/mytransaction'
import MyCurrency from '../../components/mycurrency'
import MyInvestments from '../../components/myinvestments'
import Cash from '../../components/cash'

function Dashboard(props) {
    const { db, moment } = props
    const { fetchCash, fetchCurrency, fetchInvest } = props
    const { cash, invest, currency, currencies } = props
    const { getAllInvested, getAllCurrency, getAllIncome, returnData } = props
    const { makeTransaction, fetchTransaction } = props
    const { thousandSeparator, convert } = props

    const [error, setError] = useState()
    const { currentUser, logout } = useAuth()
    const history = useHistory()

    async function handleLogOut() {
        setError('')

        try {
            await logout()
            history.push('/login')
        } catch {
            setError('Failed to Log Out')
        }
    }

    return (
        <div className="dashboard">
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <h1>Дашборд</h1> 
                <button onClick={handleLogOut} style={{width: 'fit-content', height: 'fit-content', border: 'none', background: 'transparent'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                        <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                    </svg>
                </button>
            </div>
            <div className="dashboard-container-up">
                <Capital cash={cash} invest={invest} currency={currency} getAllInvested={getAllInvested} getAllCurrency={getAllCurrency} getAllIncome={getAllIncome} thousandSeparator={thousandSeparator}></Capital>
                <Currency convert={convert} currencies={currencies}></Currency>
                <div className="dashboard-container-up-right">
                    <MyTransaction db={db} moment={moment} cash={cash} fetchCash={fetchCash} fetchInvest={fetchInvest} makeTransaction={makeTransaction} fetchTransaction={fetchTransaction} thousandSeparator={thousandSeparator}></MyTransaction>
                    <MyCurrency currency={currency} convert={convert} thousandSeparator={thousandSeparator}></MyCurrency>
                </div>
            </div>
            <div className="dashboard-container-down">
                <MyInvestments db={db} moment={moment} cash={cash} fetchCash={fetchCash} invest={invest} fetchInvest={fetchInvest} fetchTransaction={fetchTransaction} makeTransaction={makeTransaction} thousandSeparator={thousandSeparator}></MyInvestments>
                <Cash db={db} moment={moment} cash={cash} fetchCash={fetchCash} currency={currency} fetchCurrency={fetchCurrency} fetchTransaction={fetchTransaction} convert={convert} makeTransaction={makeTransaction} returnData={returnData} thousandSeparator={thousandSeparator}></Cash>
            </div>
        </div>
    );
}

export default Dashboard