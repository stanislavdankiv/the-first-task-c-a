const fs = require('fs');
const csv = require('fast-csv');
const randomDatetime = require('random-datetime');
const randomNumber = require('random');
const {connectDB} = require('../../../config/db.config');

function conversionCsv(csvData) {
    let result = [];
    for (let row of csvData) {
        let email = row[7] + row[8] + '@gmail.com';
        const phone = ('+1') + (randomNumber.int((min = 1000000000), (max = 9000000000)));
        const newResult = [row[0], '', row[7], '', row[8], email, phone, row[14], row[1], '', row[16], '', randomDatetime(), randomDatetime()];
        result.push(newResult);
    }
    return result;
}

// Import CSV Data to MySQL database
importCsvData2MySQL('/home/stanislav/Desktop/testdb/csv/patients.csv');

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
            const connection = connectDB({database: 'patients'});
            console.log(conversionCsv(csvData));
            // Open the MySQL connection
            connection.connect((error) => {
                if (error) {
                    console.error(error);
                } else {
                    let query = 'INSERT INTO patients (uuid, identifier, first_name, middle_name, last_name, email, phone, gender, birth_date, photo, address, blood_group, createdAt, updatedAt)VALUES ?';
                    connection.query(query, [conversionCsv(csvData)], (error, response) => {
                        console.log(error || response);
                    });
                }
            });
        });
    stream.pipe(csvStream);
}