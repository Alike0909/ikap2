import React, { useEffect, useState } from 'react'
import { Modal, Select, Input } from 'antd';
import './index.css'

function CardCreateBtn(props) {
    const { db, moment } = props
    const { cash, card } = props
    const { fetchCard } = props
    const { currentUser, currentCard } = props
    const { view } = props
    const { returnData, thousandSeparator, success, cardFormat } = props
    const { Option } = Select;

    const [post, setPost] = useState({
        name: ``,
        surname: ``,
        number: `55122134XXXX XXXX`,
        cvv: ``,
        cash: returnData(0)?.id,
        user: currentUser,
    })

    const [history, setHistory] = useState({
        type: 2,
        name: `Конвертация`,
        date: moment().format("DD-MM-YYYY hh:mm:ss"),
        amount: ``,
        sign: ``,
        converted_amount: ``,
        user: currentUser,
    })

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    }

    const handleOk = () => {
        db.collection("card").add({
            ...post,
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        })

        setPost({ name: ``, surname: ``, cardNum: `55122134XXXX XXXX`, cvv: ``})
        fetchCard()
        success(`Вы открыли новую карту!`)
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    }

    const onChange = (event) => {
        setPost(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }

    const generateNum = () => {
        let temp = betweenRandomNumber(10000000, 99999999)
        card?.forEach(item =>
            item.data().number == temp ?
            setPost(prev => ({
                ...prev,
                number: betweenRandomNumber(10000000, 99999999)
            }))
            :
            setPost(prev => ({
                ...prev,
                number: temp
            }))
        )
    }

    function betweenRandomNumber(min, max) {
        const temp = Math.floor(
            Math.random() * (max - min + 1) + min
        )

        return '55122134' + temp
    }

    return (
        <>
            <button className="do-transact" onClick={() => showModal()} style={view ? {display: 'none'} : {display: 'flex'}}>откройте карту</button>
            <button onClick={showModal} style={view ? { width: 'fit-content', height: 'fit-content', border: 'none', background: 'transparent' } : { display: 'none' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 16C4.89543 16 4 15.1046 4 14C4 12.8954 4.89543 12 6 12C7.10457 12 8 12.8954 8 14C8 14.5304 7.78929 15.0391 7.41421 15.4142C7.03914 15.7893 6.53043 16 6 16ZM12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14ZM18 12C16.8954 12 16 11.1046 16 10C16 8.89543 16.8954 8 18 8C19.1046 8 20 8.89543 20 10C20 10.5304 19.7893 11.0391 19.4142 11.4142C19.0391 11.7893 18.5304 12 18 12Z" fill="#2E3A59" />
                </svg>
            </button>
            <Modal title="Открыть карту" visible={isModalVisible} onCancel={handleCancel} footer={null} width={440}>
                {
                    currentCard?
                    <div className="card-create-container">
                        <div className="card-create-container-item">
                            <Input value={cardFormat(currentCard.number)} name="cardNum" disabled />
                        </div>
                        <div className="card-create-container-item">
                            <Input value={currentCard.name} name="name" placeholder="Name" style={{ width: '30%' }} disabled/>
                            <Input value={currentCard.surname} name="surname" placeholder="Surname" style={{ width: '50%' }} disabled/>
                            <Input value={currentCard.cvv} name="cvv" placeholder="CVV" style={{ width: '20%' }} disabled/>
                        </div>
                        <div className="card-create-container-item">
                            <Input value={`Счет в Тенге: ` + thousandSeparator(returnData(0)?.data.invested) + returnData(0)?.data.sign} name="cvv" placeholder="CVV" disabled />
                        </div>
                        <div className="card-create-container-item">
                            <button onClick={handleCancel} style={{ borderRadius: '5px', width: '100%' }}>Отменить</button>
                        </div>
                    </div>
                    :
                    <div className="card-create-container">
                        <div className="card-create-container-item">
                            <Input value={cardFormat(post.number)} name="cardNum" disabled/>
                            <button onClick={() => generateNum()}>Генерировать</button>
                        </div>
                        <div className="card-create-container-item">
                            <Input value={post.name} name="name" onChange={onChange} placeholder="Name" style={{ width: '30%' }}/>
                            <Input value={post.surname} name="surname" onChange={onChange} placeholder="Surname" style={{ width: '50%' }}/>
                            <Input value={post.cvv} name="cvv" onChange={onChange} placeholder="CVV" style={{ width: '20%' }}/>
                        </div>
                        <div className="card-create-container-item">
                            <Select defaultValue="Выберите счет для привязки к карте" style={{ width: '100%', color: '#3F4C67' }}>
                                <Option>Счет в Тенге: {thousandSeparator(returnData(0)?.data.invested) + returnData(0)?.data.sign}</Option>
                            </Select>
                        </div>
                        <div className="card-create-container-item">
                            <button onClick={handleOk} style={{borderRadius: '5px', width: '100%'}}>Открыть карту</button>
                        </div>
                    </div>
                }
            </Modal>
        </>
    );
}

export default CardCreateBtn