import React, { useRef, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [rspMsg, setRspMsg] = useState('');
    const navigate = useNavigate();
    const onLogin = () => {
        const usernameEl = document.getElementById('username')
        const passwordEl = document.getElementById('password')
        const username = usernameEl.value;
        const password = passwordEl.value;
        usernameEl.value = '';
        passwordEl.value = '';
        fetch(`http://localhost:3001/login?username=${username}&password=${password}`).then((response) => response.text()).then((msg) => {
            setRspMsg(msg);
            if (msg === 'Login successful') {
                localStorage.setItem("user_id", username);
                navigate('/home');
            }
            setTimeout(() => { setRspMsg(''); }, 1500);
        });
    }

    const onSignup = async () => {
        const usernameEl = document.getElementById('username')
        const passwordEl = document.getElementById('password')
        const username = usernameEl.value;
        const password = passwordEl.value;
        usernameEl.value = '';
        passwordEl.value = '';
        fetch(`http://localhost:3001/signup?username=${username}&password=${password}`).then((response) => response.text()).then((msg) => {
            setRspMsg(msg);
            setTimeout(() => { setRspMsg(''); }, 1500);
        });
    }

    return (
        <div className='loginContainer'>
            <h1>LACrimeRisk</h1>
            <div className='loginForm' style={{ display: 'flex', flexDirection: 'column', width: '100vw', alignItems: 'center', justifyContent: 'center' }}>
                <label>Username:</label>
                <input id='username' type="text " />
                <label>Password:</label>
                <input id='password' type="password" />
            </div >
            <button onClick={onLogin}>Login</button>
            <button onClick={onSignup}>Signup</button>
            <p>{rspMsg}</p>
        </div >
    )
}

export default Login