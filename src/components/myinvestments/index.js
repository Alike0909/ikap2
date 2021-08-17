import React, { useEffect, useState } from 'react'
import { Modal } from 'antd';
import './index.css'

import AddInvestBtn from '../addInvestBtn'

function MyInvestments(props) {
    const {db, moment} = props
    const { currentUser } = props
    const {cash, invest} = props
    const {fetchCash, fetchInvest} = props
    const { makeTransaction, fetchTransaction } = props
    const { returnData, thousandSeparator, success } = props

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [title, setTitle] = useState('')
    const [payments, setPayments] = useState([])
    const [currentInvest, setCurrentInvest] = useState(0)
    const [investData, setInvestData] = useState([])
    const [flag, setFlag] = useState(false)

    const [history, setHistory] = useState({
        type: 5,
        name: `Дивиденды`,
        date: moment().format("DD-MM-YYYY hh:mm:ss"),
        amount: ``,
        sign: ``,
        converted_amount: ``,
        comment: ``,
        user: currentUser,
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

            makeTransaction({ ...history, amount: Number(investData.payments[month].income), sign: `₸`, comment: title})

            setHistory({ type: ``, name: ``, amount: ``, sign: ``, comment: `` })
            fetchTransaction()
            setInvestData([])
            fetchCash()
            fetchInvest()
            fetchPayments()
            success(`Вы получили дивиденды от ${invest[currentInvest].data.name} в размере ${investData.payments[month].income}`)
        }
    }

    const paymentItems = payments?.map((item, i) =>
        item.base ?
            <div className={item.paid ? "payment-item" : "payment-item not-paid"} key={i}>
                <div className={ i == 0 ?
                    "circle waiting"
                    :
                    payments[i - 1].paid ? "circle waiting" : "circle"
                } onClick={() => paidAction(i)}>
                    <svg style={item.paid ? {display: 'block'} : {display: 'none'}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
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
                item.data().status === "pending" ?
                    <div className="myinvestments-container-item" key={i} onClick={() => showModal(item.data(), i)}>
                        <h4 style={{ width: '25%', color: '#3F4C67' }}>{item.data().name}</h4>
                        <h4 style={{ width: '20%', color: '#F2A04F' }}>{item.data().profitability}</h4>
                        <h4 style={{ width: '30%', color: '#3F4C67' }}>{thousandSeparator(item.data().invested)} {item.data().sign}</h4>
                        <h4 style={{ width: '25%', color: '#5161D4' }}>{thousandSeparator((item.data().invested * Number(item.data().profitability.slice(0, -1)) / 1200).toFixed(2))} {item.data().sign} / мес</h4>
                    </div>
                    :
                    ''
                :
                ''
    )

    useEffect(() => {
        invest?.forEach(item =>
            item.data().user === currentUser ?
                setFlag(true)
                :
                // setFlag(flag)
                ''
        )
    }, [])

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
                {flag ? investItems : <AddInvestBtn db={db} moment={moment} currentUser={currentUser} cash={cash} fetchCash={fetchCash} fetchInvest={fetchInvest} makeTransaction={makeTransaction} fetchTransaction={fetchTransaction} returnData={returnData} thousandSeparator={thousandSeparator}></AddInvestBtn>}
            </div>
            <Modal title={title} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null} >
                <div className="payments">
                    {paymentItems}
                </div>
            </Modal>
        </div>
    );
}

export default MyInvestments