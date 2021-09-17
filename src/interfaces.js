class testRunObject {
   constructor(suiteID, name, userID, case_ids, mileStoneID, description) {
      return {
         suite_id: suiteID,
         name: name + ' - ' + "Automated Run - " + Math.floor(Math.random() * 1000) ,
         assignedto_id: userID,
         refs: "",
         case_ids: case_ids,
         include_all: false,
         milestone_id: mileStoneID,
         description: description + " \n" + "Auto created run by Afaqy reporter v1.0",
      };
   }
}

class testCaseResultObject {
   constructor(caseID, statusID, comments, elapsed) {
      return {
         case_id: caseID,
         status_id: statusID,
         comment: comments,
         elapsed: elapsed,
      };
   }
}

class jiraDefectObject {
   constructor(projectKey, caseSummery, caseDescr, componentName, priority, severity, labels) {
      return {
         fields: {
            project: {
               key: projectKey, //"AVLAUT",
            },
            summary: "Automated - " +  caseSummery, //"Another new test issue",
            description: caseDescr + " \n" + "Auto created defect by Afaqy reporter v1.0", //"This is only for testing purpose",
            issuetype: {
               name: "Bug",
            },
            components: [
               {
                  name: componentName, //"Automation",
               },
            ],
            priority: {
               "name": priority, //"High",
            },
            labels: labels, //["SystemTest", "BackEnd"],
            customfield_10700: { "value": severity },
         },
      };
   }
}

module.exports = {
   testRunObject,
   testCaseResultObject,
   jiraDefectObject,
};
