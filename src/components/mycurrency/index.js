import React, { useEffect, useState } from 'react'
import './index.css'

function MyCurrency(props) {
    const { currency } = props
    const { convert } = props
    const { thousandSeparator } = props

    const currencyItems = currency.map((item, i) => 
        <div className="mycurrency-container-item" key={i} style={i > 1 ? {display: 'none'} : {display: 'flex'}}>
            <div className="item-icon" >{item.data().sign}</div>
            <p style={{ minWidth: '15%' }}>{item.data().name}</p>
            <p style={{ minWidth: '20%' }}>{item.data().type}</p>
            <p style={{ color: '#F2C94F', minWidth: '20%' }}>{thousandSeparator(item.data().invested.toFixed(2))} {item.data().sign}</p>
            <p style={{ color: '#5161D4', minWidth: '25%' }}>{thousandSeparator((item.data().invested * convert(i, 0)).toFixed(2))} ₸</p>
        </div>
    )

    return (
        <div className="mycurrency">
            <h2>Мои Валюты</h2>
            {currencyItems}
        </div>
    );
}

export default MyCurrency