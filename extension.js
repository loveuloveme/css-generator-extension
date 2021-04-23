const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
    
	let disposable = vscode.commands.registerCommand('css-generator.helloWorld', function () {
		vscode.window.showInformationMessage('Hello World from css-generator!');
	});
    
    let createEditorWindow = vscode.commands.registerCommand('css-generator.openEditor', function () {
		const panel = vscode.window.createWebviewPanel(
            'catCoding',
            'CSS Gradient Background',
            vscode.ViewColumn.Five,
            {
                enableScripts: true
            }
        );

        let html = getWebviewContent(context, panel);
        panel.webview.html = html;
        panel.webview.onDidReceiveMessage(
            message => {
                console.log(message);
            },
            undefined,
            context.subscriptions
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