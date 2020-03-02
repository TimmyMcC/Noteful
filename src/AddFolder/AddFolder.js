import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import NoteContext from '../NoteContext'
import config from '../config'
import ValidationError from '../ValidationError'
import PropTypes from 'prop-types'

export default class AddFolder extends Component {
  static defaultProps = {
    history: {
      push: () => { }
    },
  }
  static contextType = NoteContext;

  constructor(props) {
    super(props);
    this.state = {
        folderName: '',
        nameIsValid: false,
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

  onChange = e => {
    this.setState({[e.target.name]: e.target.value}, this.validateName(e));
    console.log(this.state)
  }

  handleSubmit = e => {
    e.preventDefault()
    const folder = {
      name: e.target['folder-name'].value
    }
    fetch(`${config.API_ENDPOINT}/folders`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(folder),
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(folder => {
        this.context.addFolder(folder)
        this.props.history.push(`/folder/${folder.id}`)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  render() {
    return (
      <section className='AddFolder'>
        <h2>Create a folder</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='folder-name-input'>
              Name
              < ValidationError isValid={this.state.nameIsValid} message={this.state.validationMessage}/>
            </label>
            <input type='text' id='folder-name-input' name='foldeName' onChange={this.onChange}/>
          </div>
          <div className='buttons'>
            <button type='submit' disabled={!this.state.isValid}>
              Add Folder
            </button>
            <button type='reset'>
              Clear
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}

AddFolder.propTypes = {
  history: PropTypes.object
};