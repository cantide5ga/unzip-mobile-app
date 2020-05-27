import React from 'react';
import { Text } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
// import { unzip } from 'react-native-zip-archive'
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import { Buffer } from 'buffer';
import Base64 from 'Base64';

const options: DocumentPicker.DocumentPickerOptions = {
    // type: 'application/zip',
    copyToCacheDirectory: false
}

export default class App extends React.PureComponent<Props> {
    constructor(props) {
        super(props)
    }

    public render() {
        return <Text onPress={this.getDocument}>Select zip file...</Text>
    }

    private getDocument(): Promise<DocumentPicker.DocumentResult> {
        DocumentPicker.getDocumentAsync(options)
            .then((result: DocumentPicker.DocumentResult) => {
                if('uri' in result) {
                    console.log(`${FileSystem.documentDirectory}${result.name}`);
                    // console.log(result.uri);
                    const zip = new JSZip();
                    //JSZipUtils.getBinaryContent(result.uri).

                    // FileSystem.getInfoAsync(`${FileSystem.documentDirectory}${result.name}`)
                    // FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}${result.name}`)
                    FileSystem.copyAsync({from: result.uri, to: `${FileSystem.documentDirectory}${result.name}`})
                    .then(() => {


                        FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}${result.name}`, {encoding: FileSystem.EncodingType.Base64 })
                        .then((data) => {

                            // console.log(data.toString());

                            zip.loadAsync(Base64.atob(data))
                            .then(content => {
                                Object.keys(content.files).forEach((filename) => {
                                    // console.log(file);
                                    zip.file(filename).async('binarystring')
                                    .then((content) =>{
                                        FileSystem.writeAsStringAsync(`${FileSystem.documentDirectory}${filename}`, content.toString())
                                        .then(() => {   
                                            FileSystem.copyAsync({from: `${FileSystem.documentDirectory}${filename}`, to: `${FileSystem.documentDirectory}${filename}`})
                                            .then(() => {
                                                console.log(`${FileSystem.documentDirectory}${filename} is DONE!!!`);
                                            })
                                        })
                                        .catch(() => {
                                            console.log('XXXXXXXXX');
                                        })
                                        
                                    })
                                    .catch((error) => {
                                        console.log(error)
                                    })
                                })
                                // zip.forEach(async (relPath, file) => {
                                //     console.log('file: ', file)
                                //     console.log('relativePath: ', relPath)
                                // });
                            })
                            .catch((error) => {
                                console.log(`ERROR is ${error}`)
                            });

                        // fetch(`${FileSystem.documentDirectory}${result.name}`)
                        //     .then(response => response.blob())
                        //     .then((blob) => {
                        //         const reader = new FileReader();
                        //         reader.readAsDataURL(blob);
                        //         reader.onloadend = () => {

                            //  JSZipUtils.getBinaryContent(`${FileSystem.documentDirectory}${result.name}`, (err, data) => {
                            //     if (err) {
                            //     //   reject(err)
                            //     console.log(`ERROR: ${err}`);
                            //     } else {
                            //     //   resolve(data)
                        //             console.log(reader.result);
                        //             console.log('^^^^^^^^^^');

                        //             JSZip.loadAsync(reader.result.toString().split(',')[1])
                        //             .then(content => {
                        //                 Object.keys(content.files).forEach((file) => {
                        //                     console.log(file);
                        //                 })
                        //             })
                        //             .catch((error) => {
                        //                 console.log(`ERROR is ${error}`)
                        //             });
                        //         // }
                        //     // })
                        //         }
                        });
                    });
                    
                    // FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}${result.name}`)
                    // .then((data) => {
                    //     JSZip.loadAsync(data)
                    //     .then(content => {
                    //         Object.keys(content.files).forEach((file) => {
                    //             console.log(file);
                    //         })
                    //     })
                    //     .catch((error) => {
                    //         console.log(`ERROR is ${error}`)
                    //     });
                    // })
                    //                 .catch((error) => {
                    //             console.log(`ERROR is ${error}`)
                    //         });

                    // JSZipUtils.getBinaryContent(`${FileSystem.documentDirectory}${result.name}`, (err, data) => {
                    //     if (err) {
                    //     //   reject(err)
                    //     console.log(`ERROR: ${err}`);
                    //     } else {
                    //     //   resolve(data)
                    //         JSZip.loadAsync(data)
                    //         .then(content => {
                    //             Object.keys(content.files).forEach((file) => {
                    //                 console.log(file);
                    //             })
                    //         })
                    //         .catch((error) => {
                    //             console.log(`ERROR is ${error}`)
                    //         });
                    // }
                    //   })

                    // zip.loadAsync(result.uri)
                    // .then(content => {
                    //     Object.keys(content.files).forEach((file) => {
                    //         console.log(file);
                    //     })
                    // })
                    // .catch((error) => {
                    //     console.log(`ERROR is ${error}`)
                    // });
                    
                    
                    // unzip(result.uri, FileSystem.documentDirectory)
                    // .then((path) => {
                    //     console.log(`unzipped at path ${path}`)
                    // })
                    // .catch((error) => {
                    //     console.log(`ERROR is ${error}`)
                    // })
                }

                //if(result.type = 'cancel')

                // console.log(FileSystem.documentDirectory);
                
                // if('uri' in result) {
                //     console.log('***********');
                //     console.log(result.uri);
                //     console.log(result.name);   
                //     console.log('***********');

                //     FileSystem.getInfoAsync(result.uri)
                //     .then(info => {
                //         console.log(info.uri);
                //         console.log(FileSystem.documentDirectory);
                //         console.log('^^^^^^^^^');
                //     })
                // }

                //import * as FileSystem from 'expo-file-system';

            });

        return null;
    }
}

type Props = {

}