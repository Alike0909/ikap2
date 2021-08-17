import React, { useEffect, useState } from 'react'
import { Select, Input, Modal  } from 'antd';
import './index.css'

import AddInvestBtn from '../../components/addInvestBtn'

function Investments(props) {
    const { Option } = Select;
    const { Search } = Input;

    const { db, moment } = props
    const { currentUser } = props
    const { cash, invest } = props
    const { fetchCash, fetchInvest } = props
    const { makeTransaction, fetchTransaction } = props
    const { returnData, thousandSeparator } = props

    const handleChangeType = () => {

    }

    const onSearch = value => console.log(value);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [title, setTitle] = useState('')
    const [payments, setPayments] = useState([])
    const [currentInvest, setCurrentInvest] = useState(0)
    const [investData, setInvestData] = useState([])

    const [history, setHistory] = useState({
        type: 5,
        name: `Дивиденды`,
        date: moment().format("DD-MM-YYYY hh:mm:ss"),
        amount: ``,
        sign: ``,
        converted_amount: ``,
        comment: ``,
    })

    const fetchPayments = () => {
        setPayments(investData.payments)
    }

    const showModal = (data, id) => {
        setCurrentInvest(id)
        setTitle(data.name)
        setPayments(data.payments)
        setInvestData(invest[id]?.data())
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const paidAction = (month) => {
        if (investData.payments[month].paid == false) {
            investData.payments[month].paid = true
            db.collection("investments").doc(invest[currentInvest].id).update({
                "payments": investData.payments
            })
                .then(() => {
                    console.log("Document FROM successfully updated!");
                })

            investData.payments[month].income ?
                db.collection("cash").doc(returnData(0).id).update({
                    "invested": Number(returnData(0).data.invested) + Number(investData.payments[month].income),
                })
                    .then(() => {
                        console.log("Document successfully updated!");
                    })
                :
                db.collection("cash").doc(returnData(0).id).update({
                    "invested": Number(returnData(0).data.invested) + Number(investData.payments[month].base),
                })
                    .then(() => {
                        console.log("Document successfully updated!");
                    })

            investData.payments[month].base ?
                db.collection("investments").doc(invest[currentInvest].id).update({
                    "status": "finished"
                })
                    .then(() => {
                        console.log("Document FROM successfully updated!");
                    })
                :
                console.log("not finished")

            makeTransaction({ ...history, amount: Number(investData.payments[month].income), sign: `₸`, comment: title })

            setHistory({ type: ``, name: ``, amount: ``, sign: ``, comment: `` })
            fetchTransaction()
            setInvestData([])
            fetchCash()
            fetchInvest()
            fetchPayments()
        }
    }

    const paymentItems = payments?.map((item, i) =>
        item.base ?
            <div className={item.paid ? "payment-item" : "payment-item not-paid"} key={i}>
                <div className={i == 0 ?
                    "circle waiting"
                    :
                    payments[i - 1].paid ? "circle waiting" : "circle"
                } onClick={() => paidAction(i)}>
                    <svg style={item.paid ? { display: 'block' } : { display: 'none' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                    </svg>
                </div>
                <p style={{ width: '35%' }}>Основной долг</p>
                <p style={{ width: '30%' }}>{thousandSeparator((item.base).toFixed(0))} ₸</p>
                {item.paid ?
                    <p style={{ color: '#F2A04F' }}>Получено</p>
                    :
                    ''
                }
            </div>
            :
            <div className={item.paid ? "payment-item" : "payment-item not-paid"} key={i}>
                <div className={i == 0 ?
                    "circle waiting"
                    :
                    payments[i - 1].paid ? "circle waiting" : "circle"
                } onClick={() => paidAction(i)}>
                    <svg style={item.paid ? { display: 'block' } : { display: 'none' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                    </svg>
                </div>
                <p style={{ width: '35%' }}>{i + 1} месяц</p>
                <p style={{ width: '30%' }}>{thousandSeparator((item.income).toFixed(0))} ₸</p>
                {item.paid ?
                    <p style={{ color: '#F2A04F' }}>Получено</p>
                    :
                    ''
                }
            </div>
    )

    const investItems = invest.map((item, i) =>
        item.data().user === currentUser ?
            <div className={item.data().status === "pending" ? "investment-container-item" : "investment-container-item finished"} key={i}>
                <h4 style={{ width: '20%', color: '#3F4C67' }}>{item.data().name}</h4>
                <h4 style={{ width: '10%', color: '#3F4C67' }}>{item.data().type}</h4>
                <h4 style={{ width: '10%', color: '#3F4C67' }}>{item.data().term}</h4>
                <h4 style={{ width: '10%', color: '#F2A04F' }}>{item.data().profitability}</h4>
                <h4 style={{ width: '20%', color: '#3F4C67' }}>{thousandSeparator(item.data().invested)} {item.data().sign}</h4>
                <h4 style={{ width: '20%', color: '#5161D4' }}>{thousandSeparator((item.data().invested * Number(item.data().profitability.slice(0, -1)) / 1200).toFixed(2))} {item.data().sign} / мес</h4>
                <h4 style={{ width: '10%', color: '#5161D4' }} onClick={() => showModal(item.data(), i)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 16C4.89543 16 4 15.1046 4 14C4 12.8954 4.89543 12 6 12C7.10457 12 8 12.8954 8 14C8 14.5304 7.78929 15.0391 7.41421 15.4142C7.03914 15.7893 6.53043 16 6 16ZM12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14ZM18 12C16.8954 12 16 11.1046 16 10C16 8.89543 16.8954 8 18 8C19.1046 8 20 8.89543 20 10C20 10.5304 19.7893 11.0391 19.4142 11.4142C19.0391 11.7893 18.5304 12 18 12Z" fill="#2E3A59" />
                    </svg>
                </h4>
            </div>
            :
            ''
    )

    return (
        <div className="investments">
            <h1>Инвестиции</h1>
            <div className="investment-filters">
                <div style={{display: 'flex'}}>
                    <Select defaultValue="Все категории" style={{ width: 180, color: '#3F4C67' }} onChange={handleChangeType} size="large">
                        <Option>Все категории</Option>
                    </Select>
                    <Search placeholder="Поиск" onSearch={onSearch} style={{ width: 360, color: '#3F4C67' }} enterButton size="large" allowClear/>
                </div>
                <AddInvestBtn db={db} moment={moment} currentUser={currentUser} cash={cash} fetchCash={fetchCash} fetchInvest={fetchInvest} makeTransaction={makeTransaction} fetchTransaction={fetchTransaction} returnData={returnData} thousandSeparator={thousandSeparator}></AddInvestBtn>
            </div>
            <div className="investment-container">
                <div className="investment-container-title">
                    <h4 style={{ width: '20%', textAlign: 'left' }}>Наименование</h4>
                    <h4 style={{ width: '10%', textAlign: 'left' }}>Инструмент</h4>
                    <h4 style={{ width: '10%', textAlign: 'left' }}>Срок</h4>
                    <h4 style={{ width: '10%', textAlign: 'left' }}>Процент</h4>
                    <h4 style={{ width: '20%', textAlign: 'left' }}>Сумма</h4>
                    <h4 style={{ width: '20%', textAlign: 'left' }}>Прибыль</h4>
                    <h4 style={{ width: '10%', textAlign: 'left' }}></h4>
                </div>
                {investItems}
            </div>
            <Modal title={title} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null} >
                <div className="payments">
                    {paymentItems}
                </div>
            </Modal>
        </div>
    );
}

export default Investments