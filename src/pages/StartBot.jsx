import React, {useContext} from 'react';
import WrapperBlock from "../components/WrapperBlock";
import WrapperForm from "../components/WrapperForm";
import {socket, UserContext} from "../App";
import {Link} from "react-router-dom";
import AlertBlock from "../components/AlertBlock";
import {checkSubscribeExpired} from "../utils/checkSubscribeExpired";
import Api from "../http/requests";
import axios from "axios";
import useInput from "../hooks/useInput";
import {io} from "socket.io-client";


const StartBot = () => {
    const {user, logout} = useContext(UserContext)
    const subscribeExpired = checkSubscribeExpired(user.subscribe)

    const [broker, changeBroker] = useInput(user.brokers[0] || "")
    const [phone, changePhone] = useInput()
    const [brokerPassword, changeBrokerPassword] = useInput()
    const [brokerLogin, changeBrokerLogin] = useInput()
    const disabledButton = !broker || !phone || !brokerPassword || !brokerLogin
    const startBot = async () => {
        await axios.get('https://api.ipify.org/?format=json').then(({data}) => {
            if (data.ip) {
                Api.sendStartBot({
                    uid: user.id,
                    ip: data.ip,
                    phone,
                    broker,
                    broker_login: brokerLogin,
                    broker_password: brokerPassword
                }).then((res) => {
                    if(res.data) {
                        socket.emit('join', {
                            login: user.login,
                            ...res.data
                        })
                    }

                })
            }
        })

    }
    return (
        <>
            <div className="header w-100p flex-row-betw">
                <div className="d-f gap-20 al-center">
                    <h2 className="profile-name">
                        {user.login}
                    </h2>
                    {
                        user.admin ? <Link to={"/admin/panel"}>Панель админа</Link> : null
                    }

                </div>

                <div  onClick={logout} className="logout">
                    Выйти
                </div>
            </div>
            <WrapperBlock>
                {
                    subscribeExpired ?
                        <AlertBlock alertText="Подписка закончилась"/> :
                        <div className="flex-column">
                            <WrapperForm>
                                <div className="flex-column gap-30">
                                    <h1 onClick={logout} className="fw-5">
                                        Выбор Брокера
                                    </h1>
                                    <select onChange={changeBroker} className="inputForm">
                                        {
                                            user.brokers?.map((item) => (
                                                <option value={item}>{item}</option>
                                            ))
                                        }
                                    </select>
                                    <input value={phone} onChange={changePhone} className="inputForm" type="text" placeholder={"Номер телефона"}/>
                                    <input value={brokerLogin} onChange={changeBrokerLogin} className="inputForm" type="text" placeholder={"Брокерский логин"}/>
                                    <input value={brokerPassword} onChange={changeBrokerPassword} className="inputForm" type="password" placeholder={"Брокерский пароль"}/>
                                    <button disabled={disabledButton} onClick={startBot} className="btn c-white" style={{background: '#3BD341'}}>
                                        Запустить
                                    </button>
                                    <p className="errorForm txt-center"></p>
                                </div>
                            </WrapperForm>
                            <a className="help" href="#">Обратиться в поддержку</a>
                        </div>
                }

            </WrapperBlock>
        </>

    );
};

export default StartBot;