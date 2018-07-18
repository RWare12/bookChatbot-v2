import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';

const fetch = require('node-fetch');
var mysql = require('mysql');
var bodyParser = require('body-parser');

const con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "root",
	database: "mydb"
  });

//~~ table used 'userBook'. Code below is to check for the data in database.
con.connect(function(err) {
	if (err) console.log(err);
	console.log("Connected!");
	con.query("SELECT * FROM userBook", function (err, result, fields) {
	if (err) console.log(err);
	console.log(result);
	console.log(result.length);
	});
});

// to return the control to book chat bot from alarm bot
export function takeThreadControl(req,res) {

	var body = {
		"recipient":{"id":req.body.originalDetectIntentRequest.payload.data.sender.id},
		"metadata":"String to pass to the secondary receiver"  
	 };
	fetch('https://graph.facebook.com/v2.6/me/take_thread_control?access_token=EAAZAGOggDwlIBAAaaDStAkKS38dYWzm9uppiOZBv2lMJQmRhX29YAcc0YmZA4ZCAUNzgY7BeZBaZCmP1vBf04YadbJ7CZAUFyoOim1sp4WXFuXHtFrF84p86gZAljMosuigHsS0aGvWeyeDBUOwU5GUEzRpGDcX64VqPLdhtMKxzeQZDZD', { 
		method: 'POST',
		body:    JSON.stringify(body),
		headers: { 'Content-Type': 'application/json' },
	})
		.then(res => res.json())
		.then(json => console.log(json));

	res.json({"fulfillmentText": "Passed control to Book bot"});
}

// function for passing the control to alarm bot
export function passThreadControl(req,res) {
	var body = { 
		"recipient":{"id":req.body.originalDetectIntentRequest.payload.data.sender.id},
		"target_app_id":646775079012691, // the ID of the app from developers.facebook.com that you want to pass to and must be subscribed to the page
		"metadata":"String to pass to secondary receiver app" 
	 };
	fetch('https://graph.facebook.com/v2.6/me/pass_thread_control?access_token=EAAZAGOggDwlIBAAaaDStAkKS38dYWzm9uppiOZBv2lMJQmRhX29YAcc0YmZA4ZCAUNzgY7BeZBaZCmP1vBf04YadbJ7CZAUFyoOim1sp4WXFuXHtFrF84p86gZAljMosuigHsS0aGvWeyeDBUOwU5GUEzRpGDcX64VqPLdhtMKxzeQZDZD', { 
		method: 'POST',
		body:    JSON.stringify(body),
		headers: { 'Content-Type': 'application/json' },
	})
		.then(res => res.json())
		.then(json => console.log(json));

	res.json({"fulfillmentText": "Passed control to alarm bot"});
}

