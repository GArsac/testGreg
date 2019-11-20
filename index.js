const express = require('express')
const app = express();
const https = require('https');

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '100mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

// Routes pour /secret
var secrets = require('./app/secret');
app.use('/secret', secrets);

app.get('/', (req, res) => {
    var euhpkpa = {'test3' : 'lol'}
    var returnedJson = {'test' : {'test2' : 'lol', 'wouech' : 'salut'}}
    returnedJson.test.test2 = {'test3' : 'lol'}
    returnedJson.added = [
        'Encore', 
        {
            'test' : 42, 
            'euh' : '69',
            'tab' : [
                {
                    'vide' : true
                }, 
                {
                    'vide' : true
                }, 
                {
                    'vide' : false,
                    'data' : {
                        'Je suis les données' : 648624861684
                    }
                },
                {}, 
                null
            ]
        }, 
        [5, 3, 6], 
        5
    ]
    res.json(returnedJson)
});

app.listen(8000, () => {
    console.log('Example app listening on port 8000!')
});