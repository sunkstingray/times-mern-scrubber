import React, { Component } from 'react';
import axios from 'axios';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: "",
      start: 2018,
      end: 2018,
      searchResults: []
        };
  }
  //Method to handle changes to input fields
  handleInputChange = event => {
    // Destructure the name and value properties off of event.target
    // Update the appropriate state
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  //Method to handle form submit
  onSubmit = (event) => {
    event.preventDefault();
    // get our form data out of state
    const { topic, start, end } = this.state;

    // GET request for articles
    const apikey = "16f634ad239f4f6fa96dbe34d4c4d73e";
    const baseurl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    let params = "?api-key="+apikey;
    params += "&q="+topic;
    params += "&begin_date="+start+"0101";
    params += "&end_date="+end+"1231";
    params += "&fl=web_url,headline"
    params += "&page=0"

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

  //Method to handle saving an article
  saveArticle = (event) => {
    event.preventDefault();
    const index = event.target.name;
    console.log("index: " + index);
    console.log("article: " + this.state.searchResults[index].title);

    axios({
      method: 'post',
      url: '/api/articles',
      data: {
        title: this.state.searchResults[index].title,
        weburl: this.state.searchResults[index].webUrl
      }
    });

    this.props.getSaved();
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
                <label htmlFor="topic">Search Terms</label>
                <input
                  type="text"
                  name="topic"
                  className="form-control"
                  id="topic"
                  placeholder="Enter search terms here."
                  value={this.state.topic}
                  onChange={this.handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="start">Start Year</label>
                <input
                  type="text"
                  name="start"
                  className="form-control"
                  id="start"
                  placeholder="2018"
                  value={this.state.start}
                  onChange={this.handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="end">End Year</label>
                <input
                  type="text"
                  name="end"
                  className="form-control"
                  id="end"
                  placeholder="2018"
                  value={this.state.end}
                  onChange={this.handleInputChange} />
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
                    <a href={article.webUrl} target="_blank">{article.title}</a><button name={i} className="btn btn-primary btn-sm float-right" onClick={this.saveArticle} type="button">Save</button>
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
