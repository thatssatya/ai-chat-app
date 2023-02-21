import React, { useState } from "react";
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [person, setPerson] = useState('');
  const [mood, setMood] = useState('');
  const [heading, setHeading] = useState('Chat with?');
  const [sendButtonDisabled, setSendButtonDisabled] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    fetch('http://192.168.1.21:3001', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ person, mood, message }),
    })
      .then((res) => res.json())
      .then((data) => setResponse(data.message));
  };

  const processSendButtonDisabled = (p, m) => {
    if (!p || p === '' || !m || m === '') {
      setSendButtonDisabled(true);
    }
    else {
      setSendButtonDisabled(false);
    }
  }

  const getNameFormatted = (rawName) => {
    const arr = rawName.split(' ');
    for (var i = 0; i < arr.length; i++) {
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

      if (nameFormatted.length > 10)
        newHeading += (nameFormatted.slice(0, 10).trim() + '...');
      else
        newHeading += nameFormatted;
      
      setHeading(newHeading);
      setPerson(nameFormatted);
      processSendButtonDisabled(newHeading, message);
      resizeInputField(e, newHeading.length + 1);
      
      e.value = '';
    }
  };

  const resizeInputField = (inputField, newLength) => {
    inputField.style.width = Math.min(27, (Math.max(14, (newLength)))) + 'ch';
  }

  return (
    <div className="App">
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
          placeholder="Mood (Optional)"
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

      { response && 
      <div className="response">
        <b className="person-name">{person}:</b> {response}
      </div> }

      <div className="social">
      <input
          className="insta-icon"
          type="image"
          src="instagram.png"
          name="button"
          width="30"
          alt='Insta'
          onClick={() => {
            window.open('https://instagram.com/thatssatya', '_blank');
          }}
          // onSubmit={handleSubmit}
        >
          {/* <a href="https://instagram.com/thatssatya" target="_blank"></a> */}
          </input>
      </div>

    </div>
  );
}

export default App