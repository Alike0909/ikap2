import React, { useEffect, useState } from 'react'
import './index.css'

import AddInvestBtn from '../addInvestBtn'
import DoTransactBtn from '../doTransactBtn'

function MyTransaction(props) {
    const { db, moment } = props
    const { currentUser } = props
    const { cash, currency, card } = props
    const { fetchCash, fetchCurrency, fetchInvest, fetchCard } = props
    const { makeTransaction, fetchTransaction } = props
    const { returnData, convert, thousandSeparator, success } = props

    return (
        <div className="mytransaction">
            <h2>Мои транзакции</h2>
            <AddInvestBtn db={db} moment={moment} currentUser={currentUser} cash={cash} fetchCash={fetchCash} fetchInvest={fetchInvest} makeTransaction={makeTransaction} fetchTransaction={fetchTransaction} returnData={returnData} thousandSeparator={thousandSeparator} success={success}></AddInvestBtn>
            <DoTransactBtn db={db} moment={moment} currentUser={currentUser} cash={cash} fetchCash={fetchCash} currency={currency} fetchCurrency={fetchCurrency} card={card} fetchCard={fetchCard} makeTransaction={makeTransaction} fetchTransaction={fetchTransaction} returnData={returnData} convert={convert} thousandSeparator={thousandSeparator} success={success}></DoTransactBtn>
        </div>
    );
}

export default MyTransaction