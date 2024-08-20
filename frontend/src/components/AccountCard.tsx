import React, {useEffect} from "react";
import {IAccount} from '../Game';
import {useAuth} from '../App';
import {Link} from 'react-router-dom';

import {setupCanvas, cleanup} from '../shader';

const HealthPointsRow: React.FC<{hp: number}> = ({hp}) => {

    return (
        <div>
            {hp >= 1 ? (
                <i className="nes-icon is-large heart"/>
            ) : hp > 0 ? (
                <i className="nes-icon is-large is-half heart"/>
            ) : (
                <i className="nes-icon is-large heart is-transparent"/>
            )}

            {hp >= 2 ? (
                <i className="nes-icon is-large heart"/>
            ) : hp >= 1.5 ? (
                <i className="nes-icon is-large is-half heart"/>
            ) : (
                <i className="nes-icon is-large heart is-transparent"/>
            )}

            {hp >= 3 ? (
                <i className="nes-icon is-large heart"/>
            ) : hp >= 2.5 ? (
                <i className="nes-icon is-large is-half heart"/>
            ) : (
                <i className="nes-icon is-large heart is-transparent"/>
            )}
        </div>
    );
}

const AccountCard: React.FC<{account: IAccount, setAccounts: any, setModalInfo: any}> = ({account, setAccounts, setModalInfo}) => {
    const auth = useAuth();

    useEffect(() => {
        const canvasId = `profilePictureCanvas${account.id}`
        if (account.useShaderForProfilePicture) {
            setupCanvas(canvasId, account);
        }
    }, [account])

    const accountAction = (action: string) => {
        fetch("http://localhost:3000/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + auth.token
            },
            body: JSON.stringify({"action": action, "id": account.id})
        }).then(res => res.json()).then((res) => {
            if(res.success) {
                setAccounts(res.accounts);
                setModalInfo(res.modalInfo);
            } else {
                console.log(res);
            }
        });
    }

    return (
    <div key={account.id} className="card nes-container with-title is-dark is-rounded nes-text">
        {account.useShaderForProfilePicture ? (
            <canvas className="profile-picture-canvas" id={`profilePictureCanvas${account.id}`} width="194" height="192" />
        ) : (
            <img src={account.img} alt={account.username + " profile picture"}/>
        )}

        {account.id === auth.user.id ? (
            <Link to="/shader"><h2 className="nex">{account.username}</h2></Link>
        ) : (
            <h2 className="nex">{account.username}</h2>
        )}

        <HealthPointsRow hp={account.hp} />
        <h3>Level {account.level}</h3>

        <div className="status-bar">
            <span className="is-primary">{account.xp}</span>
            <progress className="nes-progress is-primary" value={account.xp} max={account.maxXp}></progress>
        </div>

        {auth.user.id === account.id ? (
            <>
                <button className="nes-btn is-success" onClick={() => accountAction('add-xp')}>+</button>
                <button className="nes-btn is-error" onClick={() => accountAction('remove-xp')}>-</button>
            </>
        ) : (
            <>
                <button className="nes-btn is-error" onClick={() => accountAction('attack')}>Attack</button>
                <button className="nes-btn is-success" onClick={() => accountAction('heal')}>Heal</button>
            </>
        )}
    </div>
    );
}

export default AccountCard;
