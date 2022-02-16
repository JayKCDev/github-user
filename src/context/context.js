import axios from "axios";
import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";

//The below url will be used to fetch data from the Github and the app will be built onto the data fetched
const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [requests, setRequests] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ show: false, msg: "" });
  const [repos, setRepos] = useState(mockRepos);
  const [githubUser, setGithubUser] = useState(mockUser);
  const [followers, setFollowers] = useState(mockFollowers);

  const requestLimit = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        const {
          rate: { remaining },
        } = data;
        if (remaining === 0) {
          toggleError(true, "Sorry, hourly request limit has been reached!");
        }
        setRequests(remaining);
      })
      .catch((err) => console.log(err));
  };

  const searchGithubUser = async (user) => {
    toggleError();
    setLoading(true);

    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    );

    if (response) {
      setGithubUser(response.data);
      const { login, followers_url } = response.data;

      // const repoResponse = await axios(
      //   `${rootUrl}/users/${login}/repos?per_page=100`
      // ).catch((err) => console.log(err));
      // setRepos(repoResponse.data);

      // const followersResponse = await axios(
      //   `${followers_url}?per_page=100`
      // ).catch((err) => console.log(err));
      // setFollowers(followersResponse.data);

      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ])
        .then((results) => {
          const [repos, followers] = results;
          const status = "fulfilled";
          if (repos.status === "fulfilled") {
            const fetchedRepos = repos.value.data;
            setRepos(fetchedRepos);
          }
          if (followers.status === "fulfilled") {
            const fetchedFollowers = followers.value.data;
            setFollowers(fetchedFollowers);
          }
        })
        .catch((err) => console.log(err));
    } else {
      toggleError(true, "No user found for that username.");
    }

    requestLimit();
    setLoading(false);
  };

  const toggleError = (show = false, msg = "") => {
    setError({ show, msg });
  };

  useEffect(requestLimit, []);

  return (
    <GithubContext.Provider
      value={{
        error,
        repos,
        loading,
        requests,
        followers,
        githubUser,
        searchGithubUser,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };
