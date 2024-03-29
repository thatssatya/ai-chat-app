import React, { useState } from "react";
import './App.css';

function App() {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [person, setPerson] = useState('');
    const [mood, setMood] = useState('');
    const [heading, setHeading] = useState('Chat with?');
    const [sendButtonDisabled, setSendButtonDisabled] = useState(true);
    const [loadingHidden, setLoadingHidden] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();

        setResponse('');
        setLoadingHidden(false);

        fetch(process.env.REACT_APP_BACKEND_SERVER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                [process.env.REACT_APP_BACKEND_KEY]: process.env.REACT_APP_BACKEND_SECRET
            },
            body: JSON.stringify({person, mood, message}),
        })
            .then((res) => res.json())
            .then((data) => setResponse(data.message));
    };

    const processSendButtonDisabled = (p, m) => {
        if (!p || p === '' || !m || m === '') {
            setSendButtonDisabled(true);
        } else {
            setSendButtonDisabled(false);
        }
    }

    const getNameFormatted = (rawName) => {
        const arr = rawName.split(' ');
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }

        return arr.join(' ').trim();
    }

    const resetChatHeading = (e) => {
        let newHeading = 'Chat with?';
        setHeading(newHeading);
        setPerson('');
        processSendButtonDisabled('', message);
        setResponse('');
        setLoadingHidden(true);
        resizeInputField(e, newHeading.length);

        e.value = '';
    }

    const setChatHeading = (e) => {
        if (e && e.value && e.value !== '') {
            const nameFormatted = getNameFormatted(e.value);

            if (!nameFormatted || nameFormatted === '') {
                resetChatHeading(e);
                return;
            }

            let newHeading = 'Chatting with ';

            if (nameFormatted.length > Math.floor(window.innerWidth / 27)) {
                newHeading += (nameFormatted.slice(0, 10).trim() + '...');
            } else {
                newHeading += nameFormatted;
            }

            setHeading(newHeading);
            setPerson(nameFormatted);
            processSendButtonDisabled(newHeading, message);
            resizeInputField(e, newHeading.length + 1);

            e.value = '';
        }
    };

    const resizeInputField = (inputField, newLength) => {
        inputField.style.width = Math.min(window.innerWidth - 1, (Math.max(14, (newLength)))) + 'ch';
    }

    return (
        <div className="App">
            <div className="main-contents">
                <form onSubmit={handleSubmit}>

                    <div className='heading-container'>
                        <input
                            type='text'
                            id='hello'
                            className='input-celeb-name'
                            placeholder={heading}
                            onFocus={(e) => {
                                resetChatHeading(e.target);
                            }}
                            onBlur={e => {
                                setChatHeading(e.target);
                            }}
                            onKeyUp={(e) => {
                                resizeInputField(e.target, e.target.value.length + 1);
                            }}
                        ></input>
                    </div>

                    <br></br>
                    <br></br>

                    <textarea
                        className="text-areas"
                        placeholder="Mood (eg: Happy)"
                        value={mood}
                        onChange={(e) => setMood(e.target.value)}
                    ></textarea>

                    <br></br>

                    <textarea
                        className="text-areas"
                        placeholder="Message"
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                            processSendButtonDisabled(person, e.target.value.trim());
                        }}
                        required
                    ></textarea>

                    <br></br>
                    <br></br>

                    <input
                        className="send-button"
                        type="image"
                        src="send-custom.png"
                        name="submit"
                        width="30"
                        disabled={sendButtonDisabled}
                        alt='Send'
                        onSubmit={handleSubmit}
                    ></input>

                </form>

                <br></br>

                <div className="response-area">
                    {(response) ?
                        (<div className="response">
                            <b className="person-name">{person}:</b> {response}
                        </div>) :
                        (!loadingHidden && <div className="loading">
                            <img src="loading.svg" width="30ch" hidden={loadingHidden} alt="Loading"></img>
                        </div>)}
                </div>
            </div>
            <div className="social">
                <footer>
                    <p className="made-by-text">Follow me</p>
                    <input
                        className="bio-icon"
                        type="image"
                        src="bio_img.png"
                        name="button"
                        width="40"
                        alt='Insta'
                        onClick={() => {
                            window.open('https://bio.link/thatssatya', '_blank');
                        }}
                    ></input>
                </footer>
            </div>
        </div>
    );
}

export default App