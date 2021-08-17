import React, { useEffect, useState } from 'react'
import './index.css'

import CurrencyCreateButton from '../currencyCreateButton'

function MyCurrency(props) {
    const { db } = props
    const { currentUser } = props
    const { currency, fetchCurrency } = props
    const { convert } = props
    const { returnData, thousandSeparator, success } = props
    const [flag, setFlag] = useState(false)

    const currencyItems = currency.map((item, i) => 
        item.data().user === currentUser ?
            item.data().priority ?
                <div className="mycurrency-container-item" key={i}>
                    <div className="item-icon" >{item.data().sign}</div>
                    <p style={{ minWidth: '15%' }}>{item.data().name}</p>
                    <p style={{ minWidth: '20%' }}>{item.data().type}</p>
                    <p style={{ color: '#F2C94F', minWidth: '20%' }}>{thousandSeparator(item.data().invested.toFixed(2))} {item.data().sign}</p>
                    <p style={{ color: '#5161D4', minWidth: '25%' }}>{thousandSeparator((item.data().invested * convert(item.data().value, 0)).toFixed(2))} ₸</p>
                </div>
                :
                ''
            :
            ''
    )

    useEffect(() => {
        currency?.forEach(item =>
            item.data().user === currentUser ?
                setFlag(true)
                :
                // setFlag(flag)
                ''
        )
    }, [])

    return (
        <div className="mycurrency">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>Мои Валюты</h2>
                <CurrencyCreateButton db={db} currentUser={currentUser} currency={currency} fetchCurrency={fetchCurrency} index={1} view={'shorten'} returnData={returnData} success={success}></CurrencyCreateButton>
            </div>
            {flag ? currencyItems : <CurrencyCreateButton db={db} currentUser={currentUser} currency={currency} fetchCurrency={fetchCurrency} index={-1} returnData={returnData} success={success}></CurrencyCreateButton>}
        </div>
    );
}

export default MyCurrency