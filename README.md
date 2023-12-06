# mutual-funds API

- [mutual-funds API](#mutual-funds-api)
  - [POST /register](#post-register)
  - [POST /login](#post-login)
  - [GET /funds](#get-funds)
  - [GET /funds/owned](#get-fundsowned)
  - [GET /funds/item/:id](#get-fundsitemid)
  - [POST /funds/buy/:id](#post-fundsbuyid)
  - [POST /funds/sell/:id](#post-fundssellid)
  - [POST /funds/switch/:id](#post-fundsswitchid)


## POST /register
>To create a new user
- request body
```json
{
    "email": "string",
    "password": "string"
}
```

- response (201)
```json
{
    "id": "integer",
    "email": "string"
}
```

## POST /login
>To log in an existing user
- request body
```json
{
    "email": "string",
    "password": "string"
}
```

- response (201)
```json
{
    "access_token": "string"
}
```

## GET /funds
>To get all available funds
- request body
```
    not needed
```

- request headers
```json
{
    "access_token": "string"
}
```

- response (200)
```json
[
    {
        "id": "integer",
        "name": "string",
        "value": "integer",
        "quantity": "integer",
        "totalValue": "integer",
        "createdAt": "Date",
        "updatedAt": "Date"
    },
    ...,
]
```

## GET /funds/owned
>To get all owned funds
- request body
```
    not needed
```

- request headers
```json
{
    "access_token": "string"
}
```

- response (200)
```json
[
    {
        "UserId": "integer",
        "FundId": "integer",
        "quantity": "integer",
        "totalValue": "integer",
        "createdAt": "Date",
        "updatedAt": "Date",
        "Fund": {
            "name": "string"
        }
    },
    ...,
]

```
## GET /funds/item/:id
>To get funds by id
- request body
```
    not needed
```

- request headers
```json
{
    "access_token": "string"
}
```

- response (200)
```json
{
    "id": "integer",
    "name": "string",
    "value": "integer",
    "quantity": "integer",
    "totalValue": "integer",
    "createdAt": "Date",
    "updatedAt": "Date"
}
```

## POST /funds/buy/:id
>To buy funds by id
- request body
```json
{
    "quantity": "integer"
}
```

- request headers
```json
{
    "access_token": "string"
}
```

- response (200)
```json
{
    "id": "integer",
    "UserId": "integer",
    "FundId": "integer",
    "quantity": "integer",
    "totalValue": "integer",
    "createdAt": "Date",
    "updatedAt": "Date"
}
```

## POST /funds/sell/:id
>To sell funds by id
- request body
```json
{
    "quantity": "integer"
}
```

- request headers
```json
{
    "access_token": "string"
}
```

- response (200)
```json
{
    "id": "integer",
    "UserId": "integer",
    "FundId": "integer",
    "quantity": "integer",
    "totalValue": "integer",
    "createdAt": "Date",
    "updatedAt": "Date"
}

```
## POST /funds/switch/:id
>To sell funds by id
- request body
```json
{
    "sellquantity": "integer",
    "FundId": "integer"
}
```

- request headers
```json
{
    "access_token": "string"
}
```

- response (200)
```json
{
    "id": "integer",
    "UserId": "integer",
    "FundId": "integer",
    "quantity": "integer",
    "totalValue": "integer",
    "createdAt": "Date",
    "updatedAt": "Date"
}
```