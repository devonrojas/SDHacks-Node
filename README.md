GraphQL Endpoints:

user
```
{
  "query": "query($id: String!) { user(id: $id) { id displayName email username } }",
  "variables": { "id": "<id>" }
}
```

login
```
{
  "query": "query($username: String!, $password: String!) { login(username: $username, password: $password) { token user { id displayName email username } }}"
	"variables": {"username": "<username>", "password": "<username>"}
}
```

createUser 
```
{
  "query": "mutation($user: UserInput!) { createUser(user: $user) { token user { id displayName email username }} }",
  "variables": {
    "user": {
      "id": "<id>",
      "displayName": "<displayName>",
      "username": "<username>",
      "password": "<password>",
      "email": "<email>"
    }
  }
}
```

item 
```
{
  "query": "query($id: String!) { item(id: $id) { id description category price } },
  "variables": {"id": "<id>"}
}
```

addItem
```
{
	"query": "mutation($item: ItemInput!) { addItem(item: $item) { id description category price } }",
	"variables": {
		"item": {
			"description": "<description>",
			"category": "<description",
			"price": <number>
		}
	}
}
```

transaction
```
{
  "query": "query($id: String!) { transaction(id: $id) { id studentID itemID vendorID qty timestamp } }",
  "variables": { "id": "<id>" }
}
```

addTransaction
```
{
  "query": "mutation($transaction: TransactionInput!) { id studentID itemID vendorID qty timestamp }",
  "variables": {
    "transaction": {
      "studentID": "<studentID>",
      "itemID": "<itemID>",
      "vendorID": "<vendorID>",
      "qty": <qty>
    }
  }
}
```

vendor
```
{
  "query": "query($id: String!) { vendor(id: $id) { id name category } }",
  "variables": { "id": "<id>" }
}
```

addVendor
```
{
  "query": "mutation($vendor: VendorInput!) { id name category }",
  "variables": {
    "vendor": {
      "name: "<name>",
      "category": "<category>"
    }
  }
}
```