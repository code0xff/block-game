const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', function (req, res) {
  res.render('index.html');
});

app.listen(3000, function () {
  console.log('Example app listening on port 5000!');
});
