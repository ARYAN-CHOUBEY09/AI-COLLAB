import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../config/axios'
import { UserContext } from '../context/user.context'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { setUser } = useContext(UserContext)
    const navigate = useNavigate()

    function submitHandler(e) {
        e.preventDefault()

        axios.post('/users/login', { email, password })
            .then((res) => {
                localStorage.setItem('token', res.data.token)
                setUser(res.data.user)
                navigate('/projects')
            })
            .catch((err) => {
                console.log(err.response.data)
            })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f1117] relative overflow-hidden">

            {/* Background Glow */}
            <div className="absolute top-[-100px] right-[-80px] w-[350px] h-[350px] bg-blue-500/30 blur-[120px] rounded-full animate-pulse"></div>

            <div className="bg-white/10 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-white/10 w-full max-w-md animate-fade-in">

                {/* Heading */}
                <h2 className="text-3xl font-extrabold text-center mb-6 
                    bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                    Welcome Back
                </h2>

                <p className="text-gray-300 text-center mb-8">
                    Please enter your login details
                </p>

                <form onSubmit={submitHandler}>

                    {/* EMAIL */}
                    <div className="mb-5">
                        <label className="block text-gray-300 mb-2" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            className="w-full p-3 rounded-lg bg-[#1a1d27] text-white 
                            border border-white/10 focus:outline-none 
                            focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="mb-8">
                        <label className="block text-gray-300 mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            className="w-full p-3 rounded-lg bg-[#1a1d27] text-white 
                            border border-white/10 focus:outline-none 
                            focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* LOGIN BUTTON */}
                    <button
                        type="submit"
                        className="w-full p-3 text-lg rounded-full font-semibold 
                        bg-gradient-to-r from-blue-600 to-blue-400 text-white 
                        shadow-lg hover:shadow-blue-500/40 transition-all hover:-translate-y-[2px]"
                    >
                        Login
                    </button>
                </form>

                {/* REGISTER LINK */}
                <p className="text-gray-300 mt-6 text-center">
                    Don’t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-blue-400 hover:underline"
                    >
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login
