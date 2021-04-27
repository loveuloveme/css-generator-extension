const vscode = require('vscode');
const SidebarProvider = require('./SideBarProvider');

function activate(context) {
    const sidebarProvider = new SidebarProvider(context);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('css-generator-sidebar-view', sidebarProvider)
    );
    
    let createEditorWindow = vscode.commands.registerCommand('css-generator.openEditor', function (){
        //vscode.commands.executeCommand('workbench.action.toggleSidebarVisibility');
        sidebarProvider.setEditor(vscode.window.activeTextEditor);
	});

    context.subscriptions.push(createEditorWindow);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}