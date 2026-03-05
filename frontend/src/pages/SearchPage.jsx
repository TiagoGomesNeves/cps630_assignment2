import { useState } from "react";
import "../css/SearchPage.css";

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/posts?search=${searchTerm}&sort=${sortOrder}`
      );

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
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
            <div key={post._id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <span>{post.createdAt}</span>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default SearchPage;