
const express = require('express');
const app = express();
const PORT = 3007;
app.use(express.json());
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});