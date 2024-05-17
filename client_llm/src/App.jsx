import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [response, setResponse] = useState('');
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/') // replace with your FastAPI server URL
      .then(response => response.json())
      .then(data => {
        setResponse(data.response);
        setIsTyping(true);
      });
  }, []);

  useEffect(() => {
    if (isTyping) {
      let i = 0;
      let currentTag = '';
      let isInsideTag = false;
  
      let typingInterval = setInterval(() => {
        const currentChar = response.charAt(i);
  
        if (currentChar === '<' || currentChar === '&') {
          isInsideTag = true;
          currentTag += currentChar;
        } else if (isInsideTag && currentChar !== '>' && currentChar !== ';') {
          currentTag += currentChar;
        } else {
          let textToAdd = currentChar;
          if (isInsideTag && (currentChar === '>' || currentChar === ';')) {
            isInsideTag = false;
            currentTag += currentChar;
            textToAdd = currentTag;
            currentTag = '';
          }
  
          setDisplayedResponse(prev => prev + textToAdd);
        }
  
        i++;
        if (i === response.length) {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 200); // adjust typing speed here
    }
  }, [isTyping, response]);
  
  

  return (
    <div className="App">
      <header className="App-header">
        <h1>Benefits of Onion</h1>
        <div dangerouslySetInnerHTML={{ __html: displayedResponse }} />
      </header>
    </div>
  );
}

export default App;


// import React, { useEffect, useState } from 'react';
// import './App.css';

// function App() {
//   const [displayedResponse, setDisplayedResponse] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [typingFinished, setTypingFinished] = useState(false);

//   useEffect(() => {
//     const eventSource = new EventSource('http://localhost:8000/chat?prompt=lime'); // replace with your FastAPI server URL and your prompt

//     eventSource.onmessage = (event) => {
//       const chunk = JSON.parse(event.data);
//       setIsTyping(true);
//       let i = 0;
//       const typingInterval = setInterval(() => {
//         if (i < chunk.content.length) {
//           setDisplayedResponse(prev => prev + chunk.content.charAt(i));
//           i++;
//         } else {
//           clearInterval(typingInterval);
//           setIsTyping(false);
//         }
//       }, 100); // adjust typing speed here
//     };

//     eventSource.onopen = (event) => {
//       console.log("Connection to server opened.");
//     };

//     eventSource.onerror = (event) => {
//       console.log("Error: ", event);
//       setTypingFinished(true);
//     };

//     return () => {
//       eventSource.close();
//     };
//   }, []);

//   useEffect(() => {
//     if (!isTyping && typingFinished) {
//       alert("AI has finished typing");
//     }
//   }, [isTyping, typingFinished]);

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Benefits of Onion</h1>
//         <div dangerouslySetInnerHTML={{ __html: displayedResponse }} />
//       </header>
//     </div>
//   );
// }

// export default App;
