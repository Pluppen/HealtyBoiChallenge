import React, {useEffect, useState} from 'react';
import AccountCard from './components/AccountCard';

export interface IAccount {
    id: number;
    username: string;
    img: string;
    hp: number;
    xp: number;
    maxXp: number;
    level: number;
    useShaderForProfilePicture: boolean;
    vertexShaderCode: string;
    fragmentShaderCode: string;
}

interface IModalInfo {
    title: string;
    description: string;
    extraHtml: string;
}


const Game: React.FC = () => {
    const [accounts, setAccounts] = useState<IAccount[]>([]);
    const [modalInfo, setModalInfo] = useState<IModalInfo | null>(null);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URL}/account`).then(res => res.json()).then((res) => {
            setAccounts(res);
        })
    }, []);

    useEffect(() => {
        if(modalInfo !== null) {
            (document.getElementById('dialog-dark-rounded') as any).showModal();
        }
    }, [modalInfo])

    return (
        <div>
            {modalInfo !== null ? (
                <section>
                    <dialog className="nes-dialog is-dark is-rounded" id="dialog-dark-rounded">
                        <form method="dialog" className="custom-dialog">
                          <p className="title">{modalInfo.title}</p>
                          <p>{modalInfo.description}</p>
                          <p dangerouslySetInnerHTML={{__html: modalInfo?.extraHtml}}></p>
                          <menu className="dialog-menu">
                            <button className="nes-btn is-primary" name="dialog-menu">Confirm</button>
                          </menu>
                        </form>
                    </dialog>
                </section>
            ) : null}

            <div className="container">
                    {accounts.map(account => (
                        <AccountCard account={account} key={'AccountCard' + account.id} setAccounts={setAccounts} setModalInfo={setModalInfo} />
                    ))}
            </div>
        </div>
    );
}

export default Game;
