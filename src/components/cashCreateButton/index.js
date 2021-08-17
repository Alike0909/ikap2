import React, { useEffect, useState } from 'react'
import { Modal, Select, Input } from 'antd';
import './index.css'

function CashCreateButton(props) {
    const { db } = props
    const { currentUser } = props
    const { fetchCash, success } = props

    const [post, setPost] = useState({
        name: `Тенге`,
        type: `депозит`,
        term: ``,
        profitability: `9%`,
        invested: 100000,
        sign: '₸',
        value: 0,
        user: currentUser,
    })

    const handleOk = () => {
        db.collection("cash").add({
            ...post
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });

        fetchCash()
        success(`Вы добавили свою первую наличность!`)
    }

    return (
        <>
            <div className="cash-create-btn" onClick={handleOk}>
                <p>Добавить наличность</p>
            </div>
        </>
    );
}

export default CashCreateButton