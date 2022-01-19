import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { Select } from 'antd';
import './index.css'

function Transactions(props) {
    const { Option } = Select;
    const { db } = props
    const { currentUser } = props
    const { transaction, fetchTransaction } = props
    const { thousandSeparator } = props
    const [types, setTypes] = useState([])

    // const Moment = require('moment')
    // const sortedTransactions = transaction.slice().sort((a, b) => new Moment(a.data().date).format("DD-MM-YYYY hh:mm:ss") - new Moment(b.data().date).format("DD-MM-YYYY hh:mm:ss"))
    // const sortedTransactions = transaction.sort(
    //     function (a, b) {
    //         if (a.data().user === currentUser && b.data().user === currentUser) {
    //             return new Date(a.data().date) - new Date(b.data().date)
    //         }
    //         else {
    //             return 0
    //         }
    //     }
    // ).reverse()

    async function fetchTypes() {
        let data = await db.collection("transaction_types").get()
        setTypes(data.docs)
    }

    function handleChangeType(value) {
        console.log(`selected ${value}`);
    }

    function handleChangeDate(value) {
        console.log(`selected ${value}`);
    }

    const typeItems = types.map((item, i) => 
        <Option key={i} value={item.data().name}>{item.data().name}</Option>
    )

    const returnType = (type) => {
        for (let i in types) {
            if (types[i].data().id == type) {
                return types[i].data().img
            }
        }
    }

    const transactionItems = transaction.map((item, i) =>
        item.data().user === currentUser ?
            <div className="transaction-container-item" key={i}>
                <div className="transaction-img">
                    <img src={returnType(item.data().type)} />
                </div>
                <div className="transaction-title">
                    <h4>{item.data().name} в {item.data().comment}</h4>
                    <p>{item.data().date}</p>
                </div>
                <div className="transaction-desc">
                    <h4>{thousandSeparator(item.data().amount)} {item.data().sign}</h4>
                    <p>{thousandSeparator(item.data().converted_amount)} {item.data().converted_sign}</p>
                </div>
            </div>
            :
            ''
    )

    useEffect(() => {
        fetchTypes()
    }, [])

    return (
        <div className="transactions">
            <h1>История транзакций</h1>
            <div className="transaction-filters">
                <Select defaultValue="Все" style={{ width: 180, color: '#3F4C67' }} onChange={handleChangeType} size="large">
                    {typeItems}
                </Select>
                <Select defaultValue="За неделю" style={{ marginLeft: 28, width: 180, color: '#3F4C67' }} onChange={handleChangeDate} size="large">
                    <Option>За день</Option>
                    <Option>За неделю</Option>
                    <Option>За месяц</Option>
                </Select>
            </div>
            <div className="transaction-container">
                {transactionItems}
            </div>
        </div>
    );
}

export default Transactions