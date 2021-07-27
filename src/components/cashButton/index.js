import React, { useEffect, useState } from 'react'
import { Modal, Select, Input } from 'antd';
import './index.css'

function CashButton(props) {
    const {db, moment} = props
    const {cash, currency} = props
    const {fetchCash, fetchCurrency} = props
    const { makeTransaction, fetchTransaction } = props
    const {returnData, thousandSeparator} = props

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [operation, setOperation] = useState(true)
    const [amount, setAmount] = useState()
    const [warning, setWarning] = useState(``)
    const [comment, setComment] = useState(``)
    const [currentCurrency, setCurrentCurrency] = useState(returnData(0))
    const { Option } = Select;

    const [history, setHistory] = useState({
        type: ``,
        name: ``,
        date: moment().format("DD-MM-YYYY hh:mm:ss"),
        amount: ``,
        sign: ``,
        converted_amount: ``,
        comment: ``,
    })

    const showModal = () => {
        setIsModalVisible(true);
    }

    const handleOk = () => {
        if (warning == null || warning == ``) {
            operation ?
            db.collection(currentCurrency.name).doc(currentCurrency.id).update({
                "invested": Number(currentCurrency.data.invested) + Number(amount),
            })
            .then(() => {
                console.log("Document TO successfully updated!");
            })
            :
            db.collection(currentCurrency.name).doc(currentCurrency.id).update({
                "invested": Number(currentCurrency.data.invested) - Number(amount),
            })
            .then(() => {
                console.log("Document FROM successfully updated!");
            })

            operation ?
            makeTransaction({ ...history, type: 3, name: 'Пополнение', amount: Number(amount), sign: currentCurrency.data.sign, comment: currentCurrency.data.name })
            :
            makeTransaction({ ...history, type: 4, name: 'Снятие', amount: Number(amount), sign: currentCurrency.data.sign, comment: currentCurrency.data.name })

            setIsModalVisible(false)
            setHistory({ type: ``, name: ``, amount: ``, sign: ``, comment: `` })
            fetchTransaction()
            fetchCash()
            fetchCurrency()
        }
    }

    const handleCancel = () => {
        setAmount()
        setWarning(``)
        setComment(``)
        setIsModalVisible(false);
    }

    const handleChangeAmount = (event) => {
        if (operation == true) {
            setAmount(event.target.value)
            setWarning(``)
        } else {
            if (event.target.value <= currentCurrency.data.invested) {
                setAmount(event.target.value)
                setWarning(``)
            } else {
                setWarning(`Недостаточно средств! Доступно: ${thousandSeparator(currentCurrency.data.invested)} ${currentCurrency.data.sign}`)
            }
        }
    }

    const handleChangeCurrency = (value) => {
        setCurrentCurrency(returnData(value))
        setAmount()
        setWarning(``)
    }

    const handleChangeComment = (event) => {
        setComment(event.target.value)
    }

    const onCheck = () => {
        setOperation(!operation)
        setAmount()
    }
 
    const cashOptions = cash.map((item, i) =>
        <Option amount={item.data().invested} sign={item.data().sign} value={item.data().value} key={item.data().value}>{item.data().name} ({item.data().sign})</Option>
    )

    const currencyOptions = currency.map((item, i) =>
        <Option amount={item.data().invested} sign={item.data().sign} value={item.data().value} key={item.data().value}>{item.data().name} ({item.data().sign})</Option>
    )

    return (
        <>
            <button className="cash-btn" onClick={() => showModal()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                    <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
                </svg>
            </button>
            <Modal title="Добавить/Снять из Свободных средств" visible={isModalVisible} onCancel={handleCancel} footer={null} width={440}>
                <div className="cash-amount">
                    <h4>Сумма</h4>
                    <div className="cash-amount-input">
                        <Input value={amount} onChange={handleChangeAmount} style={{width: '180px'}}/>
                        <Select defaultValue="Тенге (₸)" style={{ width: 120, marginLeft: '12px', border: '1px solid #5161D4', borderRadius: '2px', color: '#3F4C67' }} onChange={handleChangeCurrency}>
                            {cashOptions}
                            {currencyOptions}
                        </Select>
                    </div>
                    <div className="cash-amount-warning">
                        {warning}
                    </div>
                </div>
                <div className="cash-operation">
                    <h4>Какую операцию вы хотите совершить?</h4>
                    <div className="cash-operation-checkbox">
                        <div className="cash-operation-checkbox-item" onClick={onCheck}>
                            <div className="round-checkbox" style={operation ? { background: '#5161D4' } : { background: 'transparent' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-check2" viewBox="0 0 16 16">
                                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                </svg>
                            </div>
                            <h4 style={operation ? { color: '#5161D4' } : { color: '#3F4C67' }}>Вложить</h4>
                        </div>
                        <div className="cash-operation-checkbox-item" onClick={onCheck}>
                            <div className="round-checkbox" style={operation ? { background: 'transparent' } : { background: '#5161D4' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-check2" viewBox="0 0 16 16">
                                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                </svg>
                            </div>
                            <h4 style={operation ? { color: '#3F4C67' } : { color: '#5161D4' }}>Снять</h4>
                        </div>
                    </div>
                </div>
                <div className="cash-comment">
                    <h4>Комментарий</h4>
                    <Input value={comment} onChange={handleChangeComment} style={{ width: '312px' }} />
                </div>
                <div className="cash-buttons">
                    <button onClick={handleOk}>Выполнить</button>
                    <button onClick={handleCancel}>Отменить</button>
                </div>
            </Modal>
        </>
    );
}

export default CashButton