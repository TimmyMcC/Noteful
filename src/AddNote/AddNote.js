import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import NoteContext from '../NoteContext'
import config from '../config'
import PropTypes from 'prop-types'

export default class AddNote extends Component {
  static defaultProps = {
    history: {
      push: () => { }
    },
  }
  static contextType = NoteContext;
  constructor(props) {
    super(props);
    this.state = {
        noteName: {
          value: '',
          touched: false
        },
        noteContent: {
          value: '',
          touched: false
        },
        folder: {
          value: '',
          touched: false
        },
        error: null
    }
  };

  onNameChange = (noteName) => {
    this.setState({noteName: {value: noteName, touched: true}});
    console.log(this.state)
  }

  validateNoteName() {
    if (this.state.noteName.value.length === '') {
      return 'Please type a name.';
    } else if (this.state.noteName.value.length < 5) {
      return 'Note names must be at least 5 characters long.';
    }
  }

  onContentChange = (noteContent) => {
    this.setState({noteContent: {value: noteContent, touched: true}});
    console.log(this.state)
  }

  validateNoteContent() {
    if (this.state.noteContent.value === '') {
      return 'Please add some content to your note.'
    }
  }

  onFolderChange = (folder) => {
    this.setState({folder: {value: folder, touched: true}});
    console.log(this.state)
  }

  validateFolder() {
    if (this.state.folder.value === null) {
      return 'You must select a folder.';
    } else if (this.state.folder.value === '') {
      return 'You must select a folder.';
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    const newNote = {
      name: e.target['noteName'].value,
      content: e.target['content'].value,
      folderId: e.target['folderId'].value,
      modified: new Date(),
    }
    fetch(`${config.API_ENDPOINT}/notes`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(newNote),
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(note => {
        this.context.addNote(note)
        this.props.history.push(`/folder/${note.folderId}`)
      })
      .catch(error => {
        console.error({ error })
        this.setState({error: error.message})
      })
  }

  render() {
    const { folders=[] } = this.context
    const dropdownMenu = folders.map(item => {
      return <option key={item.id} value={item.id}>{item.name}</option>
    });
    const noteNameError = this.validateNoteName();
    const noteContentError = this.validateNoteContent();
    return (
      <section className='AddNote'>
        <h2>Create a note</h2>
        <div className='error-message'>{this.state.error}</div>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='note-name-input'>
              Name
            </label>
            <input type='text' id='note-name-input' name='noteName' value={this.state.noteName.value} onChange={e => this.onNameChange(e.target.value)}/>
            {this.state.noteName.touched && noteNameError}
          </div>
          <div className='field'>
            <label htmlFor='note-content-input'>
              Content
            </label>
            <input type='text' id='note-content-input' name='content' value={this.state.noteContent.value} onChange={e => this.onContentChange(e.target.value)}/>
            {this.state.noteContent.touched && noteContentError}
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>
              Folder
            </label>
            <select id='note-folder-select' name='folderId' onChange={e => this.onFolderChange(e.target.value)}>
              <option value={null}>Select a folder</option>
              {dropdownMenu}
            </select>
          </div>
          <div className='buttons'>
            <button type='submit' disabled={
              this.validateNoteName() ||
              this.validateNoteContent() ||
              this.validateFolder()
            }>
              Add note
            </button>
            <button type='reset'>
              Clear
            </button>
          </div>
          <div className='error-message'>{this.state.error}</div>
        </NotefulForm>
      </section>
    )
  }
}

AddNote.propTypes = {
  history: PropTypes.object
};