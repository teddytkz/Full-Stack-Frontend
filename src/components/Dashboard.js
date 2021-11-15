import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

export const Dashboard = () => {
    const [id, setId] = useState('')
    const [nama, setNama] = useState('')
    const [email, setEmail] = useState('')
    const [token, setToken] = useState('')
    const [expired, setExpired] = useState('')
    const [files, setFiles] = useState([])
    const [msg, setMsg] = useState('')
    const history = useHistory()

    useEffect(() => {
        refreshToken();
        getFile();
    }, [])

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/token')
            setToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            console.log(decoded)
            setNama(decoded.name)
            setId(decoded.userId)
            console.log(decoded.userId)
            setExpired(decoded.exp)
        } catch (error) {

        }
    }

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expired * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:5000/api/token')
            config.headers.Authorization = `Bearer ${response.data.accessToken}`
            setToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            console.log(decoded)
            setNama(decoded.name)
            setId(decoded.userId)
            console.log(decoded.userId)
            setExpired(decoded.exp)
        }
        return config
    }, (error) => { return Promise.reject(error) })

    const getFile = async () => {
        const response = await axiosJWT.get('http://localhost:5000/api/files', {
            Authorization: `Bearer ${token}`
        })
        console.log(id)
        setFiles(response.data)
    }

    const createFiles = async (e) => {
        try {
            await axios.post('http://localhost:5000/api/files', {
                id: id,
                name: nama,
                email: email
            })
            getFile();
            // history.push("/dashboard");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }
    return (
        <div>
            <h1 className="container mt-5">Welcome : {nama}</h1>
            <div className="container mt-5">
                <div className="columns">
                    <div className="column box mx-5">
                        List File :
                        <table>
                            <thead>
                                <tr>
                                    <td>Lokasi File Yml</td>
                                </tr>
                            </thead>
                            <tbody>
                                {files.map((location, index) => (
                                    <tr key={location.location}>
                                        <td>{location.location}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="column box mx-5">
                        <form onSubmit={createFiles}>
                            <p className="has-text-centered">{msg}</p>
                            <div className="field mt-5">
                                <label className="label">Nama</label>
                                <div className="controls">
                                    <input type="text" className="input" placeholder="Nama"
                                        value={nama} onChange={(e) => setNama(e.target.value)} />
                                </div>
                            </div>
                            <div className="field mt-5">
                                <label className="label">Email</label>
                                <div className="controls">
                                    <input type="email" className="input" placeholder="Email"
                                        value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                            </div>
                            <div className="field mt-5">
                                <button className="button is-success is-fullwidth">Create Files</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    )
}
