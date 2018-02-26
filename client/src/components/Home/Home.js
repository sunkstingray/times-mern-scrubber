import React, { Component } from 'react';
import axios from 'axios';
import API from "../../utils/API";


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: "",
      start: 2018,
      end: 2018,
      searchResults: [],
      savedArticles: ["article 1","article 2","article 3"]
    };
  }

  handleTopic = (event) => {
    this.setState({ topic: event.target.value });
  } 

  onSubmit = (event) => {
    event.preventDefault();
    // get our form data out of state
    //const { topic, start, end } = this.state;

    // GET request for articles
    const apikey = "16f634ad239f4f6fa96dbe34d4c4d73e";
    const baseurl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    let params = "?api-key="+apikey;
    params += "&q="+this.state.topic;
    params += "&fl=web_url,headline"
    params += "&page=0"

    //const self = this;
    axios.get(baseurl+params)
      .then((response)=>{
      const nytArticles = response.data.response.docs;

      let returns = [];
      for (let i = 0; i < nytArticles.length; ++i){
          const currentUrl = response.data.response.docs[i].web_url;
          const currentTitle = response.data.response.docs[i].headline.main;
          returns.push({webUrl: currentUrl, title: currentTitle});
          this.setState({ searchResults: returns });
        };

    })
    .catch((error)=>{
      console.log(error);
  });
  this.setState({
    topic: "",
    start: 2018,
    end: 2018
  });
  }

  saveArticle = (event) => {
    event.preventDefault();
    const index = event.target.name;
    console.log("index: " + index);
    console.log("article: " + this.state.searchResults[index].title);
	  API.saveArticle(this.state.searchResults[index]).then((response) => {
      // this.getArticles();
    });
	}

  render() {
    return (
      <div>
        <div className="jumbotron text-center">
          <h1 className="display-4">NYT Article Search</h1>
          <p className="lead">Search for and save articles from the New York Times</p>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={this.onSubmit} >
              <div className="form-group">
                <label htmlFor="topic">Topic</label>
                <input
                  type="text"
                  name="topic"
                  className="form-control"
                  id="topic"
                  placeholder="Enter search terms here."
                  value={this.state.topic}
                  onChange={this.handleTopic} />
              </div>
              <div className="form-group">
                <label htmlFor="start">Start Year</label>
                <input type="text" name="start" className="form-control" id="start" placeholder="2018"/>
              </div>
              <div className="form-group">
                <label htmlFor="end">End Year</label>
                <input type="text" name="end" className="form-control" id="end" placeholder="2018"/>
              </div>
              <div className="form-group">
                <div className="col-sm-10">
                  <button type="submit" className="btn btn-primary">Search</button>
                </div>
              </div>
            </form>

          </div>
        </div>
          <div className="card">
              <div className="card-header">
                <h3>Search Results</h3>
              </div>
              <ul className="list-group list-group-flush">
              {this.state.searchResults.map((article, i) => (
                  <li key={i} id={"result_"+(i+1)} className="well list-group-item">
                    <a href={article.webUrl}>{article.title}</a><button name={i} className="btn btn-primary btn-sm float-right" onClick={this.saveArticle} type="button">Save</button>
                  </li>
                ))
              }
              </ul>
            </div>
      </div>
          );
        }
    }


export default Home;