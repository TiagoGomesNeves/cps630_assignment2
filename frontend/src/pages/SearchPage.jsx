import { useState } from "react";
import { useLocation } from 'react-router-dom';
import "../css/SearchPage.css";
import Nav from "../components/Nav";

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [results, setResults] = useState([]);

  const location = useLocation();
  const username = location.state; 

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `/api/posts?search=${searchTerm}&sort=${sortOrder}`
      );

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <>
      <Nav username={username.username}/>
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

            {results.map((post) => (
              <div key={post._id} className="search-post-card">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <span>{post.createdAt}</span>
              </div>
            ))}

          </div>

        </div>
      </div>
    </>
  );
}

export default SearchPage;