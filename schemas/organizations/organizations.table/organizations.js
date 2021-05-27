const fs = require('fs');
const csv = require('fast-csv');
const {connectDB} = require('../../../config/db.config');
const randomNumber = require('random');
const shortid = require('shortid');
const randomDatetime = require('random-datetime');

function conversionCsv(csvData) {
    let result = [];
    for (let row of csvData) {
        const email = (randomNumber.int((min = 10000), (max = 90000))) + '@gmail.com';
        const newResult = [row[0], row[1], email, row[8], row[2], shortid(), randomDatetime(), randomDatetime()];
        result.push(newResult);
    }
    return result;
}

// Import CSV Data to MySQL database
importCsvData2MySQL('/home/stanislav/Desktop/testdb/csv/organizations.csv');

function importCsvData2MySQL(filename) {
    let stream = fs.createReadStream(filename);
    let csvData = [];
    let csvStream = csv
        .parse()
        .on("data", function (data) {
            csvData.push(data);
        })
        .on("end", function () {
            // -> Remove Header ROW
            csvData.shift();
            /// -> Create a connection to the database
            const connection = connectDB({database: 'organizations'});
            console.log(conversionCsv(csvData));
            // Open the MySQL connection
            connection.connect((error) => {
                if (error) {
                    console.error(error);
                } else {
                    let query = 'INSERT INTO organizations (uuid, name, email, phone, address, external_id, createdAt, updatedAt)VALUES ?';
                    connection.query(query, [conversionCsv(csvData)], (error, response) => {
                        console.log(error || response);
                    });
                }
            });
        });
    stream.pipe(csvStream);
}