## API-OAuth2

### Server

[![Build Status](https://travis-ci.org/jyesares/api-oauth2.svg?branch=develop)](https://travis-ci.org/jyesares/api-oauth2)
[![Coverage Status](https://coveralls.io/repos/github/jyesares/api-oauth2/badge.svg)](https://coveralls.io/github/jyesares/api-oauth2)

### Usage

##### API v1

`http://api-oauth2.herokuapp.com/api/v1`

##### GET Users (Non authentication required)

`GET /api/v1/users`

##### POST Users (Non authentication required)

`POST /api/v1/users`

##### GET Clients (Basic Authentication required)

`GET /api/v1/clients`

##### POST Clients (Basic Authentication required)

`POST /api/v1/clients`

##### GET Authorize (Client Basic Authentication required)

`GET /api/v1/oauth2/authorize`

##### POST Token (Client Basic Authentication required)

`POST /api/v1/oauth2/token`

##### POST Refresh token (Client Basic Authentication required)

`POST /api/v1/oauth2/token`

##### POST Revoke token (Client Basic Authentication required)

`POST /api/v1/oauth2/token/revoke`

### [Live Demo](https://api-oauth2.herokuapp.com)
