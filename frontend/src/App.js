import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [isValidJson, setIsValidJson] = useState(true);
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'RA2111028010018'; // Set your roll number as the title
  }, []);

  const validateJson = (input) => {
    try {
      JSON.parse(input);
      setIsValidJson(true);
      return true;
    } catch {
      setIsValidJson(false);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (validateJson(jsonInput)) {
      try {
        const response = await axios.post('http://localhost:8000/bfhl', JSON.parse(jsonInput));
        setResponseData(response.data);
        setError('');
      } catch {
        setError('Error in fetching data from the API');
      }
    } else {
      setError('Invalid JSON input');
    }
  };

  const handleOptionChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedOptions(value);
  };

  const formatFilteredResponse = () => {
    if (!responseData) return null;

    const output = [];
    if (selectedOptions.includes('Alphabets')) {
      output.push(`Alphabets: ${responseData.alphabets.join(', ')}`);
    }
    if (selectedOptions.includes('Numbers')) {
      output.push(`Numbers: ${responseData.numbers.join(', ')}`);
    }
    if (selectedOptions.includes('Highest lowercase alphabet')) {
      output.push(`Highest lowercase alphabet: ${responseData.highest_lowercase_alphabet}`);
    }
    return output.join('\n');
  };

  return (
    <div>
      <h1>{responseData?.roll_number}</h1>
      
      <textarea
        rows="5"
        placeholder="Enter JSON here"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>

      {!isValidJson && <p style={{ color: 'red' }}>Invalid JSON format</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <br/>
      {responseData && (
        <>
          <label>Select options to filter response:</label>
          <select multiple={true} onChange={handleOptionChange}>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
          </select>

          <div>
            <h2>Filtered Response:</h2>
            <pre>{formatFilteredResponse()}</pre>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
