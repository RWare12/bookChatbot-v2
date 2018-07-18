var mysql = require('mysql');

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "mydb"
});

// database SCHEMA
// CREATE TABLE userBook{
//   author VARCHAR,
//   book VARCHARR,
//   category VARCHAR,
//   img VARCHAR,
//   borrowBook INT,
//   fbID INT,
// };


//creating table for userBook
// con.connect(function(err) {
//   if (err) console.log(err);
//   console.log("Connected!");
//   var sql = "CREATE TABLE userBook (author VARCHAR(255), book VARCHAR(255), category VARCHAR(255), img VARCHAR(255), borrowBook INT)";
//   // var sql = "INSERT INTO userBook (author, book, category, img, borrowBook) VALUES ?";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Table created");
//   });
// });


// inserting fbID
// con.connect(function(err) {
//   if (err) console.log(err);
//   console.log("Connected!");
//   var sql = "UPDATE userBook SET fbID = 1721885347926612 WHERE book LIKE 'Goodnight Darth Vader'";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Table updated!");
//   });
// });




// creating table for facebook user pending............................... 'done'
// con.connect(function(err) {
//   if (err) console.log(err);
//   console.log("Connected!");
//   var sql = "ALTER TABLE userBook MODIFY fbID VARCHAR(255)";
//   con.query(sql, function (err, result) {
//     if (err) console.log(err);
//     console.log("Added Column!");
//   });
// });

//checking table
// con.connect(function(err) {
//   con.query("SELECT * FROM userBook", function (err, result, fields) {
//     console.log(result);
//   });
// });

// con.connect(function(err) {
//   if (err) throw err;
//   var sql = "DROP TABLE userBook";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Table deleted");
//   });
// });


// code below is for inserting data set from a csv file to the database
// var fs = require('fs');
// var csv = require('fast-csv');
// var values = [];
// var ctr = 0;

// con.connect(function(err) {
//   fs.createReadStream('datasample.csv')
//       .pipe(csv())
//       .on('data',function(data){
//           string = data;
//           if(string[6].includes("Comics")){
//             // console.log(string);
//             if(ctr < 20){
//               values.push(string[4],string[3],string[6],string[2],0);
//               // console.log(ctr);
//               console.log(string[4],string[3],string[6],string[2],0);
//                 if (err) console.log(err);
//                 console.log("Connected!");
//                 var sql = `INSERT INTO userBook (author, book, category, img, borrowBook) VALUES ("${string[4]}","${string[3]}","${string[6]}","${string[2]}",0)`;
//                 con.query(sql, function (err, result) {
//                   if (err) console.log(err);
//                   console.log("1 record inserted");
//                 });
              
//             }
          
//             ctr++;
//           }
          
//       })
//       .on('end',function(data){
//           console.log('Read Finished')
//           // console.log(string[3]);
//           console.log(values);
//           console.log("values: ", values.length);
//           console.log(ctr);
//       })
//     });