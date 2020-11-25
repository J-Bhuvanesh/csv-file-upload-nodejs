var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
const csv = require('csvtojson');
var Item = require('./model');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/items', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', () => {
    console.log('error ocurred while connecting db')
});
db.on('open', function() {
    console.log('connection established..')
});

http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      var newpath = 'C:/upload/' + files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('<div>File uploaded successfully</div>');
        res.write('</div>')
    res.write('<div style="padding: 30px;">')
    res.write('<form action="get" method="post" enctype="multipart/form-data">');
    res.write('<input type="submit" value="View Data">');
    res.write('</form>');
    res.write('</div>')
        csv()
            .fromFile(newpath)
            .then(function(jsonArrayObj){
            Item.collection.insertMany(jsonArrayObj).then(result => {
            }).catch(err => {
              console.log(err)
            })
   })
        res.end();
      });
 });
  } else if (req.url =='/get') {
    Item.find().exec().then(result => {
      res.write(JSON.stringify(result))
      res.end();
    }).catch(err => {
      console.log(err)
    })
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<div style="padding: 30px;">')
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input style="margin: 30px;" type="file" name="filetoupload"><br>');
    res.write('<input type="submit" value="Save Data">');
    res.write('</form>');
    // res.write('</div>')
    // res.write('<div style="padding: 30px;">')
    // res.write('<form action="get" method="post" enctype="multipart/form-data">');
    // res.write('<input type="submit" value="View Data">');
    // res.write('</form>');
    // res.write('</div>')
    return res.end();
  }
}).listen(8000);