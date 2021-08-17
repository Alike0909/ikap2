import React, { useEffect, useState } from 'react'
import { PieChart } from 'react-minimal-pie-chart';
import './index.css'

import CashButton from '../cashButton'
import CashCreateButton from '../cashCreateButton';

function Cash(props) {
    const {db, moment} = props
    const { currentUser } = props
    const { cash, currency, invest, getAllInvested } = props
    const { fetchCash, fetchCurrency } = props
    const { makeTransaction, fetchTransaction } = props
    const { convert, returnData, thousandSeparator, success } = props
    const [types, setTypes] = useState([])

    async function fetchTypes() {
        let data = await db.collection("currency_types").get()
        setTypes(data.docs)
    }
    
    const matchType = (obj) => {
        for (let i in types) {
            if (types[i].data().value == obj) {
                return types[i].data().color
            }
        }
    }

    const data = []
    for (let i in cash) {
        if (cash[i].data().user == currentUser){
            data.push({ title: cash[i].data().name, value: cash[i].data().invested, color: '#41E24B', invested: `${(cash[i].data().invested).toFixed(2)} ${cash[i].data().sign}`})
        }
    }

    for (let i in currency) {
        if (currency[i].data().user == currentUser) {
            data.push({ title: currency[i].data().name, value: currency[i].data().invested * convert(currency[i].data().value, 0), color: matchType(currency[i].data().value), invested: `${(currency[i].data().invested).toFixed(2)} ${currency[i].data().sign}` })
        }
    }

    data.push({ title: 'Инвестировано', value: getAllInvested(invest), color: '#5161D4', invested: `${getAllInvested(invest)} ₸` })

    const dataItems = data.map((item, i) => 
        <div className="cash-title-item" key={i}>
            <div className="circle" style={{ background: item.color }}></div>
            <div className="cash-title-item-desc">
                <h4 style={{ marginBottom: '6px' }}>{item.title}</h4>
                <h4 style={{ color: '#3F4C67' }}>{item.invested}</h4>
            </div>
        </div>
    )

    useEffect(() => {
        fetchTypes()
    }, [])

    return (
        <div className="cash">
            <h2>Собственные средства</h2>
            {data.length != 1 ?
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
                :
                <div className="cash-container">
                    <PieChart
                        data={[
                            { title: '', value: 360, color: '#5161D4' },
                            { title: '', value: 240, color: '#F5A623' },
                            { title: '', value: 60, color: '#F6C156' },
                        ]}
                        style={{ width: '200px', height: '200px', marginRight: '48px', opacity: '0.4' }}
                        lineWidth={42}
                    />
                    <CashCreateButton db={db} currentUser={currentUser} fetchCash={fetchCash} success={success}></CashCreateButton>
                </div>
            }
            {data.length != 1 ?
                <CashButton db={db} moment={moment} currentUser={currentUser} cash={cash} fetchCash={fetchCash} currency={currency} fetchCurrency={fetchCurrency} makeTransaction={makeTransaction} fetchTransaction={fetchTransaction} returnData={returnData} thousandSeparator={thousandSeparator} success={success}></CashButton>
                :
                ''
            }
        </div>
    );
}

export default Cash