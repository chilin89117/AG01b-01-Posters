const express = require('express');
const app = express();
const path = require('path');
// var server = require('http').createServer(app);
const fs = require('fs');

// var bodyParser = require('body-parser');
app.use(express.json());

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/index.html'));
});

let directory;
fs.readFile('./directory.json', 'utf8', (err, data) => {
	directory = JSON.parse(data);
	if (err) throw err;
});

app.get('/search', (req, res) => {
	let results = directory.reduce((acc, file) => {
		if (file.tags.indexOf(req.query.q) !== -1) {
			acc.push({
				id: file.id,
				title: file.title,
				thumb: '/public/images/'.concat(file.thumb),
				price: file.price
			});
		}
		return acc;
	}, []);
	res.send(results);
});

app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/public', express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV !== 'production') require('reload')(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`AG01b-01-Posters listening on port ${port}...`));
