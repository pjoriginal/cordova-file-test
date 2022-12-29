/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    const e = console.error;
    const log = console.log;
    log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
    // get Directory Entry
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, directoryEntry => {
        log('directoryEntry', directoryEntry);

        // make a file called test.txt
        directoryEntry.getFile('test.txt', { create: true, exclusive: false }, (fileEntry) => {
            log('fileEntry', fileEntry);
            // get file Metadata
            fileEntry.getMetadata(metadata => log('filemetadata', metadata), e);

            // write to file
            writeToFile(fileEntry)
            .then(() => {
                readFile(fileEntry).then(data => console.log('read data', data));
                fileEntry.copyTo(directoryEntry, 'test-copy.txt', newFileEntry => console.log('copied file', newFileEntry), e);

                fileEntry.moveTo(directoryEntry, 'test-move.txt', newFileEntry => console.log('moved file', newFileEntry), e )

            }).catch(e);
            
        }, e);
        // make a directory inside the current directory
        directoryEntry.getDirectory('test', {create: true, exclusive: false}, dirEntry => {
            log('dirEntry inside directoryEntry', dirEntry);
            dirEntry.getParent((parent) => log('parent', parent), e);
        }, e);

        // create a reader
        const reader = directoryEntry.createReader()
        log('reader', reader);

        // get all the Files inside the current directory
        reader.readEntries(entries => log('entries in dirEntry', entries), e);
    }, e);

    log('directories', cordova.file);
}

function writeToFile(fileEntry) {
    return new Promise((resolve,reject) => {
        fileEntry.createWriter(writer => {
            writer.onwriteend = () => {console.log('written to file'); resolve('written to file')}
            writer.onerror = err => reject(err);
            dataObj = new Blob(['A test sentence'], { type: 'text/plain' });
            writer.write(dataObj);
        }, reject);
    })
}

function readFile(fileEntry) {
    return new Promise((resolve, reject) => {
        fileEntry.file(function (file) {
            var reader = new FileReader();
            console.log({file});
            reader.onloadend = function() {
                resolve(this.result);
            };
    
            reader.readAsText(file);
    
        }, reject);
    })
}