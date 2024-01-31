import React from 'react'

const Signup = () => {
    return (
        <div className='signupContainer'>
            <h1>Signup</h1>
            <div className='signupForm' style={{ display: 'flex', flexDirection: 'column', width: '100vw', alignItems: 'center', justifyContent: 'center' }}>
                <label>Username:</label>
                <input type="text " />
                <label>Password:</label>
                <input type="password" />

            </div >
            <button>Signup</button>
        </div >
    )
}

export default Signup