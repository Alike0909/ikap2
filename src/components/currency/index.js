import React, { useEffect, useState } from 'react'
import './index.css'

function Currency(props) {
    const { convert } = props

    return (
        <div className="currency">
            <h2>Курсы валют</h2>
            <div className="currency-container-item">
                <p>{convert(1, 0).toFixed(2)} ₸</p>
                <h3>USD</h3>
                <p>{(convert(1, 0) + 1.6).toFixed(2)} ₸</p>
            </div>
            <div className="currency-container-item">
                <p>{convert(2, 0).toFixed(2)} ₸</p>
                <h3>EUR</h3>
                <p>{(convert(2, 0) + 2.4).toFixed(2)} ₸</p>
            </div>
            <div className="currency-container-item">
                <p>{convert(3, 0).toFixed(2)} ₸</p>
                <h3>RUB</h3>
                <p>{(convert(3, 0) + 0.05).toFixed(2)} ₸</p>
            </div>
            <div className="currency-container-item">
                <p>{convert(4, 0).toFixed(2)} ₸</p>
                <h3>KGS</h3>
                <p>{(convert(4, 0) + 0.22).toFixed(2)} ₸</p>
            </div>
            <div className="currency-container-item">
                <p>{convert(5, 0).toFixed(2)} ₸</p>
                <h3>GBP</h3>
                <p>{(convert(5, 0) + 10).toFixed(2)} ₸</p>
            </div>
            <div className="currency-container-item">
                <p>{convert(6, 0).toFixed(2)} ₸</p>
                <h3>CNY</h3>
                <p>{(convert(6, 0) + 1.2).toFixed(2)} ₸</p>
            </div>
            <div className="currency-container-item">
                <p>{(convert(7, 0) - 320).toFixed(2)} ₸</p>
                <h3>GOLD</h3>
                <p>{(convert(7, 0) + 320).toFixed(2)} ₸</p>
            </div>
        </div>
    );
}

export default Currency