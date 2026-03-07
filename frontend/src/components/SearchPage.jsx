import { useState } from "react";
import { useLocation } from 'react-router-dom';
import Nav from "./Nav";
import ShowComments from "./ShowComments"

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [results, setResults] = useState([]);
  const [comments, setComments] = useState('');

  const location = useLocation();
  const username = location.state.username.toLowerCase();

  // Changes comments between an id and null
  const toggleComments = (id) => {
        if (comments === id) {
            setComments(null);
        } else {
            setComments(id);
        }
  };

  // Searches for posts 
  const handleSearch = async () => {
    try {
      const response = await fetch(
        `/api/posts/sortedsearch/?search=${searchTerm}&sort=${sortOrder}`
      );

      const data = await response.json();
      if (response.status === 200){
          setResults(data);
          return;
      }else{
        alert("No posts Found");
        return;
      }
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <>
      <Nav username={username}/>
      <div className="search-container">
        <div className="search-card">

          <h1>Search Posts</h1>

          <div className="search-controls">

            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>

            <button onClick={handleSearch}>Search</button>

          </div>

          <div className="results">

            {results.length === 0 && (
              <p className="no-results">Try searching for posts above</p>
            )}

            <div className="postContainer">
                {results.map(post => {
                    if (post.image){
                        return(
                            <div className="post-card" key={post._id}>
                                <div className="post-header">
                                    <img 
                                        src={`/images/${post.userpfp}`}
                                        className="post-pfp"
                                    />
                                    <h3 className="post-username">{post.user}</h3>
                                    <span className="post-date">{new Date(post.date).toLocaleDateString()}</span>
                                </div>
                                <div className="post-content">
                                    <p>{post.content}</p>
                                    <div className="post-card-image"> 
                                    <img src={`/images/${post.image}`} className="post-image"/>
                                    </div>
                                </div>
                                <hr></hr>
                                <div className="post-footer">
                                    <button onClick={() => toggleComments(post._id)}>Comments</button>
                                    {comments === post._id && <ShowComments id={post._id} username={username}/>}
                                </div>
                            </div>
                        )
                    }else{
                        return(
                            <div className="post-card" key={post._id}>
                                <div className="post-header">
                                    <img 
                                        src={`/images/${post.userpfp}`}
                                        className="post-pfp"
                                    />
                                    <h3 className="post-username">{post.user}</h3>
                                    <span className="post-date">{new Date(post.date).toLocaleDateString()}</span>
                                </div>
                                <div className="post-content">
                                    <p>{post.content}</p>
                                </div>
                                <hr></hr>
                                <div className="post-footer">
                                    <button onClick={() => toggleComments(post._id)}>Comments</button>
                                    {comments === post._id && <ShowComments id={post._id} username={username}/>}
                                </div>
                            </div>
                        )
                    }
                })}
            </div>

          </div>

        </div>
      </div>
    </>
  );
}

export default SearchPage;