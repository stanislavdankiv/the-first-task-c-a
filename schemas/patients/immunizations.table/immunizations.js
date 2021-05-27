const fs = require('fs');
const csv = require('fast-csv');
const {v4: uuidv4} = require('uuid');
const randomDatetime = require('random-datetime');
const {connectDB} = require('../../../config/db.config');

function conversionCsv(csvData) {
    let result = [];
    for (let row of csvData) {
        let origin = ['name1', 'name2', 'name3', 'name4', 'name5'];
        let originRandom = origin[Math.floor(Math.random() * 5)];
        let status = [true, false];
        let statusRandom = status[Math.floor(Math.random() * 2)];
        const newResult = [uuidv4(), row[4], originRandom, statusRandom, randomDatetime(), row[2], row[1], randomDatetime(), randomDatetime()];
        result.push(newResult);
    }
    return result;
}

// Import CSV Data to MySQL database
importCsvData2MySQL('/home/stanislav/Desktop/testdb/csv/immunizations.csv');

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
                    let query = 'INSERT INTO immunizations (uuid, vaccine, origin, status, occur_date, provider_uuid, patient_uuid, createdAt, updatedAt)VALUES ?';
                    connection.query(query, [conversionCsv(csvData)], (error, response) => {
                        console.log(error || response);
                    });
                }
            });
        });
    stream.pipe(csvStream);
}