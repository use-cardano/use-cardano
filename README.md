# USE CARDANO

## Unreleased

**OBS!! This project is unreleased. Feel free to use it, but be aware that it is to be considered as an alpha version. Things can break, the APIs will change etc.**

### Release Timeline

I am aiming for an initial beta (as in a functional and stable solution with a finalized API) release before end-of-year 2022. I think this is realistic. Please see [this issue](https://github.com/GGAlanSmithee/use-cardano/issues/7) for what is left to do.

## Overview

This repository contains the source code for [use-cardano](https://www.npmjs.com/package/use-cardano), a react hook that makes interacting with the Cardano blockchain easy.


## Documentation

Visit the [documentation site](https://use-cardano.alangaming.com/) for installation instructions and usage examples.

## Contributing / Development

Feel free to contribute in any capacity, either by opening an issue, creating a pull request or by giving feedback.

_Are you new to Open Source development, or the Cardano dApps eco system? I know it can be daunting, but do not be afraid to reach out in an issue. Any and all contributions are welcome._

## Running the project in development mode

_We highly recommend pnpm over yarn and npm since it handles local project linking, as well as being very performant._

1. `git clone git@github.com:GGAlanSmithee/use-cardano.git`
1. `npm i -g pnpm`
1. `cd example && pnpm i && cd ..`
    - _Installs example dependencies_
1. `pnpm link ./example/node_modules/react ./example/node_modules/lucid-cardano`
    - _Links the libraries peer dependencies_
1. `pnpm i`
    - _Installs library dependencies_ 
1. `pnpm dev`
    - _Runs the library in watch mode, and launches the example app_

## Reverse Proxy

When running the project locally, the examples site will be served on `http://localhost:4200`.

Some wallet providers (gerowallet) will not inject itself in the CIP-0030 web bridge if the page is not served over https. To get around this, the site is also served over a reverse proxy using [localtunnel](https://www.npmjs.com/package/localtunnel). The proxied site will launch automatically in your default browser, and you will be informed that it's being proxied and prompted to continue.

## Example app

There is an example app in the `/example` folder. It is a simple Next.js app that serves both as a testbed and as a reference. Changes to both the `use-cardano` package as well as the example app will be hot-reloaded during development.

![Example app](.github/example-app.png)
