import React, { useEffect, useState } from 'react'
import { Modal, Checkbox, Tag } from 'antd';
import './index.css'

function CurrencyCreateButton(props) {
    const { db } = props
    const { currentUser } = props
    const { currency, fetchCurrency } = props
    const { index, view } = props
    const { returnData, success } = props
    const [types, setTypes] = useState([])
    const [openedCurrency, setOpenedCurrency] = useState([])

    async function fetchTypes() {
        let data = await db.collection("currency_types").get()
        setTypes(data.docs)
    }

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
        currency.forEach(item =>
            item.data().user == currentUser ?
                setOpenedCurrency(openedCurrency => [...openedCurrency, item.data().value])
                :
                // setOpened(opened)
                ''
        )
        currency.forEach(item =>
            item.data().user == currentUser ?
                item.data().priority ?
                    setChecked(checked => [...checked, item.data().value])
                    :
                    // setOpened(opened)
                    ''
                :
                ''
        )
    }

    const handleOk = () => {
        selectedTags.forEach(item => 
            db.collection("currency").add({
                name: item.name,
                type: item.type,
                term: ``,
                invested: 0,
                sign: item.sign,
                value: item.value,
                user: currentUser,
                priority: checked.indexOf(item.value) > -1 ? true : false
            })
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            })
        )
        fetchCurrency()
        setOpenedCurrency([])
        selectedTags.length > 0 ?
        success(`Вы открыли новую валюту! ${selectedTags.map(item => item.name)}`)
        :
        success(`Вы переустановили приоритеты по валютам!`)
    }

    const handleCancel = () => {
        setIsModalVisible(false);
        setOpenedCurrency([])
    }

    const { CheckableTag } = Tag;

    const [selectedTags, setSelectedTags] = useState([])
    const [checked, setChecked] = useState([])

    const handleChange = (item, check) => {
        const nextSelectedTags = check ? [...selectedTags, item.data()] : selectedTags.filter(el => el.value !== item.data().value);
        setSelectedTags(nextSelectedTags)

        const nextChecked = checked.filter(el => el != item.data().value)
        setChecked(nextChecked)
    }

    const matchOf = (obj) => {
        return selectedTags.some(function(el) {
            return el.value == obj
        })
    }

    const onChange = (obj) => {
        const nextChecked = checked.indexOf(obj) > -1 ? checked.filter(el => el !== obj) : [...checked, `${obj}`]
        nextChecked.length > 2 ? console.log("limit!") : setChecked(nextChecked)
    }

    const changePriority = (obj) => {
        checked.indexOf(obj) > -1 ?
        db.collection(returnData(obj).name).doc(returnData(obj).id).update({
            "priority": false
        })
        .then(() => {
            console.log("Document TO successfully updated!");
        })
        :
        db.collection(returnData(obj).name).doc(returnData(obj).id).update({
            "priority": true
        })
        .then(() => {
            console.log("Document TO successfully updated!");
        })

        const nextChecked = checked.indexOf(obj) > -1 ? checked.filter(el => el !== obj) : [...checked, `${obj}`]
        nextChecked.length > 2 ? console.log("limit!") : setChecked(nextChecked)

        // fetchCurrency()
    }

    useEffect(() => {
        fetchTypes()
    }, [])

    return (
        <>
            <div className="mycurrency-create" key={index} style={index > 0 ? { display: 'none' } : { display: 'flex' }} onClick={showModal}>
                <p>Добавить валюту</p>
            </div>
            <button onClick={showModal} style={view ? { width: 'fit-content', height: 'fit-content', border: 'none', background: 'transparent' } : {display: 'none'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 16C4.89543 16 4 15.1046 4 14C4 12.8954 4.89543 12 6 12C7.10457 12 8 12.8954 8 14C8 14.5304 7.78929 15.0391 7.41421 15.4142C7.03914 15.7893 6.53043 16 6 16ZM12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14ZM18 12C16.8954 12 16 11.1046 16 10C16 8.89543 16.8954 8 18 8C19.1046 8 20 8.89543 20 10C20 10.5304 19.7893 11.0391 19.4142 11.4142C19.0391 11.7893 18.5304 12 18 12Z" fill="#2E3A59" />
                </svg>
            </button>
            <Modal title="Добавить Валюту / Выставить приоритет" visible={isModalVisible} onCancel={handleCancel} footer={null}>
                <p style={{margin: '15px 0'}}>* Приоритет можно выставить только 2-ум валютам</p>
                <div className="mycurrency-create-container" style={{marginTop: '15px'}}>
                    {types.map(item => (
                        openedCurrency.indexOf(item.data().value) > -1 ?
                        <div className="mycurrency-create-container-item">
                            <CheckableTag
                                key={item.data().value}
                                checked
                                disabled
                            >
                                {item.data().name}
                            </CheckableTag>
                            <p>открыт</p>
                            <Checkbox checked={checked.indexOf(item.data().value) > -1} onChange={() => changePriority(item.data().value)}></Checkbox>
                        </div>
                        :
                        <div className="mycurrency-create-container-item">
                            <CheckableTag
                                key={item.data().value}
                                checked={matchOf(item.data().value)}
                                onChange={checked => handleChange(item, checked)}
                            >
                                {item.data().name}
                            </CheckableTag>
                            <p>еще не открыт</p>
                            <Checkbox checked={checked.indexOf(item.data().value) > -1} onChange={() => onChange(item.data().value)} disabled={!matchOf(item.data().value)}></Checkbox>
                        </div>
                    ))}
                    <div className="cash-buttons">
                        <button onClick={handleOk}>Выполнить</button>
                        <button onClick={handleCancel}>Отменить</button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default CurrencyCreateButton