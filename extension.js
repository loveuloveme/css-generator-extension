const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
    var panel = undefined;
    var position = undefined;
    var lastPosition = undefined;
    var editor = undefined;
    var editByExt = false;

    var events = [];
    
	let disposable = vscode.commands.registerCommand('css-generator.helloWorld', function () {
		vscode.window.showInformationMessage('Hello World from css-generator!');
	});

    let initWebViewPanel = () => {
        panel = vscode.window.createWebviewPanel(
            'catCoding',
            'CSS Gradient Background',
            vscode.ViewColumn.Eight,
            {
                enableScripts: true
            }
        );

        let html = getWebviewContent(context, panel);
        panel.webview.html = html;

        let firstTime = true;

        function parseCode(code, position){
            let start = position.character;
            let strings = code.split(/\n/g);
            let tab = new Array(position.character + 1).join(' ');
            
            return strings.join('\n'+tab);
        }

        panel.webview.onDidReceiveMessage(
            message => {
                if(message.command == 'css-code'){
                    if(firstTime){
                        editor.edit(editBuilder => {
                            editByExt = true;
                            editBuilder.insert(position, parseCode(message.text, position));
                            lastPosition = position.with(position.line + 2, position.character + message.text.length);
                        });
                        firstTime = false;
                    }else{
                        editor.edit(editBuilder => {
                            editByExt = true;
                            editBuilder.replace(new vscode.Range(position, lastPosition), parseCode(message.text, position) );
                            lastPosition = position.with(position.line + 2, position.character + message.text.length);
                        });
                    }
                }
            },
            undefined,
            context.subscriptions
        );

        panel.onDidDispose(
            () => {
                console.log('Dispose');
                panel = undefined;
                events.forEach(e => e.dispose());
                events = [];
            },
            null,
            context.subscriptions
        );
    };
    
    let createEditorWindow = vscode.commands.registerCommand('css-generator.openEditor', function (){
        editor = vscode.window.activeTextEditor;
        position = editor.selection.active;
        lastPosition = undefined;
        editByExt = false;

        if(!!panel){
            console.log('used');
            panel.dispose();
        }

        initWebViewPanel();

        events.push(
            vscode.workspace.onDidChangeTextDocument(() => {
                console.log('onDidChangeTextDocument', editByExt);
                if(editByExt){
                    editByExt = false;
                }else{
                    panel.dispose();
                }
            }, null, context.subscriptions)
        );

        events.push(
            vscode.workspace.onDidCloseTextDocument(() => {
                console.log('onDidCloseTextDocument');
                panel.dispose();
            }, null, context.subscriptions)
        );


        events.push(
            vscode.workspace.onDidOpenTextDocument(() => {
                console.log('onDidOpenTextDocument');
                panel.dispose();
            }, null, context.subscriptions)
        );

	});

	context.subscriptions.push(disposable);
    context.subscriptions.push(createEditorWindow);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}

function getWebviewContent(context, panel) {
    function insertHead(html, data){
        let headIndex = html.indexOf('</head>');
        html = html.substr(0, headIndex)+data.toString()+ html.substr(headIndex);
        return html;
    }

    try{
        const htmlPath = path.join(__dirname, './webview_/build/index.html');
        let html = fs.readFileSync(htmlPath).toString();

        const nonce = getNonce();

        //html = insertHead(html, `<base href="${vscode.Uri.file(path.join(context.extensionPath, 'webview_')).with({ scheme: 'vscode-resource' })}/">`);
        //html = insertHead(html, `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-${nonce}';style-src vscode-resource: 'unsafe-inline' http: https: data:;"></meta>`);

        html = insertHead(html, `<script>window.acquireVsCodeApi = acquireVsCodeApi;</script>`);
        let hrefs = [...html.matchAll(/href=['"]([^'"]+?)['"]/g), ...html.matchAll(/src=['"]([^'"]+?)['"]/g)];

        hrefs.forEach(item => {
            html = html.replace(item[1], panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, `/webview_/build${item[1]}`))));
        });

        return html;
    }catch (e){
        return `Error getting HTML for web view: ${e}`;
    }
}

function getNonce() {
	let text = "";
	const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}