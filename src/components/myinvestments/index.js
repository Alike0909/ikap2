import React, { useEffect, useState } from 'react'
import './index.css'

function MyInvestments(props) {
    const {invest} = props
    const {thousandSeparator} = props

    const investItems = invest.map((item, i) => 
        <div className="myinvestments-container-item" key={i} style={i > 2 ? { display: 'none' } : { display: 'flex' }}>
            <h4 style={{ width: '25%', color: '#3F4C67' }}>{item.data().name}</h4>
            <h4 style={{ width: '20%', color: '#F2A04F' }}>{item.data().profitability}</h4>
            <h4 style={{ width: '30%', color: '#3F4C67' }}>{thousandSeparator(item.data().invested)} {item.data().sign}</h4>
            <h4 style={{ width: '25%', color: '#5161D4' }}>{thousandSeparator((item.data().invested * Number(item.data().profitability.slice(0, -1)) / 1200).toFixed(2))} {item.data().sign} / мес</h4>
        </div>
    )

    return (
        <div className="myinvestments">
            <h2>Мои Инвестиции</h2>
            <div className="myinvestments-container">
                <div className="myinvestments-container-title">
                    <h4 style={{ width: '25%' }}>Наименование</h4>
                    <h4 style={{ width: '20%' }}>Процент</h4>
                    <h4 style={{ width: '30%' }}>Вклад</h4>
                    <h4 style={{ width: '25%' }}>Прибыль</h4>
                </div>
                {investItems}
            </div>
        </div>
    );
}

export default MyInvestments