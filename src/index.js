const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const upload = multer();

const getHighestLowercaseAlphabet = (data) => {
    const lowercaseAlphabets = data.filter(item => typeof item === 'string' && item.match(/[a-z]/));
    return lowercaseAlphabets.length ? [lowercaseAlphabets.sort().pop()] : [];
};

const validateFile = (file) => {
    if (!file) return { fileValid: false, mimeType: null, sizeKb: null };
    const fileSizeKb = (file.size / 1024).toFixed(2);
    return { fileValid: true, mimeType: file.mimetype, sizeKb: fileSizeKb };
};

app.post('/bfhl', upload.single('file_b64'), (req, res) => {
    const { data, file_b64 } = req.body;
    const dataArr = data;
    const file = req.file;

    if (!dataArr || !Array.isArray(dataArr)) {
        return res.status(400).json({ is_success: false, message: 'Invalid data format' });
    }

    const numbers = dataArr.filter(item => !isNaN(item));
    const alphabets = dataArr.filter(item => isNaN(item));

    const highestLowercaseAlphabet = getHighestLowercaseAlphabet(dataArr);

    const fileValidation = validateFile(file);

    const user_id = 'utkarsh_gupta_28102003';
    const email = 'un2383@srmist.edu.in';
    const rollNumber = 'RA2111028010018';

    res.json({
        is_success: true,
        user_id,
        email,
        roll_number: rollNumber,
        numbers,
        alphabets,
        highest_lowercase_alphabet: highestLowercaseAlphabet,
        file_valid: fileValidation.fileValid,
        file_mime_type: fileValidation.mimeType,
        file_size_kb: fileValidation.sizeKb
    });
});

app.get('/bfhl', (req, res) => {
    res.status(200).json({
        operation_code: 1
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
