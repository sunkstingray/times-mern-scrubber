import React, { Component } from 'react';
import axios from 'axios';
import Home from "./components/Home";
import Saved from "./components/Saved";


//Main react component
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savedArticles: []
    };
  }

  componentDidMount() {
    this.getSaved();
  }

  //Method that deletes an article
  deleteArticle = (event) => {
    const deleteId = event.target.name;
    axios.post('/api/delete', {
      id: deleteId
    })
    .then(function (response) {
      console.log(response);
      this.getSaved();
    })
    .catch(function (error) {
      console.log(error);
    });
    this.getSaved();
  }

  //Method to get saved articles
  getSaved = () => {
    axios.get('/api/articles')
    .then((response) =>{
      let saved = [];
      for (let index = 0; index < response.data.length; index++) {
        const currentId = response.data[index]._id;
        const currentTitle = response.data[index].title;
        const currentWebUrl = response.data[index].webUrl;
        saved.push({id: currentId, title: currentTitle, webUrl: currentWebUrl});
        this.setState({ savedArticles: saved });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    return (
      <div className="container">
        <Home getSaved={this.getSaved.bind(this)}/>
        <Saved savedArticles={this.state.savedArticles} deleteArticle={this.deleteArticle.bind(this)} />
      </div>
    );
  }
}

export default App;
