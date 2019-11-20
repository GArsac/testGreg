var express = require('express');
var router = express.Router();

var htmlHeader = `
<div id="dww" style="position:absolute;left:323px;top:60px;z-index:3;" class=" wbancrageattachex wbancrageattachey"><table width="180px" cellspacing=0 id="bz" style="height:29px;border-collapse:separate;outline:none;"><tr><td class="l-0 padding" id="tz" style="border:none;">- ATTESTATION -</td></tr></table></div>
<div id="tz" style="position:absolute;left:79px;top:110px;width:394px;height:24px;z-index:0;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;" class="l-1  wbancrageattachex wbancrageattachey"></div>
`;
var htmlFooter = `
<div id="tz" style="position:absolute;left:79px;bottom:23px;width:271px;height:17px;z-index:0;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;" class="l-9  wbancrageattachex wbancrageattachey"></div>
<div id="dww" style="position:absolute;left:83px;bottom:20px;z-index:3;" class=" wbancrageattachex wbancrageattachey"><table width="263px" cellspacing=0 id="bz" style="height:10px;border-collapse:separate;outline:none;"><tr><td class="l-10 padding" id="tz" style="border:none;">Mission de présentation des comptes annuels</td></tr></table></div>
<div id="" style="position:absolute;left:385px;bottom:20px;width:57px;height:17px;z-index:0;" class="l-8  wbancrageattachex wbancrageattachey"></div>
<div id="dww" style="position:absolute;left:389px;bottom:20px;z-index:3;" class=" wbancrageattachex wbancrageattachey"><table width="49px" cellspacing=0 id="bz" style="height:10px;border-collapse:separate;outline:none;"><tr><td class="l-11 padding" id="tz" style="border:none;">1/1</td></tr></table></div> -->
`;

// html to pdf
var fs = require('fs');
var pdf = require('html-pdf');
var child_process = require('child_process');
var options = { 
  format: 'A4', 
  zoomFactor : 1, 
  height : "1170px", 
  width : "827px", 
  type : "pdf", 
  childProcessOptions : 
  { 
    detached : true
  }
};
var plaquetteOptions = {
  format: 'A4', 
  zoomFactor : "0.753",
  type : "pdf", 
  childProcessOptions : { 
    detached : true
  },
  header : {
    height : "150px",
    contents : htmlHeader
  },
  footer : {
    height : "50px",
    contents : htmlFooter
  }
};

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// define the home page route
router.post('/', (req, res) => {
  console.log(req.body.html);
  var buff = new Buffer(req.body.html, 'base64');
  pdf.create(buff.toString('utf8'), options).toFile('./businesscard_' + Date.now() + '.pdf', (err, result) => {
    if (err) return console.log(err);
    var re = /\\/gi;
    fs.readFile(result.filename.replace(re,'/'), {encoding: 'base64'}, (err, data) => {
      if (err) return console.log(err);
      res.send(data);
      fs.unlinkSync(result.filename.replace(re,'/'));
    });
  });
});

router.post('/plaquette', (req, res) => {
  console.log(req.body.html);
  var buff = new Buffer(req.body.html, 'base64');
  //var plaquettePagesNumber = req.body.pages_number;
  var pOptions = req.body.options
  plaquetteOptions.header.contents = req.body.header
  plaquetteOptions.footer.contents = req.body.footer
  pdf.create(buff.toString('utf-8'), plaquetteOptions).toFile('./businesscard_' + Date.now() + '.pdf', (err, result) => {
    if (err) {
      res.send(err);
      return err;
    }
    var re = /\\/gi;
    fs.readFile(result.filename.replace(re,'/'), {encoding: 'base64'}, (fserr, data) => {
      if (fserr) {
        res.send(fserr);
        return fserr;
      }
      if(pOptions == 0){
        res.send(data);
      } else {
        child_process.exec(`pdftk ${result.filename.replace(re,'/')} dump_data | grep NumberOfPages | awk '{print $2}'`, (error, stdout) => {
          if (error) {
            res.send(error);
            return error;
          }
          res.send({"pagesNumber" : stdout});
        });
      }
      fs.unlinkSync(result.filename.replace(re,'/'));
    });
  });
});

// define the home page route
router.get('/', (req, res) => {
  pdf2html.html('../test/sample.pdf', (err, html) => {
      if (err) {
          console.error('Conversion error: ' + err)
      } else {
          console.log(html)
      }
  });
});

// define the about route
router.get('/about', function(req, res) {
  res.status(500).json({
      'error' : 'tout a cassé'
  });
});

// middleware for 404 err
router.use(function(req, res) {
  res.status(404).json({
      'status' : 404
  });
});


module.exports = router;