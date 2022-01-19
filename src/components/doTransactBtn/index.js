import React, { useEffect, useState } from 'react'
import { Modal, Select, Input, Tabs } from 'antd';
import './index.css'

import CardCreateBtn from '../cardCreateButton';

function DoTransactBtn(props) {
    const { db, moment } = props
    const { cash, currency, card } = props
    const { currentUser } = props
    const { fetchCash, fetchCurrency, fetchCard } = props
    const { makeTransaction, fetchTransaction } = props
    const { returnData, convert, thousandSeparator, success } = props

    const { TabPane } = Tabs;
    const { Option } = Select;

    const [history, setHistory] = useState({
        type: 2,
        name: `Конвертация`,
        date: moment().format("DD-MM-YYYY hh:mm:ss"),
        amount: ``,
        sign: ``,
        converted_amount: ``,
        converted_sign: ``,
        comment: ``,
        user: currentUser,
    })

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentTab, setCurrentTab] = useState(1)
    const [amount, setAmount] = useState()
    const [warning, setWarning] = useState(``)
    const [currentCurrencyFrom, setCurrentCurrencyFrom] = useState(returnData(0))
    const [currentCurrencyTo, setCurrentCurrencyTo] = useState(returnData(1))
    const [number, setNumber] = useState()

    const showModal = () => {
        setIsModalVisible(true);
    }

    function callback(key) {
        setCurrentTab(key)
        setAmount()
    }

    const handleOk = () => {
        if (currentTab == 1) {
            if (amount > 0) {
                if (warning == null || warning == ``) {
                    db.collection(currentCurrencyFrom.name).doc(currentCurrencyFrom.id).update({
                        "invested": Number(currentCurrencyFrom.data.invested) - Number(amount),
                    })
                    .then(() => {
                        console.log("Document FROM successfully updated!");
                    })

                    db.collection(currentCurrencyTo.name).doc(currentCurrencyTo.id).update({
                        "invested": Number(currentCurrencyTo.data.invested) + (amount * convert(currentCurrencyFrom?.data.value, currentCurrencyTo?.data.value).toFixed(6)),
                    })
                    .then(() => {
                        console.log("Document TO successfully updated!");
                    })

                    makeTransaction({ ...history, amount: amount, converted_amount: amount * convert(currentCurrencyFrom?.data.value, currentCurrencyTo?.data.value).toFixed(6), sign: currentCurrencyFrom?.data.sign, converted_sign: currentCurrencyTo?.data.sign, comment: `${currentCurrencyFrom.data.name} -> ${currentCurrencyTo.data.name}` })
                    setIsModalVisible(false);
                    setHistory({ amount: ``, converted_amount: ``, sign: ``, converted_sign: ``, comment: ``})
                    fetchTransaction()
                    fetchCash()
                    fetchCurrency()
                    success(`Конвертация с ${currentCurrencyFrom.data.name} в ${currentCurrencyTo.data.name} на сумму ${amount} ${currentCurrencyFrom.data.sign}`)
                }
            }
        }
        else {
            if (amount > 0) {
                db.collection(returnData(0).name).doc(returnData(0).id).update({
                    "invested": Number(returnData(0).data.invested) - Number(amount),
                })
                .then(() => {
                    console.log("Document FROM successfully updated!");
                })

                db.collection("cash").doc(beneficiaryCard.cash).update({
                    "invested": Number(returnNeededData(beneficiaryCard.cash).data.invested) + Number(amount),
                })
                .then(() => {
                    console.log("Document FROM successfully updated!");
                })

                makeTransaction({ type: 4, name: 'Перевод', date: moment().format("DD-MM-YYYY hh:mm:ss"), amount: Number(amount), sign: '₸', comment: `${beneficiaryCard.name} ${beneficiaryCard.surname}`, converted_amount: ``, user: currentUser })
                makeTransaction({ type: 3, name: 'Поступление', date: moment().format("DD-MM-YYYY hh:mm:ss"), amount: Number(amount), sign: '₸', comment: `${currentCard.name} ${currentCard.surname}`, converted_amount: ``, user: beneficiaryCard.user })
                setIsModalVisible(false);
                fetchTransaction()
                fetchCash()
                success(`Перевод в ${beneficiaryCard.name} ${beneficiaryCard.surname} на сумму ${amount} ₸`)
            }
        }
    }

    const handleCancel = () => {
        setAmount()
        setWarning(``)
        setIsModalVisible(false);
    }

    const handleChangeFrom = (value) => {
        setCurrentCurrencyFrom(returnData(value))
        setAmount()
        setWarning(``)
    }

    const handleChangeTo = (value) => {
        setCurrentCurrencyTo(returnData(value))
        setAmount()
        setWarning(``)
    }

    const handleChangeAmount = (event) => {
        if (event.target.value <= currentCurrencyFrom.data.invested) {
            setAmount(event.target.value)
            setWarning(``)
        } else {
            setWarning(`Недостаточно средств! Доступно: ${thousandSeparator(currentCurrencyFrom.data.invested)} ${currentCurrencyFrom.data.sign}`)
        }
    }

    const onChange = (event) => {
        if ((event.target.value).length < 21) {
            setNumber(handlingCardNumber(event.target.value))
            searchCard((event.target.value).replace(/ /g, ''))
        }
    }

    const cashOptions = cash.map((item, i) =>
        item.data().user === currentUser ?
            <Option amount={item.data().invested} sign={item.data().sign} value={item.data().value} key={item.data().value}>{item.data().name} ({item.data().sign})</Option>
            :
            ''
    )

    const currencyOptions = currency.map((item, i) =>
        item.data().user === currentUser ?
            <Option amount={item.data().invested} sign={item.data().sign} value={item.data().value} key={item.data().value}>{item.data().name} ({item.data().sign})</Option>
            :
            ''
    )

    const [currentCard, setCurrentCard] = useState()
    const [beneficiaryCard, setBeneficiaryCard] = useState()

    const getCard = () => {
        card?.forEach(item =>
            item.data().user === currentUser ?
                setCurrentCard(item.data())
                :
                ''
        )
    }

    const searchCard = (number) => {
        card?.forEach(item =>
            item.data().number === number ?
                setBeneficiaryCard(item.data())
                :
                ''
        )
    }

    const returnNeededData = (doc) => {
        for (let i in cash) {
            if (cash[i].id == doc) {
                if (cash[i].data().value == 0) {
                    return { id: cash[i].id, data: cash[i].data(), name: 'cash' }
                }
            }
        }
    }

    function cardFormat(s) {
        return s?.toString().replace(/\d{4}(?=.)/g, '$& ');
    }

    function handlingCardNumber(number) {
        return number.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim()
    }

    useEffect(() => {
        getCard()
    }, [])

    return (
        <>
            <button className="do-transact" onClick={() => showModal()}>Совершить Перевод</button>
            <Modal visible={isModalVisible} onCancel={handleCancel} footer={null} width={440}>
                <div className="do-transact-container">
                    <Tabs onChange={callback} type="card">
                        <TabPane tab="Конвертация" key="1">
                            <div className="do-convert-container">
                                <div className="do-convert-container-item">
                                    <h4>Откуда</h4>
                                    <Select defaultValue="Тенге (₸)" style={{ width: 120, color: '#3F4C67' }} onChange={handleChangeFrom}>
                                        {cashOptions}
                                        {currencyOptions}
                                    </Select>
                                </div>
                                <div className="round">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-arrow-left-right" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z" />
                                    </svg>
                                </div>
                                <div className="do-convert-container-item">
                                    <h4>Куда</h4>
                                    <Select defaultValue="Доллар ($)" style={{ width: 120, color: '#3F4C67' }} onChange={handleChangeTo}>
                                        {cashOptions}
                                        {currencyOptions}
                                    </Select>
                                </div>
                            </div>
                            <div className="cash-amount">
                                <h4>Сумма</h4>
                                <div className="cash-amount-input">
                                    <Input value={amount} onChange={handleChangeAmount} style={{ width: '100%' }} />
                                </div>
                                <div className="cash-amount-warning">
                                    {warning}
                                </div>
                            </div>
                            <div className="convert-info">
                                <div className="convert-info-item">
                                    <h4>По курсу: </h4>
                                    <span>
                                        1 {currentCurrencyFrom?.data.sign} ≈&nbsp;
                                        {convert(currentCurrencyFrom?.data.value, currentCurrencyTo?.data.value).toFixed(6)} {currentCurrencyTo?.data.sign}
                                    </span>
                                </div>
                                <div className="convert-info-item" style={{marginTop: '12px'}}>
                                    <h4>Получите: </h4>
                                    <span>
                                        {amount * convert(currentCurrencyFrom?.data.value, currentCurrencyTo?.data.value).toFixed(6)} {currentCurrencyTo?.data.sign}
                                    </span>
                                </div>
                            </div>
                            <div className="cash-buttons">
                                <button onClick={handleOk}>Выполнить</button>
                                <button onClick={handleCancel}>Отменить</button>
                            </div>
                        </TabPane>
                        <TabPane tab="Перевод другому" key="2">
                            {currentCard ?
                                <div className="transact-to-another-container">
                                    <div className="transact-to-another-container-item">
                                        <h4>Откуда</h4>
                                        <Select defaultValue="Выберите счет" style={{ width: '100%', color: '#3F4C67' }}>
                                            <Option>Счет в Тенге: {thousandSeparator(returnData(0)?.data.invested) + returnData(0)?.data.sign}</Option>
                                        </Select>
                                    </div>
                                    <div className="transact-to-another-container-item" style={{marginTop: '24px'}}>
                                        <h4>Куда</h4>
                                        <Input value={number} name="number" onChange={onChange} placeholder="card number" />
                                        <Input value={beneficiaryCard?.name + ' ' + beneficiaryCard?.surname} name="name" placeholder="card owner" disabled style={{ marginTop: '12px' }}/>
                                    </div>
                                    <div className="cash-amount">
                                        <h4>Сумма</h4>
                                        <div className="cash-amount-input">
                                            <Input value={amount} onChange={handleChangeAmount} style={{ width: '100%' }} />
                                        </div>
                                        <div className="cash-amount-warning">
                                            {warning}
                                        </div>
                                    </div>
                                    <div className="cash-buttons">
                                        <button onClick={handleOk}>Выполнить</button>
                                        <button onClick={handleCancel}>Отменить</button>
                                    </div>
                                </div>
                                :
                                <span style={{ display: 'flex' }}>Сначала&nbsp; <CardCreateBtn db={db} moment={moment} currentUser={currentUser} cash={cash} card={card} fetchCard={fetchCard} cardFormat={cardFormat} returnData={returnData} thousandSeparator={thousandSeparator} success={success}></CardCreateBtn>...</span>
                            }
                        </TabPane>
                    </Tabs>
                </div>
            </Modal>
        </>
    );
}

export default DoTransactBtn