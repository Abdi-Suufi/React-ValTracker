const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Endpoint to fetch rank data
app.post("/get-rank", async (req, res) => {
  const { usernameTag } = req.body;

  if (!usernameTag || !usernameTag.includes("#")) {
    return res
      .status(400)
      .json({ error: "Invalid format. Use 'username#tag'" });
  }

  const [username, tag] = usernameTag.split("#");

  try {
    const accountResponse = await axios.get(
      `https://api.henrikdev.xyz/valorant/v1/account/${username}/${tag}`,
      {
        headers: {
          Authorization: process.env.API_KEY,
        },
      }
    );

    const region = accountResponse.data.data.region;

    const rankResponse = await axios.get(
      `https://api.henrikdev.xyz/valorant/v2/mmr/${region}/${username}/${tag}`,
      {
        headers: {
          Authorization: process.env.API_KEY,
        },
      }
    );

    const rankData = rankResponse.data.data;
    const currentData = rankData.current_data;
    const highestRank = rankData.highest_rank || {};

    res.json({
      current_rank: currentData.currenttierpatched,
      current_rank_image: currentData.images.large,
      current_elo: currentData.elo,
      highest_rank: highestRank.patched_tier || "N/A",
      highest_rank_image: highestRank.tier
        ? `https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/${highestRank.tier}/largeicon.png`
        : "",
      highest_rank_season: highestRank.season || "Unknown Season",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "User doesn't exist.", details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});