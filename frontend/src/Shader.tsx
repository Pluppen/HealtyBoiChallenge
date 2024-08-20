import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom"

import {useAuth} from './App';

const Shader: React.FC = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    const [vertexShader, setVertexShader] = useState("");
    const [fragmentShader, setFragmentShader] = useState("");
    const [shaderEnabled, setShaderEnabled] = useState(false);

    useEffect(() => {
        if (auth.user) {
            setVertexShader(auth.user.vertexShaderCode);
            setFragmentShader(auth.user.fragmentShaderCode);
            setShaderEnabled(auth.user.useShaderForProfilePicture);
        }
    }, [auth])

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_BASE_URL}/shader`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + auth.token
            },
            body: JSON.stringify({
                vertexShaderCode: vertexShader,
                fragmentShaderCode: fragmentShader,
                useShaderForProfilePicture: shaderEnabled
            })
        }).then(res => res.json()).then(data => {
            if(data.success) {
                auth.updateUserData(data.account)
                navigate("/");
            }
        })

    }

    return (
        <form onSubmit={handleSave}>
            <div className="nes-container is-dark is-rounded with-title">
                <p className="title">Vertex Shader</p>
                <textarea name="vertexShader" form="shaderCode" className="nes-textarea is-dark" rows={30} value={vertexShader} onChange={(e) => setVertexShader(e.target.value)}>
                </textarea>
            </div>
            <div className="nes-container is-dark is-rounded with-title">
                <p className="title">Fragment Shader</p>
                <textarea name="fragmentShader" form="shaderCode" className="nes-textarea is-dark" rows={30} value={fragmentShader} onChange={(e) => setFragmentShader(e.target.value)}>
                </textarea>
            </div>
            <div className="nes-container is-dark is-rounded">
                <div style={{"backgroundColor": "#212529", "padding": "1rem 0"}}>
                    <label>
                        <input
                          checked={shaderEnabled}
                          onChange={() => setShaderEnabled(!shaderEnabled)}
                          id="useShaderForProfilePicture"
                          type="checkbox"
                          name="useShaderForProfilePicture"
                          className="nes-checkbox is-dark"
                         />
                        <span>Enabled</span>
                    </label>
                </div>
                <button className="nes-btn">Update</button>
            </div>
        </form>
    );
}

export default Shader;
