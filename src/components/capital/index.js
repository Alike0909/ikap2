import React, { useEffect, useState } from 'react'
import './index.css'

import ImageData from '../../images'

function Capital(props) {
    const { cash, invest, currency } = props
    const { getAllInvested, getAllCurrency, getAllIncome } = props
    const { thousandSeparator } = props
    
    return (
        <div className="capital">
            <h2>Моя карта</h2>
            <div className="capital-img">
                <img src={ImageData[0]} />
            </div>
            <div className="capital-desc">
                <div className="capital-desc-item">
                    <h4>Общий капитал</h4>
                    <h3>{thousandSeparator((getAllInvested(invest) + getAllInvested(cash) + getAllCurrency(currency)).toFixed(2))} ₸</h3>
                </div>
                <div className="capital-desc-item" style={{marginTop: '24px'}}>
                    <h4>Пассивный доход</h4>
                    <h4>{thousandSeparator((getAllIncome(invest) + getAllIncome(cash)).toFixed(2))} ₸ / мес</h4>
                </div>
            </div>
        </div>
    );
}

export default Capital