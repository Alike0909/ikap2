import React, { useEffect, useState } from 'react'
import { PieChart } from 'react-minimal-pie-chart';
import './index.css'

import CashButton from '../cashButton'

function Cash(props) {
    const {db, moment} = props
    const { cash, currency } = props
    const { fetchCash, fetchCurrency } = props
    const { makeTransaction, fetchTransaction } = props
    const { convert, returnData, thousandSeparator } = props
    
    const colors = ['#F5A623', 'rgba(172, 226, 252)', '#F6C156', 'rgba(172, 226, 252)', '']

    const data = []
    for (let i in cash) {
        data.push({ title: cash[i].data().name, value: cash[i].data().invested, color: '#5161D4', invested: `${cash[i].data().invested} ${cash[i].data().sign}`})
    }
    for (let i in currency) {
        data.push({ title: currency[i].data().name, value: currency[i].data().invested * convert(currency[i].data().value, 0), color: colors[i], invested: `${currency[i].data().invested} ${currency[i].data().sign}` })
    }

    const dataItems = data.map((item, i) => 
        <div className="cash-title-item" key={i}>
            <div className="circle" style={{ background: item.color }}></div>
            <div className="cash-title-item-desc">
                <h4 style={{ marginBottom: '6px' }}>{item.title}</h4>
                <h4 style={{ color: '#3F4C67' }}>{item.invested}</h4>
            </div>
        </div>
    )

    return (
        <div className="cash">
            <h2>Собственные средства</h2>
            <div className="cash-container">
                <PieChart
                    data={data}
                    style={{width: '200px', height: '200px', marginRight: '48px'}}
                    lineWidth={42}
                />
                <div className="cash-title">
                    {dataItems}
                </div>
            </div>
            <CashButton db={db} moment={moment} cash={cash} fetchCash={fetchCash} currency={currency} fetchCurrency={fetchCurrency} makeTransaction={makeTransaction} fetchTransaction={fetchTransaction} returnData={returnData} thousandSeparator={thousandSeparator}></CashButton>
        </div>
    );
}

export default Cash