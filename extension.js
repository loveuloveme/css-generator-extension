const vscode = require('vscode');
const getWebviewContent = require('./webview');

const SidebarProvider = require('./SideBarProvider');

function activate(context) {
    var panel = undefined;
    var position = undefined;
    var lastPosition = undefined;
    var editor = undefined;
    var editByExt = true;

    var events = [];


    const sidebarProvider = new SidebarProvider(context);

    const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right
    );
    item.text = "$(beaker) Add Todo";
    item.command = "vstodo.addTodo";
    item.show();

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider("vstodo-sidebar", sidebarProvider)
    );
    
    let initWebViewPanel = () => {
        panel = vscode.window.createWebviewPanel(
            'css-generator',
            'CSS Gradient Background',
            vscode.ViewColumn.Nine,
            {
                enableScripts: true
            }
        );

        let html = getWebviewContent(context, panel);
        panel.webview.html = html;

        let firstTime = true;

        function parseCode(code, position){
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
        editByExt = true;

        if(!!panel){
            panel.dispose();
        }

        initWebViewPanel();

        events.push(
            vscode.workspace.onDidChangeTextDocument(() => {
                if(editByExt){
                    editByExt = false;
                }else{
                    panel.dispose();
                }
            }, null, context.subscriptions)
        );

        events.push(
            vscode.workspace.onDidCloseTextDocument(() => {
                panel.dispose();
            }, null, context.subscriptions)
        );

        events.push(
            vscode.workspace.onDidOpenTextDocument(() => {
                panel.dispose();
            }, null, context.subscriptions)
        );

	});

    context.subscriptions.push(createEditorWindow);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}