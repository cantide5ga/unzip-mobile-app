import React from 'react';
import { Platform,
    View,
    ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import JSZip from 'jszip';
import Base64 from 'Base64';
import { FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

const DIR = FileSystem.documentDirectory
const options: DocumentPicker.DocumentPickerOptions = {
    // type: 'application/zip',
    copyToCacheDirectory: false
}

export default class App extends React.PureComponent<Props> {
    constructor(props) {
        super(props)
    }

    public render() {
        return ( 
            <View>
                <FontAwesome.Button 
                    name="file-zip-o" 
                    onPress={this.getDocument}
                >
                    UnZIP file...
                </FontAwesome.Button>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    private async getDocument() {
        const result = await DocumentPicker.getDocumentAsync(options);
        if('uri' in result) {
            const fileUri = `${DIR}${result.name}`
            
            // a pick from the DocumentPicker needs to be made useable depending on platform
            // i.e. https://forums.expo.io/t/read-a-contents-from-dropbox-with-documentpicker-filesystem/1976/10
            if(Platform.OS = 'android') {
                await FileSystem.copyAsync({
                    from: result.uri,
                    to: fileUri
                })
            }
            // TODO: ios, web

            const data = await FileSystem.readAsStringAsync(fileUri, {
                encoding: FileSystem.EncodingType.Base64
            })

            const zip = new JSZip();
            const decoded = Base64.atob(data);
            const content = await zip.loadAsync(decoded)

            // TODO: 
            // zip.forEach(async (relPath, file) => {
            //     console.log('file: ', file)
            //     console.log('relativePath: ', relPath)
            // });
            Object.keys(content.files)
            .forEach(async (filename) => {
                const file = await zip.file(filename).async('base64');

                await FileSystem.writeAsStringAsync(`${DIR}${filename}`, file)

                console.log(`${DIR}${filename}`);
                await WebBrowser.openBrowserAsync(`${DIR}${filename}`);
            })
        }
    }
}

type Props = {

}