const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

class SidebarProvider{
    panel;
    context;
    position;
    lastPosition;
    editor;
    editByExt = true;
    firstTime = true;
    webviewReady = false;

    constructor(context){
        this.context = context;
    }

    _parseCode = (code, position) => {
        let strings = code.split(/\n/g);
        let tab = new Array(position.character + 1).join(' ');
        
        return strings.join('\n' + tab);
    }

    _default(){
        this.position = undefined;
        this.lastPosition = undefined;
        this.editor = undefined;

        this.editByExt = true;
    }

    resolveWebviewView(webviewView, context, token){
        this.panel = webviewView;

        webviewView.webview.options = {
            enableScripts: true
        };
    
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        vscode.workspace.onDidChangeTextDocument(e => {
            if(e.contentChanges.length == 0) return;
            if(e.document.uri != this.editor.document.uri) return;

            if(this.editByExt){
                this.editByExt = false;
            }else{
                this._documentChanged('didchange');
            }
        }, null, this.context.subscriptions);

        vscode.workspace.onDidCloseTextDocument(() => {
            this._documentChanged('close');
        }, null, this.context.subscriptions);

        vscode.workspace.onDidOpenTextDocument(() => {
            this._documentChanged('open');
        }, null, this.context.subscriptions);



        this.panel.webview.onDidReceiveMessage(
            message => {
                switch(message.command){
                    case 'css-code':
                        this._putCode(message);
                        break;
                    case 'gui-ready':
                        this.webviewReady = true;
                }
            },
            undefined,
            context.subscriptions
        );
    }

    _putCode(message){
        this.editor.edit(editBuilder => {
            this.editByExt = true;
            editBuilder.replace(this.lastPosition ? new vscode.Range(this.position, this.lastPosition) : this.position, this._parseCode(message.text, this.position));
            this.lastPosition = this.position.with(this.position.line + 2, this.position.character + message.text.length);
        });
    }

    revive(panel){
        this.panel = panel;
    }

    setEditor(editor){
        if(this.panel === undefined || !this.panel.visible){
            vscode.window.showInformationMessage('Sidebar should be opened first');
            return;
        }
        
        this._default();

        this.editor = editor;
        this.position = this.editor.selection.start;

        if(this.editor.selection.start == this.editor.selection.end){
            return;
        }

        let selection = this.editor.selection;
        let text = this.editor.document.getText(selection);
        this.lastPosition = selection.end;
        var values = {
            values: [],
            arg: null,
            type: -1
        };
        
        if(text != ''){
            let textMatch = text.replace(/\(.*\)/g, '').replace(/\n| |\r/g, '');
            
            values.type = (textMatch.search("background:-moz-linear-gradient;background:-webkit-linear-gradient;background:linear-gradient;") != -1) ? 0 : -1;

            if(values.type == -1){
                values.type = (textMatch.search("background:-moz-radial-gradient;background:-webkit-radial-gradient;background:radial-gradient;") != -1) ? 1 : -1;
            }


            let params = [...text.matchAll(/\(.*\)/g)];

            params.forEach((param, index) => {
                if(index != 0) return;

                let text = param[0].replace(/\n| |\r/g, '');

                let data = [...(text.matchAll(/rgba\([0-9]+,[0-9]+,[0-9]+,[0-9]+\)[0-9]+%/g))];
                
                let arg = text.replace(/ /g, '').split(',');
                if(arg[0].search('deg') != -1){
                    values.arg = parseInt(arg[0].substr(1, arg[0].length).replace('deg', '')); 
                }else{
                    values.arg = arg[0].substr(1, arg[0].length); 
                }

                data.forEach(item => {
                    item = item[0];

                    // if(index != 1) return;

                    let color = (item.split(')')[0]+')');
                    color = color.substring(4, color.length-1).replace(/ /g, '').split(',');
                    let x = parseInt(item.split(')')[1].replace('%', ''));

                    values.values.push({
                        x: x,
                        r: parseInt(color[0].substr(1, color[0].length)),
                        g: parseInt(color[1]),
                        b: parseInt(color[2]),
                        a: parseInt(color[3])
                    });
                })
            });

            this._sendData(values);
        }else{
            this.panel.webview.postMessage({command: 'editor-changed'});
        }
    }

    _sendData(data){
        this.panel.webview.postMessage({command: 'editor-data', data: data});
    }

    _documentChanged(a){
        this.panel.webview.postMessage({command: 'editor-lost'});
    }

    _getHtmlForWebview(){
        function insertHead(html, data){
            let headIndex = html.indexOf('</head>');
            html = html.substr(0, headIndex)+data.toString()+ html.substr(headIndex);
            return html;
        }
    
        try{
            const htmlPath = path.join(__dirname, './webview/build/index.html');
            let html = fs.readFileSync(htmlPath).toString();
    
            // const nonce = getNonce();
    
            html = insertHead(html, `<script>window.acquireVsCodeApi = acquireVsCodeApi;</script>`);
            let hrefs = [...html.matchAll(/href=['"]([^'"]+?)['"]/g), ...html.matchAll(/src=['"]([^'"]+?)['"]/g)];
    
            hrefs.forEach(item => {
                html = html.replace(item[1], this.panel.webview.asWebviewUri(vscode.Uri.file(path.join(this.context.extensionPath, `/webview/build${item[1]}`))));
            });
    
            return html;
        }catch (e){
            return `Error getting HTML for web view: ${e}`;
        }
    }
}

module.exports = SidebarProvider;