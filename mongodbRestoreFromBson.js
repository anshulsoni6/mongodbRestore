const { execSync } = require('child_process');
const fs = require('fs');

main();

function main() {
    try {
        let argv = process.argv.slice(2);
        let folderPath = argv[0];
        let dbName = argv[1];
        if (folderPath && typeof folderPath === 'string' && dbName && typeof dbName === 'string') {
            let files = findFilesInFolder(folderPath, '.bson');
            for (let index = 0; index < files.length; index++) {
                const bsonFilePath = `${folderPath}/${files[index]}`;
                const collectionName = files[index].split('.')[0];
                mongodbRestore(dbName, collectionName, bsonFilePath);
            }
        } else {
            throw 'Invalid folder path or database name \n ## Possible command :- \n node mongodbRestoreFromBson.js yourFolderPathContainingBsonFiles yourDbName';
        }

    } catch (error) {
        console.error('\x1b[31m', error);
    }
}

function findFilesInFolder(folderPath, fileExtension) {
    let allFiles = fs.readdirSync(folderPath);
    let files = [];
    for (let index = 0; index < allFiles.length; index++) {
        const element = allFiles[index];
        if (element.search(fileExtension) !== -1) {
            files.push(element);
        }

    }
    return files;
}

function mongodbRestore(dbName, collectionName, bsonFilePath) {
    execSync(`mongorestore -d ${dbName} -c ${collectionName} ${bsonFilePath}`);
    console.log('\x1b[32m', `Data restored from ${bsonFilePath}`);
}