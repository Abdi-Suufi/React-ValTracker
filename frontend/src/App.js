import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [usernameTag, setUsernameTag] = useState("");
  const [rankInfo, setRankInfo] = useState(null);
  const [error, setError] = useState("");

  const fetchRank = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_API_URL, {
        usernameTag,
      });
      setRankInfo(response.data);
      setError("");
    } catch (err) {
      setRankInfo(null);
      setError(err.response?.data?.error || "Error fetching rank data");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchRank();
  };

  return (
    <div className="content-section masthead">
      <div id="main">
        <h1 className="mt-4 mb-4 text-center">Valorant Rank Tracker</h1>
        <div id="inputForm">
          <form onSubmit={handleSubmit}>
            <div className="text-center">
              <div className="form-group">
                <label htmlFor="usernameTag">Username#Tag:</label>
                <input
                  type="text"
                  id="usernameTag"
                  className="form-control m-1"
                  placeholder="Enter username#tag"
                  value={usernameTag}
                  onChange={(e) => setUsernameTag(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary m-3">
                Get Rank
              </button>
            </div>
          </form>

          {error && (
            <div className="alert alert-danger text-center mt-4">{error}</div>
          )}

          {rankInfo && (
            <div className="row mt-4 text-center">
              <div id="currentRankTemplate" className="col-md-6">
                <div className="card mb-4">
                  <img
                    src={rankInfo.current_rank_image}
                    className="card-img-top"
                    alt="Current Rank"
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      Current Rank: {rankInfo.current_rank}
                    </h5>
                    <p className="card-text">Elo: {rankInfo.current_elo}</p>
                  </div>
                </div>
              </div>
              <div id="highestRankTemplate" className="col-md-6">
                <div className="card mb-4">
                  <img
                    src={rankInfo.highest_rank_image}
                    className="card-img-top"
                    alt="Highest Rank"
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      Highest Rank: {rankInfo.highest_rank}
                    </h5>
                    <p className="card-text">
                      Season: {rankInfo.highest_rank_season}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
