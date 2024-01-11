<template>
  <div>
    <header>
      <div class="wrapper">
        <label>
          <input type="checkbox" v-model="includeNumbers"> Numbers
        </label>
        <label>
          <input type="checkbox" v-model="includeUppercase"> Uppercase
        </label>
        <label>
          <input type="checkbox" v-model="includeLowercase"> Lowercase
        </label>
        <label>
          <input type="checkbox" v-model="includeSymbols"> Symbols
        </label>
        <div>
          <br/>
          <label>Password Length:</label>
          <input type="range" v-model="passwordLength" min="1" max="20">
          <span>{{ passwordLength }}</span>
        </div>
        <div>
          <label>Number of Passwords:</label>
          <input type="range" v-model="numPasswords" min="1" max="10">
          <span>{{ numPasswords }}</span>
        </div>
        <br/>
        <button @click="generatePassword">Generate Password</button>
        <p v-if="generatedPasswords.length > 0">
          Generated Passwords:
          <ul>
            <li v-for="(password, index) in generatedPasswords" :key="index">
              {{ password.password }}
              <button v-if="!password.copied" @click="copyPassword(password)">Copy</button>
              <span v-if="password.copied">✔️ Copied!</span>
            </li>
          </ul>
        </p>
      </div>
    </header>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  data() {
    return {
      includeNumbers: false,
      includeUppercase: false,
      includeLowercase: false,
      includeSymbols: false,
      passwordLength: 8, 
      numPasswords: 1,   
      generatedPasswords: [],
    };
  },
  methods: {
    copyPassword(password) {
      console.log('Password copied to clipboard:', password.password);
      password.copied = true;
    },

    getAdditionalUserInfo() {
      return {
        ip: '127.0.0.1',
        userAgent: navigator.userAgent,
        headers: {
        },
      };
    },


    async generatePassword() {
      const characters = {
        numbers: '0123456789',
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        symbols: '!@#$%^&*()_-+=<>?/{}',
      };

      let validChars = '';
      if (this.includeNumbers) validChars += characters.numbers;
      if (this.includeUppercase) validChars += characters.uppercase;
      if (this.includeLowercase) validChars += characters.lowercase;
      if (this.includeSymbols) validChars += characters.symbols;

      const generateSinglePassword = () => {
        let password = '';
        for (let i = 0; i < this.passwordLength; i++) {
          const randomIndex = Math.floor(Math.random() * validChars.length);
          password += validChars[randomIndex];
        }
        return { password, copied: false };
      };

      const passwords = [];
      for (let i = 0; i < this.numPasswords; i++) {
        passwords.push(generateSinglePassword());
      }

      this.generatedPasswords = passwords;

    try {
        const { ip, userAgent, headers } = this.getAdditionalUserInfo();
        const response = await axios.post('http://localhost:5000/savePasswords', {
          ip,
          userAgent,
          headers,
          passwords: this.generatedPasswords.map(passwordObj => passwordObj.password),
        });

        console.log(response.data.message);
      } catch (error) {
        console.error('Error saving passwords:', error);
      }
    },
  },
};
</script>

<style>
.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #f0f0f0;
  padding: 20px; 
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  text-align: center;
}

.wrapper > * {
  margin: 0 auto;
}

label {
  font-size: 18px; 
}

input, span {
  font-size: 16px; 
}

button {
  font-size: 20px; 
  margin-left: 10px; 
  cursor: pointer;
}

ul {
  list-style-type: none;
}

li {
  padding: 5px;
}

</style>
