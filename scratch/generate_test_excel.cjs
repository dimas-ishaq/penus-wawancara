const xlsx = require('xlsx');
const path = require('path');

const data = [
  { NIS: '1234567890', Nama: 'Test Student 1', Kelas: 'XII RPL 1', Jurusan: 'RPL', Status: 'Lulus' },
  { NIS: '0987654321', Nama: 'Test Student 2', Kelas: 'XII RPL 2', Jurusan: 'RPL', Status: 'Tidak Lulus' }
];

const ws = xlsx.utils.json_to_sheet(data);
const wb = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(wb, ws, 'Students');

const filePath = path.join(__dirname, 'test_import.xlsx');
xlsx.writeFile(wb, filePath);

console.log(`Test Excel file created at: ${filePath}`);
