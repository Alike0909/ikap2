import React, { useEffect, useState } from 'react'
import './index.css'

import Capital from '../../components/capital'
import Currency from '../../components/currency'
import MyTransaction from '../../components/mytransaction'
import MyCurrency from '../../components/mycurrency'
import MyInvestments from '../../components/myinvestments'
import Cash from '../../components/cash'

function Dashboard(props) {
    const { db } = props
    const { fetchCash, fetchCurrency, fetchInvest } = props
    const { cash, invest, currency } = props
    const { getAllInvested, getAllCurrency, getAllIncome, returnData } = props
    const { thousandSeparator, convert } = props

    return (
        <div className="dashboard">
            <h1>Дашборд</h1>
            <div className="dashboard-container-up">
                <Capital cash={cash} invest={invest} currency={currency} getAllInvested={getAllInvested} getAllCurrency={getAllCurrency} getAllIncome={getAllIncome} thousandSeparator={thousandSeparator}></Capital>
                <Currency convert={convert}></Currency>
                <div className="dashboard-container-up-right">
                    <MyTransaction></MyTransaction>
                    <MyCurrency currency={currency} convert={convert} thousandSeparator={thousandSeparator}></MyCurrency>
                </div>
            </div>
            <div className="dashboard-container-down">
                <MyInvestments invest={invest} thousandSeparator={thousandSeparator}></MyInvestments>
                <Cash cash={cash} currency={currency} convert={convert}></Cash>
            </div>
        </div>
    );
}

export default Dashboard