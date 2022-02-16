import React, { useContext } from "react";
import styled from "styled-components";
import { GithubContext } from "../context/context";
//prettier-ignore
import {MostUsedLanguage,MostStarredRepos,MostForked,StarsPerLanguage} from "./Charts";

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

const Repos = () => {
  const { repos } = useContext(GithubContext);

  //Instead of setting up two different 'reduce' functions to display charts for Most used Languages (Pie3D) & Stars per Language (Doughnut2D), I have set up one reduce function and destrcutred data that will be required by both of the charts.
  const languages = repos.reduce((total, item) => {
    //const = langauge //is used in Pie3D chart to calculate most used programming language
    // const = stargazers_count // is used in Doughnut2D chart to calculate how many stars each language has received
    const { language, stargazers_count } = item;
    if (!language) return total;
    if (!total[language]) {
      total[language] = { label: language, value: 1, stars: stargazers_count };
    } else {
      total[language] = {
        ...total[language],
        value: total[language].value + 1,
        stars: total[language].stars + stargazers_count,
      };
    }
    return total;
  }, {});

  const mostUsedLanguages = Object.values(languages)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const starsPerLanguage = Object.values(languages)
    .sort((a, b) => b.stars - a.stars)
    //using the 'map' function below I have assigned the value of "stars" property to "value" property because as per the FusionCharts docs FusionCharts looks up for the "value" property to display figures with charts
    .map((language) => {
      return { ...language, value: language.stars };
    })
    .slice(0, 5);

  //Instead of setting up two different 'reduce' functions to display charts for Most starred Repos (Doughnut2D) & Most Forked (Bar3D), I have set up one reduce function and destrcutred data that will be required by both of the charts.
  //let = starredRepos //is used in Doughnut2D chart to calculate most starred repos
  // let = forks // is used in Bar3D chart to calculate most forked repos
  let { starredRepos, forks } = repos.reduce(
    (total, repo) => {
      const { name, forks, stargazers_count } = repo;
      total.starredRepos[stargazers_count] = {
        label: name,
        value: stargazers_count,
      };
      total.forks[forks] = { label: name, value: forks };
      return total;
    },
    {
      starredRepos: {},
      forks: {},
    }
  );

  starredRepos = Object.values(starredRepos).slice(-5).reverse();
  forks = Object.values(forks).slice(-5).reverse();

  return (
    <section className="section">
      <Wrapper className="section-center">
        <MostUsedLanguage data={mostUsedLanguages} />
        <MostStarredRepos data={starredRepos} />
        <StarsPerLanguage data={starsPerLanguage} />
        <MostForked data={forks} />
      </Wrapper>
    </section>
  );
};

export default Repos;
