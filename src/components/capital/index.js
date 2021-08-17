import React, { useEffect, useState } from 'react'
import './index.css'

import ImageData from '../../images'
import CardCreateBtn from '../cardCreateButton'

function Capital(props) {
    const { db, moment } = props
    const { cash, invest, currency, card } = props
    const { fetchCard } = props
    const { getAllInvested, getAllCurrency, getAllIncome } = props
    const { returnData, thousandSeparator, currentUser, success } = props

    const [currentCard, setCurrentCard] = useState()

    const getCard = () => {
        card?.forEach(item => 
            item.data().user === currentUser ?
            setCurrentCard(item.data())
            :
            ''
        )
    }

    function cardFormat(s) {
        return s?.toString().replace(/\d{4}(?=.)/g, '$& ');
    }

    useEffect(() => {
        getCard()
    }, [])

    return (
        <div className="capital">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>Моя карта</h2>
                <CardCreateBtn db={db} moment={moment} currentUser={currentUser} currentCard={currentCard} cash={cash} card={card} fetchCard={fetchCard} view={"shorten"} cardFormat={cardFormat} returnData={returnData} thousandSeparator={thousandSeparator} success={success}></CardCreateBtn>
            </div>
            <div className="capital-img">
                <img src={ImageData[0]} />
                { currentCard?
                    <span>{cardFormat(currentCard?.number)}</span>
                    :
                    <span>XXXX XXXX XXXX XXXX</span>
                }
                { currentCard?
                    <sub>{currentCard?.cvv}</sub>
                    :
                    <sub>XXX</sub>
                }
            </div>
            <div className="capital-desc">
                <div className="capital-desc-item">
                    <h4>Общий капитал</h4>
                    <h3>{thousandSeparator((getAllInvested(invest) + getAllInvested(cash) + getAllCurrency(currency)).toFixed(2))} ₸</h3>
                </div>
                <div className="capital-desc-item" style={{marginTop: '24px'}}>
                    <h4>Пассивный доход</h4>
                    <h4>{thousandSeparator((getAllIncome(invest) + getAllIncome(cash)).toFixed(2))} ₸ / мес</h4>
                </div>
            </div>
        </div>
    );
}

export default Capital