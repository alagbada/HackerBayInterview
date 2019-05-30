# HackerBayInterview

### Folder structure
---controller/
    ---AuthController.js
    ---ImageController.js
    ---JsonPatchController.js
---images/
---test/
    ---AuthController.spec.js
    ---ImageController.spec.js
    ---JsonPatchController.spec.js
---server.js

### server.js
This is the entry point of the application. The application listens at port 3000. The router endpoints are also called through this entry point. The application runs by using "npm start" command

### AuthController.js
The endpoint to access this authcontroller which is responsible for login is: http://localhost:3000/api/v2/login.
It is a post method. Username and password is passed into the body of the request and it returns a token.
check out the image at ./DocumentationImages/hbay01.PNG, and ./DocumentationImages/hbay02.PNG

### JsonPatchController.js
The endpoint to access this JsonPatchController which is responsible for the Json patch is: 
http://localhost:3000/api/v2/jsonpatch. It is a post method and it accepts keys of "jsonobj" which is the JSON object and "patch" whih is the JSON patch key. JWT token is used in authorizing this endpoint. The keys are very important. Here is an example:

{
	"jsonobj": {
		"name" : "john",
		"password" : "password"
	},
	"patch": [
		{ "op": "add", "path": "/figure", "value": "world" }
	]
}
checkout the image at ./DocumentationImages/hbay03.PNG

### ImageController.js
The endpoint to access this ImageController is: http://localhost:3000/api/v2/imageresize
It is a post method and it accepts uri, imageName, width, height, format in the body of the request. JWT token is used in authorizing this endpoint.

checkout the image at ./DocumentationImages/hbay04.PNG


###Test
NB: The test approach for imageController requires internet access for it to pass
Istanbul is used to get test coverage.
Mocha, Chai, Chai-Spies, Chai-Http and SinonJs was used for the test.
run the test by using: "npm test" command

