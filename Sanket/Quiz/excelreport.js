// // import { getCLS, getFID, getLCP } from 'web-vitals';
// const { getCLS, getFID, getLCP } = require('web-vitals');


// // getCLS(console.log);
// // getFID(console.log);
// // getLCP(console.log);



// const XLSX = require("xlsx");
// const fs = require("fs");

// const FILE_PATH = "quiz_results.xlsx";

// function saveToExcel(data) {
//     let workbook, worksheet;
    
//     if (fs.existsSync(FILE_PATH)) {
//         workbook = XLSX.readFile(FILE_PATH);
//         worksheet = workbook.Sheets["Results"];
//     } else {
//         workbook = XLSX.utils.book_new();
//         worksheet = XLSX.utils.json_to_sheet([]);
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
//     }

//     const jsonData = XLSX.utils.sheet_to_json(worksheet);
//     jsonData.push(data);
//     const newSheet = XLSX.utils.json_to_sheet(jsonData);
//     workbook.Sheets["Results"] = newSheet;
//     XLSX.writeFile(workbook, FILE_PATH);
// }

// module.exports = { saveToExcel };


const ExcelJS = require("exceljs");
const fs = require("fs");

const FILE_PATH = "quiz_results.xlsx";

async function saveToExcel(data) {
    let workbook = new ExcelJS.Workbook();

    // Load existing file if it exists
    if (fs.existsSync(FILE_PATH)) {
        await workbook.xlsx.readFile(FILE_PATH);
    } else {
        const worksheet = workbook.addWorksheet("Results");
        worksheet.columns = [
            { header: "Username", key: "username", width: 20 },
            { header: "Topic", key: "topic", width: 20 },
            { header: "Score", key: "score", width: 10 },
            { header: "Total Questions", key: "totalQuestions", width: 15 },
        ];
    }

    const worksheet = workbook.getWorksheet("Results") || workbook.addWorksheet("Results");

    // Add a new row with user data
    worksheet.addRow({
        username: data.username,
        topic: data.topic,
        score: data.score,
        totalQuestions: data.totalQuestions
    });

    // Save the file
    await workbook.xlsx.writeFile(FILE_PATH);
}

module.exports = { saveToExcel };
