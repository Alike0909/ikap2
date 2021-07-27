import React, { useEffect, useState } from 'react'
import './index.css'

import AddInvestBtn from '../addInvestBtn'

function MyTransaction(props) {
    const { db, moment } = props
    const { cash } = props
    const { fetchCash, fetchInvest } = props
    const { makeTransaction, fetchTransaction } = props
    const { thousandSeparator } = props

    return (
        <div className="mytransaction">
            <h2>Мои транзакции</h2>
            <AddInvestBtn db={db} moment={moment} cash={cash} fetchCash={fetchCash} fetchInvest={fetchInvest} makeTransaction={makeTransaction} fetchTransaction={fetchTransaction} thousandSeparator={thousandSeparator}></AddInvestBtn>
            <button className="do-mytransaction">Совершить перевод</button>
        </div>
    );
}

export default MyTransaction