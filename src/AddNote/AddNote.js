import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import NoteContext from '../NoteContext'
import config from '../config'
import ValidationError from '../ValidationError'
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
        noteName: '',
        content: '',
        folderId: '',
        nameIsValid: false,
        contentIsValid: false,
        validationMessage: '',
        error: null
    }
  };

  validateName = (e) => {
    let nameIsValid = true;
    let validationMessage = {...this.state.validationMessage};
    if ([e.target.name] === '') {
      nameIsValid = false;
      validationMessage = 'Please type a name.'
    }
    this.setState({nameIsValid, validationMessage})
  }

  validateContent = (e) => {
    let contentIsValid = true;
    let validationMessage = {...this.state.validationMessage};
    if ([e.target.name] === '') {
      contentIsValid = false;
      validationMessage = 'Please type some stuff.'
    }
    this.setState({contentIsValid, validationMessage})
  }

  onNameChange = e => {
    this.setState({[e.target.name]: e.target.value}, this.validateName(e));
    console.log(this.state)
  }

  onContentChange = e => {
    this.setState({[e.target.name]: e.target.value}, this.validateContent(e));
    console.log(this.state)
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
    })
    return (
      <section className='AddNote'>
        <h2>Create a note</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='note-name-input'>
              Name
              < ValidationError isValid={this.state.nameIsValid} message={this.state.validationMessage}/>
            </label>
            <input type='text' id='note-name-input' name='noteName' onChange={this.onNameChange}/>
          </div>
          <div className='field'>
            <label htmlFor='note-content-input'>
              Content
              < ValidationError isValid={this.state.contentIsValid} message={this.state.validationMessage}/>
            </label>
            <input type='text' id='note-content-input' name='content' onChange={this.onContentChange}/>
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>
              Folder
            </label>
            <select id='note-folder-select' name='folderId'>
              <option value={null}>...</option>
              {dropdownMenu}
            </select>
          </div>
          <div className='buttons'>
            <button type='submit' disabled={!this.state.isValid}>
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
