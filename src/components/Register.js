import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Select from 'react-select'

const Register = () => {
    const [nama, setNama] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [country, setCountry] = useState([]);
    const [negara, setNegara] = useState('');
    const [msg, setMsg] = useState('');
    const history = useHistory();

    const Register = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/register', {
                name: nama,
                email: email,
                username: username,
                password: password,
                country: negara
            })
            history.push("/");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }


    useEffect(() => {
        getOptions();
    }, []);

    const getOptions = async (e) => {
        const res = await axios.get('https://restcountries.com/v3.1/all')
        const data = res.data

        const options = data.map(d => ({
            "value": d.name.common,
            "label": d.name.common

        }))
        setCountry(options)
    };

    const handleChange = (options) => {
        setNegara(options.value);
    };

    return (
        <section className="hero has-background-grey-light is-fullheight is-fullwidth" >
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4-desktop">
                            <p className="has-text-centered">{msg}</p>
                            <form onSubmit={Register} className="box">
                                <div className="field mt-5">
                                    <label className="label">Username</label>
                                    <div className="controls">
                                        <input type="text" className="input" placeholder="Username"
                                            value={username} onChange={(e) => setUsername(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Password</label>
                                    <div className="controls">
                                        <input type="password" className="input" placeholder="******"
                                            value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Nama</label>
                                    <div className="controls">
                                        <input type="text" className="input" placeholder="Nama" value={nama} onChange={(e) => setNama(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Email</label>
                                    <div className="controls">
                                        <input type="text" className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Country</label>
                                    <div className="controls">

                                        <Select options={country} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <button className="button is-success is-fullwidth">Register</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    )
}

export default Register