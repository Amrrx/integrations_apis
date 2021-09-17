const http = require("axios").default;

module.exports = class testRailInstance {
   constructor(configObject) {
      this.railConfig = configObject;
      this.userName = this.railConfig.railUsername;
      this.password = this.railConfig.railPassword;
      this.baseUrl = this.railConfig.testRailBaseURL;
      this.authEndPoint = this.railConfig.gAuthEndPoint;
      this.listProjectsEndPoint = this.railConfig.gListProjectsEndPoint;
      this.listMileStones = this.railConfig.gListMileStones;
      this.listProjectSuites = this.railConfig.gListProjectSuites;
      this.getCurrentUser = this.railConfig.gGetCurrentUser;
      this.addNewRun = this.railConfig.gAddNewRun;
      this.addResults = this.railConfig.gAddResults;
   }

   /**
    * Initate a session token based on user and password assigned in config file
    * @returns Session Cookies Object
    */
   async initateAuthenticationToken() {
      try {
         let sessionID = await http.get(this.baseUrl + "/auth/login");
         let requestCookies = await sessionID.headers["set-cookie"].toString().slice(0, sessionID.headers["set-cookie"].toString().indexOf(";"));
         let sd = await http.post(
            this.baseUrl + this.authEndPoint,
            URLSearchParams.stringify({
               name: this.userName,
               password: this.password,
               rememberme: 1,
            }),
            {
               headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  Cookie: requestCookies,
               },
            }
         );
         console.log("Initiating Testrail token status is: " + sd.statusText);
         return requestCookies;
      } catch (error) {
         console.error(await error.response.data);
      }
   }

   /**
    * Get project id by exact project name on testrail
    * @param {*} sessionCookies 
    * @param {*} projectName 
    * @returns Project ID
    */
   async getProjectIDS(sessionCookies, projectName) {
      try {
         let listProjects = await http.get(this.baseUrl + this.listProjectsEndPoint, {
            headers: {
               "Content-Type": "application/json",
               Cookie: await sessionCookies,
            },
         });
         let targetProject = await listProjects.data.filter((project) => project.name == projectName);
         return await targetProject[0].id;
      } catch (error) {
         console.error(await error.response.data);
      }
   }

   /**
    * Get Milestone ID by exact milestone name on testrail
    * @param {*} sessionCookies 
    * @param {*} projectID 
    * @param {*} mileStoneName 
    * @returns Milestone ID 
    */
   async getMileStoneID(sessionCookies, projectID, mileStoneName) {
      try {
         let listMileStones = await http.get(this.baseUrl + this.listMileStones + "/" + (await projectID), {
            headers: {
               "Content-Type": "application/json",
               Cookie: await sessionCookies,
            },
         });
         let targetMileStone = await listMileStones.data.filter((mileStone) => mileStone.name == mileStoneName);
         return await targetMileStone[0].id;
      } catch (error) {
         console.error(await error.response.data);
      }
   }

   /**
    * Get TestSuite ID by exact name on testrail
    * @param {*} sessionCookies 
    * @param {*} projectID 
    * @param {*} suitName 
    * @returns TestSuite ID
    */
   async getSuiteID(sessionCookies, projectID, suitName) {
      try {
         let listSuits = await http.get(this.baseUrl + this.listProjectSuites + "/" + (await projectID), {
            headers: {
               "Content-Type": "application/json",
               Cookie: await sessionCookies,
            },
         });
         let targetSuit = await listSuits.data.filter((projectSuite) => projectSuite.name == suitName);
         return await targetSuit[0].id;
      } catch (error) {
         console.error(await error.response.data);
      }
   }

   /**
    * Get The assigned user ID from test rail
    * @param {*} sessionCookies 
    * @returns User ID
    */
   async getUserID(sessionCookies) {
      try {
         let userDetails = await http.get(this.baseUrl + this.getCurrentUser + "&email=" + this.userName, {
            headers: {
               "Content-Type": "application/json",
               Cookie: await sessionCookies,
            },
         });
         return await userDetails.data.id;
      } catch (error) {
         console.error(await error.response.data);
      }
   }

   /**
    * Create new test run on test rail
    * @param {*} sessionCookies 
    * @param {*} projectID 
    * @param {*} testRunObject 
    * @returns Created test run data
    */
   async pushNewTestRun(sessionCookies, projectID, testRunObject) {
      try {
         let addRunRequest = await http.post(this.baseUrl + this.addNewRun + "/" + projectID, testRunObject, {
            headers: {
               "Content-Type": "application/json",
               Cookie: sessionCookies,
            },
         });
         return addRunRequest.data;
      } catch (error) {
         console.error(await error.response.data);
      }
   }

   /**
    * Update test run results on test rail
    * @param {*} sessionCookies 
    * @param {*} runObjectID 
    * @param {*} resultsObject 
    * @returns Response object
    */
   async updateTestRunResults(sessionCookies, runObjectID, resultsObject) {
      try {
         let addResultsRequest = await http.post(
            this.baseUrl + this.addResults + "/" + (await runObjectID),
            { results: await resultsObject },
            {
               headers: {
                  "Content-Type": "application/json",
                  Cookie: sessionCookies,
               },
            }
         );
         return addResultsRequest;
      } catch (error) {
         console.error(await error.response.data);
      }
   }
};