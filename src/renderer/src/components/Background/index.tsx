import { createGlobalStyle } from 'styled-components'

export const Background = createGlobalStyle`
  body, html {
    height: 100vh;
    width: 100vw;
    background: #1e1d29;
    margin: 0;
    font-family: Lato;
    cursor: default;
    transition: background 0.4s linear;
    transition: color 0.4s linear;
    transition: fill 0.4s linear;
    overflow: hidden;
    font-size: 62.5%;
  }

  #root {
    height: 100%;
    width: 100%;
    font-size: 1.3rem;
  }
`
