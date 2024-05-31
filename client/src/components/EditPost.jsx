import React, { Component } from 'react';
import http from '../services/httpService';
import { api } from '../config';

class EditPost extends Component {
  state = {
    title: '',
    description: '',
    availableTags: [], // To store available tags fetched from the server
    selectedTags: [{ name: '' }] // To store selected tags
  };

  async componentDidMount() {
    const { id } = this.props.match.params;
    const { data: post } = await http.get(`${api.postsEndPoint}/${id}`);
    const { title, description, tags } = post;

    // Fetch available tags from the server
    const { data: availableTags } = await http.get(`${api.tagsEndPoint}`);

    this.setState({ title, description, availableTags, selectedTags: tags });
  }

  handleChange = ({ currentTarget: input }) => {
    const state = { ...this.state };
    state[input.name] = input.value;
    this.setState(state);
  };

  handleTagChange = (e, index) => {
    const selectedTags = [...this.state.selectedTags];
    selectedTags[index].name = e.target.value;
    this.setState({ selectedTags });
  };

  handleAddTag = () => {
    const selectedTags = [...this.state.selectedTags, { name: '' }];
    this.setState({ selectedTags });
  };

  handleRemoveTag = (index) => {
    const selectedTags = this.state.selectedTags.filter((_, i) => i !== index);
    this.setState({ selectedTags });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { id } = this.props.match.params;
    const { title, description, selectedTags } = this.state;

    // Validate before sending
    if (title.length < 10 || title.length > 80) {
      alert("Title must be between 10 and 80 characters.");
      return;
    }

    if (description.length < 5 || description.length > 1024) {
      alert("Description must be between 5 and 1024 characters.");
      return;
    }

    const payload = {
      title,
      description,
      tags: selectedTags.filter(tag => tag.name) // Remove empty tags
    };

    try {
      await http.put(`${api.postsEndPoint}/${id}`, payload);
      this.props.history.push('/dashboard');
    } catch (ex) {
      console.error("Error updating post:", ex);
      alert("An error occurred while updating the post.");
    }
  };

  render() {
    const { title, description, availableTags, selectedTags } = this.state;

    return (
      <div>
        <h1>Edit Post</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              value={title}
              onChange={this.handleChange}
              id="title"
              name="title"
              type="text"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              value={description}
              onChange={this.handleChange}
              id="description"
              name="description"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Tags</label>
            {selectedTags.map((tag, index) => (
              <div key={index} className="input-group mb-3">
                <select
                  className="form-control"
                  value={tag.name}
                  onChange={(e) => this.handleTagChange(e, index)}
                >
                  <option value="">Select a Tag</option>
                  {availableTags.map((availableTag, idx) => (
                    <option key={idx} value={availableTag.name}>{availableTag.name}</option>
                  ))}
                </select>
                <div className="input-group-append">
                  <button type="button" className="btn btn-danger" onClick={() => this.handleRemoveTag(index)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-secondary" onClick={this.handleAddTag}>
              Add Tag
            </button>
          </div>
          <button className="btn btn-primary">Save</button>
        </form>
      </div>
    );
  }
}

export default EditPost;