export default ({ config, db }) => {
	let api = Router();
	api.use(bodyParser.urlencoded());
	api.use(bodyParser.json());

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	//for alarm bot chat using the pass thread control
	api.post('/alarm', (req, res) => {
		const data = req.body.originalDetectIntentRequest.payload.sender.id;
		console.log(data);
		let action = req.body.queryResult.action;
		console.log("action in alarm: ", action);
		if(action === 'takeThreadControl'){
			takeThreadControl(req,res);
		}
		console.log(req.body);
	});
	
	//for book bot chat
	api.post('/post', (req, res) => {
		const action = req.body.queryResult.action;
		const searchBook = req.body.queryResult.parameters.searchBook;
		const bookCategory = req.body.queryResult.parameters.bookCategory;
		const getAuthor = req.body.queryResult.parameters.getAuthor;
		const borrowBookv = req.body.queryResult.parameters.borrowBook;

		// test actions for "Action"
		const addBook = req.body.queryResult.parameters.addBook;
		const addAuthor = req.body.queryResult.parameters.addAuthor;
		var botMessage = "";

		console.log(action);

		// actions that will be received from dialogflow that are named in the "Action and Parameters" section
		switch(action){
			case 'Category':
					con.connect(function(err) {
						console.log("Connected!");
						console.log("err ", err);
						con.query(`SELECT book, author, category FROM userBook WHERE category LIKE '%${bookCategory}%'`, function (err, result, fields) {
						if(err){
							console.log(err);
						}
						if(result.length > 0){
							for(var i = 0; i < Math.floor(result.length/2);i++){
								botMessage += `Book Title: "${result[i].book}" \nAuthor: "${result[i].author}"\n\n`
							}
							res.json({"fulfillmentText" : botMessage});
						}else{
							res.json({"fulfillmentText" : "The category you were looking for is not available. :("});
						}
					});
				});
				break;

			case 'searchBook':
					con.connect(function(err) {
						var quickReplies = [];
						console.log("Connected!");
						con.query(`SELECT book, author FROM userBook WHERE book LIKE '%${searchBook}%'`, function (err, result, fields) {
						if(err){
							console.log(err);
						}
						console.log("result.length: ", result.length);
						
						if(result.length > 0){
							for(var i = 0; i < result.length;i++){
								botMessage += `Book Title: "${result[i].book}" \nAuthor: "${result[i].author}"\n\n`
								quickReplies.push("borrow " + result[i].book);
							}
							console.log(result);
							console.log("botMessage: ", botMessage);
							// res.json({"fulfillmentText" : botMessage});
							botMessage += "Just choose the books you want to borrow. :D	";
							res.json({"fulfillmentMessages": [{
								"quickReplies": {
								"title": botMessage,
								"quickReplies": quickReplies
							  },
								"platform": "FACEBOOK"
							}]
						})

						}else{
							res.json({"fulfillmentText" : "The book you were looking for is not available. :("});
						}
					});
				});
				break;

			case 'getAuthor':
					//... search author
					con.connect(function(err) {
						console.log("Connected!");
						con.query(`SELECT book, author, img FROM userBook WHERE author LIKE '%${getAuthor[0]}%'`, function (err, result, fields) {
						console.log("result.length: ", result.length);
						if(result.length > 0){
							for(var i = 0; i < result.length;i++){
								botMessage += `Found author "${result[i].author}" with the book "${result[i].book}"\n\n`
							}
							console.log(result);
							console.log("botMessage: ", botMessage);
							var textReply = "borrow " + result[0].book;
							res.json({"fulfillmentMessages" :[{
								"card": {
								  "title": result[0].book,
								  "subtitle": result[0].author,
								  "imageUri": result[0].img,
								  "buttons": [
									{
									  "text": textReply
									}
								  ]
								},
								"platform": "FACEBOOK"
							  }] 
							});
						
						}else{
							res.json({"fulfillmentText" : "The author you were looking for is not available. :("});
						}
					});
				});
				break;

			case 'addBook':
					botMessage = `adding book, Title: ${addBook}, Category: ${bookCategory}, author: ${addAuthor}.`
					res.json({"fulfillmentText" : botMessage});
				break;

			case 'borrowBook':
					console.log("In borrowBook");
					botMessage = `In borrowBook! ${borrowBookv}`;
					
					con.connect(function(err) {
						console.log("Connected!");
						console.log("err ", err);
						con.query(`SELECT author, book, borrowBook FROM userBook WHERE book LIKE '%${borrowBookv}%'`, function (err, result, fields) {
							if(err){
								console.log(err);
							}
							if(result[0].borrowBook === 0){
								var sql = `UPDATE userBook SET borrowBook = 1, fbID = ${req.body.originalDetectIntentRequest.payload.data.sender.id} WHERE book LIKE '%${borrowBookv}%'`;
								con.query(sql, function (err, result) {
									botMessage = "You've borrowed the book.";
									res.json({"fulfillmentText" : botMessage});
								});
							}else{
								botMessage = "Book is unavailable or being borrowed.";
								res.json({"fulfillmentText" : botMessage});
							}
							console.log(result[0].borrowBook);
							console.log("hello");
					});
				});
				break;

			case 'showBorrowBook':
					botMessage = "Borrowed book's:\n";
					con.connect(function(err) {
						console.log("Connected!");
						con.query("SELECT author, book, borrowBook, fbID FROM userBook WHERE borrowBook = 1", function (err, result, fields) {
							console.log(result);
							console.log(result.length);
							for(var i = 0; i < result.length; i++){
								botMessage += `Book: "${result[i].book}"\nAuthor: "${result[i].author}\n\n` ;
							}
							if(result.length > 0){
								res.json({"fulfillmentText" : botMessage});
							}else{
								res.json({"fulfillmentText" : "You have not yet borrowed a book."});
							}
						});
					});
					console.log(req.body.originalDetectIntentRequest.payload.data.sender.id);
				break;

			case 'passThreadControl':
					passThreadControl(req,res);
				break;

		}
		// console.log(req.body.originalDetectIntentRequest.payload.data);
		// console.log(req);
		// .........................................................................................................................//
	});

	api.get('/', (req, res) => {
		const data = req.body;
		console.log(data);
		return res.json({data});
	});




	return api;	
}