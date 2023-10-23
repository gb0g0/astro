const Twit = require("twit");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const twit = new Twit({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret,
});
function check(userID) {
  twit.get(
    "friendships/lookup",
    {
      source_id: userID,
      target_ids: ["Socrates_xyz"],
    },
    (err, data, response) => {
      if (err) {
        console.log(err);
      } else {
        const isFollowing = data[0].following;

        if (isFollowing) {
          console.log("The user is following the specified user.");
        } else {
          console.log("The user is not following the specified user.");
        }
        return isFollowing;
      }
    }
  );
}

module.exports = {
    check
}
