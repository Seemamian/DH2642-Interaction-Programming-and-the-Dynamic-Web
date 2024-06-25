# npm-tutorial
tutorial version 5

1. install node, recent version (e.g. 17)

2. after checkout execute
```
npm install
```
3. to start your development server
```
npm run dev
```

In case of problems with npm, see (6) Docker below

4. Point your browser to HTML addresses corresponding to different steps of the tutorial, such as:

http://localhost:8080/tw1.1.html

http://localhost:8080/tw1.1-react.html

http://localhost:8080/tw1.2.html

http://localhost:8080/tw1.2-react.html

http://localhost:8080/tw1.2.1.html

The tutorial will point you to other such URLs. Each file under `tw/tw*.js` has a HTML counterpart

5. Unit tests should be run after each tutorial step. We recommend to load unit tests in an Incognito browser window.
http://localhost:8080/test.html

6. Make sure that your function names and parameter names follow the **obligatory** [lab coding conventions](https://docs.google.com/presentation/d/1CtxiAG9mJ6kslSl6psBBlVDafFD4b2Rh2G7ft1GQ08o/edit#slide=id.g17644a78da5_0_174)

## Installation problems?
File [an issue](https://gits-15.sys.kth.se/iprog/issues).
In case you have problems with node, npm, webpack, you can use Docker to make a clean little "machine"

* Docker: https://docs.docker.com/get-docker/
* Docker-Compose: https://docs.docker.com/compose/install/

When you want to run the development server:
```
docker-compose up
```
(see the file `docker-compose.yml`) 

Note that running this command for the first time might take some time, since we have to download the image and install all the dependencies.

## Test result tracking 
Your test results are saved in a secured KTH database. We use this for three main purposes:

1) to identify students who struggle in the early stages of the course
2) to identify concepts that many students struggle with.
3) to conduct learning analytics research. For such purposes, all data is stored anonymoyusly.

To configure, locate the file "telemetry.config.json" in the root directory
- Track my test results: "full"  (default). In this case we will be albe to contact you if we notice that you get stuck.
- Track my test results without username: "anonymous". This still helps us see if many students get stuck at the same lab task.
- Don't track my test results: "none"  

