**Ester** is a prototype 
of a purely client-side ECMAScript notebook.

You can try it out here: https://ester.alanmervitz.com.

## About

This is an alternative to [Jupyter](https://jupyter.org/) notebooks which are undoubtedly more powerful but require server resources, and to [Observable](https://beta.observablehq.com/) which is undoubtedly more sophisticated (currently...) but seems restrictive in the use of native language features.

![image](https://user-images.githubusercontent.com/10599498/51791541-813cb480-216a-11e9-9fba-04a4df4c7d9c.png)

## Features
* ECMAScript code blocks
* Markdown code blocks

## Design
ECMAScript code is evaluated in a web worker.

The code editor used is [CodeMirror](https://codemirror.net/).

The markdown editor used is [pagedown](https://github.com/StackExchange/pagedown).

Inputs and outputs of code blocks are saved to local storage and the page is restored from the saved state when refreshed.

## Installation Dependencies
1. [Node.js](https://nodejs.org/en/)
2. [Git](https://git-scm.com/)

## Installation Steps
1. Clone the repository
   ``` sh
   git clone https://github.com/amervitz/Ester.git
   ```
2. Install the dependent libraries
   ``` sh
   npm install
   npm run install-pagedown
   npm run copy-dependencies
   ```
## Local usage
1. Start a web server to serve the static files
   ``` sh
   http-server
   ```
2. Browse to http://127.0.0.1:8080
3. Play around
4. Make code changes
4. Send me pull requests