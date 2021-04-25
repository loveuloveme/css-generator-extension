const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function getWebviewContent(context, panel) {
    function insertHead(html, data){
        let headIndex = html.indexOf('</head>');
        html = html.substr(0, headIndex)+data.toString()+ html.substr(headIndex);
        return html;
    }

    try{
        const htmlPath = path.join(__dirname, './webview/build/index.html');
        let html = fs.readFileSync(htmlPath).toString();

        const nonce = getNonce();

        //html = insertHead(html, `<base href="${vscode.Uri.file(path.join(context.extensionPath, 'webview')).with({ scheme: 'vscode-resource' })}/">`);
        //html = insertHead(html, `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-${nonce}';style-src vscode-resource: 'unsafe-inline' http: https: data:;"></meta>`);

        html = insertHead(html, `<script>window.acquireVsCodeApi = acquireVsCodeApi;</script>`);
        let hrefs = [...html.matchAll(/href=['"]([^'"]+?)['"]/g), ...html.matchAll(/src=['"]([^'"]+?)['"]/g)];

        hrefs.forEach(item => {
            html = html.replace(item[1], panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, `/webview/build${item[1]}`))));
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

module.exports = getWebviewContent;