const vscode = require('vscode');
const getWebviewContent = require('./webview');
const fs = require('fs');
const path = require('path');

class SidebarProvider{
    panel;
    document;
    context;

    constructor(context){
        this.context = context;
    }

    resolveWebviewView(webviewView, context, token){
        this.panel = webviewView;

        webviewView.webview.options = {
            enableScripts: true
        };
    
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    
        webviewView.webview.onDidReceiveMessage(data => {
            console.log(data);
        });
    }

    revive(panel) {
        webView = panel;
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