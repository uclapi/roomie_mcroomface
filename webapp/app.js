var express = require('express');
var app = express();
var path = require('path');

if(process.env.NODE_ENV === 'production'){
  app.use(express.static(__dirname + '/dist'));
} else {
  app.use(express.static(__dirname + '/statics'));
}

app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, 'statics/index.html'));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
