import React, { useState } from 'react';
import './App.css';
import Response from './components/response';

const axios = require('axios');

function App() {
  const [inputUrl, updateInput] = useState("");
  const [shortUrl, updateShortUrl] = useState({status: 0, description: ""});

  function handleSubmit(e) {
    e.preventDefault();
    //send input url to api
    sendUrl(inputUrl);
  }

  function clearState() {
    updateInput("");
    updateShortUrl({status: "", description: ""});
  }

  async function sendUrl(longUrl) {
    const token = '2b07d6efc3191a9524120a2999b7bc37a7143fd4';
  
    // define confiig
    const config = {
      headers: {	  
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` }
    };
    
    let shortUrl = {};
    try {
    // send request to bitly
      const response = await axios.post('https://api-ssl.bitly.com/v4/shorten', { 
        "long_url": longUrl 
      }, config)

      shortUrl.status = response.status;
      shortUrl.message = response.data.link;

      return updateShortUrl(shortUrl);
    }
    catch(err) {
      console.log(err);
      shortUrl.status = err.response.status;
      shortUrl.message = err.response.data.message;
      return updateShortUrl(shortUrl);
    }
  }

  const success = shortUrl?.status >= 200 && shortUrl?.status < 300;
  return (
    <div className="App">

      <div className="formContainer">
        <div className="header">
          <h1>Hello World</h1>
          <h2>Lets shorten your URL</h2>
        </div>

        {!shortUrl.status ?
          <form onSubmit={handleSubmit}>
            <label>
              Input URL
              <input onChange={(e) => updateInput(e.target.value)} value={inputUrl}/>
            </label>
            <button className="btn" disabled={inputUrl.length === 0} type="submit">Submit</button>
          </form>
        :
            <Response 
              shortUrl={shortUrl}
              success={success}
              clearState={clearState}
            />  
        }        
      </div>
    </div>
  );
}

export default App;
