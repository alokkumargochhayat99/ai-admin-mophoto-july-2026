import React, { useState } from 'react';
import './Login.css';
import {
    EnvelopeIcon,
    KeyholeIcon
} from "@phosphor-icons/react";
import logo from '../assets/logo.webp';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    // submit 
    const handelSubmit = async () => {
        if (email == '' || password == '') {
            alert('Enter Email And Password');
            return;
        }

        // api call 
        try {
            let loginUrl = `${import.meta.env.VITE_URL}/api/admin/login`;
            let loginRes = await axios.post(loginUrl, {
                "email": email,
                "password": password
            },
                {
                    validateStatus: () => true,
                }
            )
           
            if(loginRes.status === 200){
                console.log(loginRes)
                localStorage.setItem('moToken', loginRes.data.token);
                navigate('/all-events')
                
            }
            if(loginRes.status === 401){
                alert('Invalid Email & Password');
            }
            if(loginRes.status === 429){
                alert('Too Many Login Attempts.');
            }



        } catch (err) {
            console.log(err)
        }
    }
    return (
        <>
            <div className="login-wrap">

                {/* <!-- ============ TOP BRAND BANNER ============ --> */}
                <div className="login-top">
                    <div className="logo-badge">
                        <img src={logo} alt="logo" width={50} />
                    </div>
                    <div className="brand">Mo Photo <span className="dot"> Admin</span></div>
                    <div className="tagline">Share every moment, instantly</div>
                </div>

                {/* <!-- ============ LOGIN CARD ============ --> */}
                <div className="login-body">
                    <div className="login-card">
                        <h2>Admin Login</h2>
                        <div className="sub">Log in to manage your events and photos</div>

                        <div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <div className="input-mo">
                                    <i className="bi bi-envelope">

                                    </i>
                                    <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="you@example.com" required />
                                </div>
                            </div>

                            <div className="mb-2">
                                <label className="form-label">Password</label>
                                <div className="input-mo">
                                    <i className="bi bi-lock">

                                    </i>
                                    <input type="password" id="pwd" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Enter your password" required />
                                    <i className="bi bi-eye toggle-eye" id="toggleEye" role="button"></i>
                                </div>
                            </div>

                            <div className="form-row-between">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="remember" />
                                    <label className="form-check-label" for="remember">Remember me</label>
                                </div>

                            </div>

                            <button type="submit" onClick={handelSubmit} className="btn btn-mo">Log In</button>
                        </div>


                    </div>
                </div>

                <div className="text-center py-4">
                    &copy; 2026 MoPhoto. All rights reserved.
                </div>
            </div>
        </>
    )
}

export default Login
