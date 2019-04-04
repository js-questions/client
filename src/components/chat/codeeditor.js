/* ----------------------------------------------------------------
Codeeditor component:
This component displays the code editor within the chat component.
The editor is based on the Codemirror library
------------------------------------------------------------------- */

import React, { Component } from 'react';
import './chat.scss';

import CodeMirror from 'codemirror';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';

class CodeEditor extends Component {
  state = {
    keepChangeEditor: ''
  }
  textArea = React.createRef();
  checker = false;

  cursorPos = {
    line: 0,
    ch: 0
  }

  componentDidMount() {
    document.addEventListener('keyup', (e) => {
      this.checker = false;
      this.cursorPos = { ...this.codemirror.getCursor() }
    })

    document.addEventListener('keydown', (e) => {
      this.checker = true;
    })
    
    document.addEventListener('click', (e) => {
      this.cursorPos = { ...this.codemirror.getCursor() }
    })

    // Server sends editor code through socket io to all users.
    this.props.socket.on('editor', (data) => {
      this.codemirror.getDoc().setValue(data.code)
      this.codemirror.setCursor(this.cursorPos.line, this.cursorPos.ch);
    });

    // Set-up codemirror editor properties
    this.codemirror =  CodeMirror.fromTextArea(this.textArea.current, {
      mode: "javascript",
      theme: "midnight",
      lineNumbers: true,
      content: this.textArea.current,
    })

    // when a user types, call codeChanged function
    this.codemirror.on('change', this.codeChanged);

    // set editor theme
    this.codemirror.setOption('theme', 'material');

    // set editor size
    this.codemirror.setSize('65vw', '80vh');
  }

  codeChanged = () => {
    if (this.checker) {
      const editorContent = this.codemirror.getDoc().getValue();
      const data = { code: editorContent, room: this.props.room }

      // If the content of the editor has changed, emit data through socket io
      if (editorContent !== this.state.keepChangeEditor) {
        this.props.socket.emit('editor', data);
        this.setState({keepChangeEditor: this.codemirror.getDoc().getValue()});
      }
    }
    this.codemirror.focus();
  }

  // When the component unmounts, remove listener
  componentWillMount() {
    this.props.socket.removeListener('editor');
  }

  render() {
    return(
      <div className="editor">
        <textarea id="txtArea" name="txtArea"ref={this.textArea}/>
      </div>
    )
  }

}

export default CodeEditor;