import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './components/App';

var vscode;

try{
    vscode = window.acquireVsCodeApi();
}catch(e){

}

ReactDOM.render(
    <React.StrictMode>
        <App vscode={vscode} />
    </React.StrictMode>,
    document.getElementById('root')
);