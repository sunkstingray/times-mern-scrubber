import React from "react";
// import API from "../../utils/API";

const Saved = props =>
      <div className="card">
        <div className="card-header">
          <h3>Saved Articles</h3>
        </div>
        <ul className="list-group list-group-flush">
          {props.savedArticles.map((article, i) => (
                  <li key={i} id={"result_"+(i+1)} className="well list-group-item">
                  <a href={article.webUrl}>{article.title}</a><button name={article.id} className="btn btn-danger btn-sm float-right" onClick={props.deleteArticle} type="button">Delete</button>
                  </li>
                ))
              }
        </ul>
      </div>;

export default Saved;
