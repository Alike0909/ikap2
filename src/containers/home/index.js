import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom'
import { Route } from 'react-router';
import axios from 'axios'
import 'antd/dist/antd.css'
import './index.css'

import Dashboard from '../dashboard'
import Investments from '../investments'

import firebase from 'firebase/app'
import 'firebase/firestore'
import firebaseConfig from "../../firebaseConfig";
firebase.initializeApp(firebaseConfig)
const db = firebase.firestore();

function Home() {
    const { Content, Sider } = Layout;

    const [cash, setCash] = useState([])
    const [currency, setCurrency] = useState([])
    const [invest, setInvest] = useState([])
    const [convertData, setConvertData] = useState([])
    const currencies = [convertData.KZT, convertData.USD, convertData.EUR, convertData.RUB, convertData.KGS, convertData.GBP, convertData.CNY, convertData.XAU]

    async function fetchCash() {
        let data = await db.collection("cash").get()
        setCash(data.docs)
    }

    async function fetchCurrency() {
        let data = await db.collection("currency").get()
        setCurrency(data.docs)
    }

    async function fetchInvest() {
        let data = await db.collection("investments").get()
        setInvest(data.docs)
    }

    useEffect(() => {
        fetchCash()
        fetchCurrency()
        fetchInvest()
        axios.get(`http://api.exchangeratesapi.io/v1/latest?access_key=329ed469fb9d0b86f01272b4ba881944`).then(res => setConvertData(res.data.rates))
    }, [])

    const convert = (from, to) => {
        if (from != 7 && to != 7) {
            return (currencies[to] / currencies[from])
        } else if (from == 7){
            return (currencies[to] / currencies[from] / 31.1034768)
        }
    }

    var thousandSeparator = function (str) {
        var parts = (str + '').split('.'),
            main = parts[0],
            len = main.length,
            output = '',
            i = len - 1;
        while (i >= 0) {
            output = main.charAt(i) + output;
            if ((len - i) % 3 === 0 && i > 0) {
                output = ' ' + output;
            }
            --i;
        }
        if (parts.length > 1) {
            output += '.' + parts[1];
        }
        return output;
    };

    var getAllInvested = function (str) {
        var temp = []
        for (var i in str) {
            temp.push(str[i].data().invested);
        }
        return temp.reduce((a, b) => a + b, 0)
    };

    var getAllCurrency = function (str) {
        var temp = []
        for (var i in str) {
            temp.push(str[i].data().invested * convert(i, 0));
        }
        return temp.reduce((a, b) => a + b, 0)
    };

    var getAllIncome = function (str) {
        var temp = []
        for (var i in str) {
            temp.push(str[i].data().invested * Number(str[i].data().profitability.slice(0, -1)) / 1200);
        }
        return temp.reduce((a, b) => a + b, 0)
    };

    const returnData = (id) => {
        for (let i in currency) {
            if (currency[i].data().value == id) {
                return { id: currency[i].id, data: currency[i].data(), name: 'currency' }
            }
        }
        for (let i in cash) {
            if (cash[i].data().value == id) {
                return { id: cash[i].id, data: cash[i].data(), name: 'cash' }
            }
        }
    }

    return (
        <div className="home">
            <Layout style={{ background: '#D2D7F5' }}>
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    onBreakpoint={broken => {
                        console.log(broken);
                    }}
                    onCollapse={(collapsed, type) => {
                        console.log(collapsed, type);
                    }}
                    style={{width: '84px', maxWidth: '84px', minWidth: '0'}}
                >
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} style={{ background: '#D2D7F5', height: '100vh', paddingTop: '144px' }}>
                        <Menu.Item key="1" icon={
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 21H2V11C2 9.89543 2.89543 9 4 9H8V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V7H20C21.1046 7 22 7.89543 22 9V21ZM16 9V19H20V9H16ZM10 4V19H14V4H10ZM4 11V19H8V11H4Z" fill="#3F4C67" />
                            </svg>
                        }>
                            <Link to={'/dashboard'}></Link>
                        </Menu.Item>
                        <Menu.Item key="2" icon={
                            <svg width="20" height="20" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21.6667 20.8337H4.33341C3.1368 20.8337 2.16675 19.9009 2.16675 18.7503V6.25033C2.16675 5.09973 3.1368 4.16699 4.33341 4.16699H21.6667C22.8634 4.16699 23.8334 5.09973 23.8334 6.25033V18.7503C23.8334 19.9009 22.8634 20.8337 21.6667 20.8337ZM4.33341 6.25033V18.7503H21.6667V6.25033H4.33341ZM16.7917 16.667C15.296 16.667 14.0834 15.5011 14.0834 14.0628C14.0834 12.6246 15.296 11.4587 16.7917 11.4587C18.2875 11.4587 19.5001 12.6246 19.5001 14.0628C19.5001 14.7535 19.2147 15.4159 18.7068 15.9042C18.1989 16.3926 17.51 16.667 16.7917 16.667ZM12.4584 16.667C10.9626 16.667 9.75008 15.5011 9.75008 14.0628C9.75008 12.6246 10.9626 11.4587 12.4584 11.4587C13.0465 11.4591 13.6178 11.6466 14.0834 11.992C13.4023 12.4786 13.0008 13.2464 13.0008 14.0623C13.0008 14.8782 13.4023 15.646 14.0834 16.1326C13.618 16.4783 13.0466 16.6662 12.4584 16.667Z" fill="#2E3A59" />
                            </svg>
                        }>
                            <Link to={'/investments'}></Link>
                        </Menu.Item>
                        <Menu.Item key="3" icon={
                            <svg width="20" height="20" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.0001 23.8337C7.017 23.8337 2.16675 18.9834 2.16675 13.0003C2.16675 7.01724 7.017 2.16699 13.0001 2.16699C18.9832 2.16699 23.8334 7.01724 23.8334 13.0003C23.8268 18.9807 18.9804 23.8271 13.0001 23.8337ZM13.0001 4.33366C8.21361 4.33366 4.33341 8.21386 4.33341 13.0003C4.33341 17.7868 8.21361 21.667 13.0001 21.667C17.7865 21.667 21.6667 17.7868 21.6667 13.0003C21.6614 8.21608 17.7843 4.33903 13.0001 4.33366ZM18.4167 14.0837H11.9167V7.58366H14.0834V11.917H18.4167V14.0837Z" fill="#2E3A59" />
                            </svg>
                        }>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout style={{ background: '#D2D7F5' }}>
                    <Content style={{ padding: '24px 24px 24px 12px',}}>
                        <div className="site-layout-background" style={{ height: 'calc(100vh - 48px)', background: '#fff', borderRadius: '10px' }}>
                            <Route exact path={'/dashboard'} component={() => <Dashboard db={db} fetchCash={fetchCash} fetchCurrency={fetchCurrency} fetchInvest={fetchInvest} cash={cash} invest={invest} currency={currency} convert={convert} getAllInvested={getAllInvested} getAllCurrency={getAllCurrency} getAllIncome={getAllIncome} returnData={returnData} thousandSeparator={thousandSeparator}/>}/>
                            <Route exact path={'/investments'} component={Investments}/>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
}

export default Home