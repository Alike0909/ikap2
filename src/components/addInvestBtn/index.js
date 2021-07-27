import React, { useEffect, useState } from 'react'
import { Modal, Select, Input } from 'antd';
import './index.css'

function AddInvestBtn(props) {
    const { db, moment } = props
    const { cash } = props
    const { fetchCash, fetchInvest } = props
    const { makeTransaction, fetchTransaction } = props
    const { thousandSeparator } = props

    const [post, setPost] = useState({
        name: ``, 
        type: ``, 
        term: ``, 
        profitability: ``, 
        providing: ``, 
        additionals: ``, 
        invested: ``, 
        sign: '₸', 
        payments: [] 
    })

    const [history, setHistory] = useState({
        type: 1,
        name: `Инвестиции`,
        date: moment().format("DD-MM-YYYY hh:mm:ss"),
        amount: ``,
        sign: ``,
        converted_amount: ``,
    })

    const [warning, setWarning] = useState(``)

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    }

    const handleOk = () => {
        if (warning == null || warning == ``) {
            const tempPayments = []
            for (let i = 0; i <= post.term; i++) {
                if (i != post.term) {
                    tempPayments[i] = { income: Number(post.invested) * Number(post.profitability.slice(0, -1)) / 1200, paid: false }
                } else {
                    tempPayments[i] = { base: post.invested, paid: false }
                }
            }

            db.collection("investments").add({
                ...post,
                payments: tempPayments
            })
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });

            db.collection("cash").doc("dLewcZ1LeHAqLzGeyc08").update({
                "invested": Number(cash[0].data().invested) - Number(post.invested),
            })
            .then(() => {
                console.log("Document FROM successfully updated!");
            });

            makeTransaction({ ...history, amount: post.invested, sign: post.sign })

            setIsModalVisible(false);
            setPost({ name: ``, type: ``, term: ``, profitability: ``, providing: ``, additionals: ``, invested: 0, sign: '₸', payments: [] })
            setHistory({ amount: ``, sign: ``})
            fetchTransaction()
            fetchCash()
            fetchInvest()
        } 
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    }

    const onChange = (event) => {
        if (event.target.name == "invested") {
            if (Number(event.target.value) <= Number(cash[0]?.data().invested)) {
                setPost(prev => ({
                    ...prev,
                    [event.target.name]: Number(event.target.value)
                }))
                setWarning(``)
            } else {
                setWarning(`Недостаточно средств! Доступно: ${thousandSeparator(cash[0]?.data().invested)} ${cash[0]?.data().sign}`)
            }
        } else {
            setPost(prev => ({
                ...prev,
                [event.target.name]: event.target.value
            }))
        }
    }

    return (
        <>
            <button className="add-invest" onClick={() => showModal()}>Добавить Инвестицию</button>
            <Modal title="Добавить Инвестиционный проект" visible={isModalVisible} onCancel={handleCancel} footer={null}>
                <div className="add-invest-container">
                    <Input value={post.name} name="name" onChange={onChange} placeholder="Имя проекта"/>
                    <Input value={post.type} name="type" onChange={onChange} placeholder="Инструмент"/>
                    <Input value={post.term} name="term" onChange={onChange} placeholder="Срок"/>
                    <Input value={post.profitability} name="profitability" onChange={onChange} placeholder="Ставка"/>
                    <Input value={post.providing} name="providing" onChange={onChange} placeholder="Обеспечение"/>
                    <Input value={post.additionals} name="additionals" onChange={onChange} placeholder="Доп. условия"/>
                    <Input value={post.invested} name="invested" onChange={onChange} placeholder="Сумма"/>
                    <div className="cash-amount-warning">
                        {warning}
                    </div>
                    <div className="cash-buttons">
                        <button onClick={handleOk}>Выполнить</button>
                        <button onClick={handleCancel}>Отменить</button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default AddInvestBtn