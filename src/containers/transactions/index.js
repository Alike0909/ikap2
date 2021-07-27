import React, { useEffect, useState } from 'react'
import { Select } from 'antd';
import './index.css'

function Transactions(props) {
    const { Option } = Select;
    const { db } = props
    const { transaction, fetchTransaction } = props
    const { thousandSeparator } = props
    const [types, setTypes] = useState([])

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
        <div className="transaction-container-item">
            <div className="transaction-img">
                <img src={returnType(item.data().type)} />
            </div>
            <div className="transaction-title">
                <h4>{item.data().name} в {item.data().comment}</h4>
                <p>{item.data().date}</p>
            </div>
            <div className="transaction-desc">
                <h4>{thousandSeparator(item.data().amount)} {item.data().sign}</h4>
                <p>{thousandSeparator(item.data().converted_amount)}</p>
            </div>
        </div>
    )

    useEffect(() => {
        fetchTypes()
    }, [])

    return (
        <div className="transactions">
            <h1>История транзакций</h1>
            <div className="transaction-filters">
                <Select defaultValue="Все" style={{ width: 180, color: '#3F4C67' }} onChange={handleChangeType}>
                    {typeItems}
                </Select>
                <Select defaultValue="За неделю" style={{ marginLeft: 28 ,width: 180, color: '#3F4C67' }} onChange={handleChangeDate}>
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