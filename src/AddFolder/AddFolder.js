import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import NoteContext from '../NoteContext'
import config from '../config'
import PropTypes from 'prop-types'

export default class AddFolder extends Component {
  static defaultProps = {
    history: {
      push: () => { }
    },
  }
  static contextType = NoteContext;

  state = {
      folderName: {
        value: '',
        touched: false
      },
      error: null
  };

  updateFolderName = (folderName) => {
    this.setState({folderName: {value: folderName, touched: true}});
    console.log(this.state)
  }

  validateFolderName() {
    const nameOfFolder = this.state.folderName.value;
    if (nameOfFolder.length < 5) {
      return 'Folder names must be at least 5 characters long.';
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    const folder = {
      name: e.target['folderName'].value
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
        console.error({error});
        this.setState({error: error.message})
      })
  }

  render() {
    return (
      <section className='AddFolder'>
        <h2>Create a folder</h2>
        <div className='error-message'>{this.state.error}</div>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='folder-name-input'>
              Name
            </label>
            <input type='text' id='folder-name-input' name='folderName' value={this.state.folderName.value} onChange={e => this.updateFolderName(e.target.value)}/>
          </div>
          <div className='buttons'>
            <button type='submit' disabled={this.validateFolderName()}>
              Add Folder
            </button>
            <button type='reset'>
              Clear
            </button>
          </div>
          {this.state.folderName.touched && <p className="folder-name-error">{this.validateFolderName()}</p>}
        </NotefulForm>
      </section>
    )
  }
}

AddFolder.propTypes = {
  history: PropTypes.object,
  touched: PropTypes.bool
};