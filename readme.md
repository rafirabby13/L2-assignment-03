<h1 align="left">Library Management API</h1>

###

<h2 align="left">A RESTful API for managing a library system, built using **Express**, **TypeScript**, and **MongoDB** (via Mongoose).</h2>

###

<h2 align="left">Technologies Used</h2>

###

<p align="left">- Node.js<br>- Express<br>- TypeScript<br>- MongoDB with Mongoose<br>- Zod (for input validation)</p>

###

<h2 align="left">Features</h2>

###

<p align="left">- Create, read, update, delete books<br>- Borrow books with business logic<br>- Availability control on borrow<br>- Aggregation for borrowed book summaries<br>- Mongoose middleware (pre/post)<br>- Static method for availability update<br>- Filtering and sorting support</p>

###

<h2 align="left">Getting Started</h2>

###

<h3 align="left">Clone the Repository</h3>

###

<p align="left">https://github.com/rafirabby13/L2-assignment-03</p>

###

<h3 align="left">Install Dependencies</h3>

###

<p align="left">npm install</p>

###

<h3 align="left">Environment Variables</h3>

###

<p align="left">DB_USER<br>DB_PASS</p>

###

<h3 align="left">Available Scripts</h3>

###

<p align="left"># Start in development mode<br>npm run dev<br><br># Build TypeScript project<br>npm run build<br><br># Start the compiled project<br>npm start</p>

###

<h2 align="left">API Endpoints</h2>

###

<p align="left">Create Book<br>POST /api/books<br>Get All Books<br>GET /api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5<br>Get Book by ID<br>GET /api/books/:bookId<br>Update Book<br>PUT /api/books/:bookId<br>Delete Book<br>DELETE /api/books/:bookId<br>Borrow a Book<br>POST /api/borrow<br>Borrowed Books Summary<br>GET /api/borrow</p>

###

<h2 align="left">Validation & Error Handling</h2>

###

<h3 align="left">Generic Error Response:</h3>

###

<p align="left">{<br>  "message": "Validation failed",<br>  "success": false,<br>  "error": {<br>    "name": "ValidationError",<br>    "errors": {<br>      "copies": {<br>        "message": "Copies must be a positive number",<br>        "name": "ValidatorError"<br>      }<br>    }<br>  }<br>}</p>

###