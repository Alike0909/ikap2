import React, { useEffect, useState } from 'react'
import './index.css'

function MyTransaction(props) {

    return (
        <div className="mytransaction">
            <h2>Мои транзакции</h2>
            <button className="add-invest">Добавить Инвестицию</button>
            <button className="do-mytransaction">Совершить перевод</button>
        </div>
    );
}

export default MyTransaction