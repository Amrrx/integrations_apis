const http = require("axios").default;
module.exports = class jiraInstance {
   constructor(configObject) {
      this.jiraConfig = configObject;
      this.userName = this.jiraConfig.jiraUsername;
      this.password = this.jiraConfig.jiraPassword;
      this.baseUrl = this.jiraConfig.jiraBaseURL;
      this.authEndPoint = this.jiraConfig.gAuthEndPoint;
      this.issueEndPoint = this.jiraConfig.gCreateIssue;
   }

   /**
    * Create jira session cookies
    * @returns Session Cookies
    */
   async initateAuthenticationToken() {
      try {
         const sd = await http.post(
            this.baseUrl + this.authEndPoint,
            {
               username: this.userName,
               password: this.password,
            },
            {
               headers: {
                  "Content-Type": "application/json",
               },
            }
         );
         console.log("Initiating Jira token status is: " + (sd.status == 200 ? "OK" : "Denied"));
         return await sd.headers["set-cookie"];
      } catch (error) {
         console.error(await error.response.data);
      }
   }

   /**
    * Push to jira 
    * @param {*} cookies 
    * @param {*} dataPayload 
    * @returns Request response object
    */
   async pushNewIssue(cookies, dataPayload) {
      try {
         const sd = await http.post(this.baseUrl + this.issueEndPoint, await dataPayload, {
            headers: {
               Cookie: await cookies,
               "Content-Type": "application/json",
            },
         });
         console.log("Defect pushed with key: " + sd.data.key);
         return await sd.data;
      } catch (error) {
         console.error(await error.response.data);
      }
   }
};