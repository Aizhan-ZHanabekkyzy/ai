var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var decoration = [];
var decorationNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){
	res.send("The most beautiful ornament");
});

app.get('/decoration', function(req, res){
	var queryParams = req.query;
	var filteredDecoration = decoration;

	if(queryParams.hasOwnProperty('onSale') && queryParams.onSale === 'true'){
		filteredDecoration = _.where(filteredDecoration, {onSale: true});
	} else if(queryParams.hasOwnProperty('onSale') && queryParams.onSale === 'false'){
		filteredDecoration = _.where(filteredDecoration, {onSale: false});
	}

	res.json(filteredDecoration);
});

app.get('/decoration/:id', function(req,res){
	var decorationId = parseInt(req.params.id, 10);
	var matchedDecoration = _.findWhere(decoration, {id:  decorationId});

	if(matchedDecoration){
		res.json(matchedDecoration);
	} else{
		res.status(404).send();
	}
});


app.post('/decoration', function(req, res){
	var body = _.pick(req.body, 'name', 'description','carat', 'brand', 'onSale', 'price');
	if(!_.isBoolean(body.onSale) || !_.isString(body.name) || body.name.trim().length ===0){
		return res.status(400).send();
	}

    body.name = body.name.trim();
	body.id = decorationNextId++;
	decoration.push(body);
	res.json(body);

});

app.delete('/decoration/:id', function(req, res){
	var  decorationId = parseInt(req.params.id,10);
	var matchedDecoration = _.findWhere(decoration, {id:  decorationId});

	if(!matchedDecoration){
		res.status(404).json({"error": "no decoration found with that id"});
	}else{
		decoration = _.without(decoration, matchedDecoration);
		res.json(matchedDecoration);
	}
});

app.listen(PORT, function(){
	console.log('Express listening on port '+PORT+'!');
});