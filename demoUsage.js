const configFile = require("./config.json");
const testRailHelper = require("./src/railInstance.js");
const jiraHelper = require("./src/jiraInstance.js");
const objectModels = require("./src/interfaces");

async function tryTestRail() {
    let trInstance = new testRailHelper(configFile.testrail);
    let cookies = trInstance.initateAuthenticationToken();
    let projectID = trInstance.getProjectIDS(cookies, "AVL Project"); // Get Project ID by project name

    let mileStoneID = trInstance.getMileStoneID(
        cookies,
        projectID,
        "Testcafe Integration" // Get Milestone ID by Milestone name
    );

    let testSuiteID = trInstance.getSuiteID(
        cookies,
        projectID,
        "Demo_TestSuite" // Get Test Suite ID by Testsuite name
    );

    let userID = trInstance.getUserID(cookies); // Get user ID which will be assigned to this test run

    let newTestRunObject = new objectModels.testRunObject(
        await testSuiteID,
        "Custom Plugin run-00" + Math.floor(Math.random() * 100).toString(),
        await userID,
        [15569, 166],
        await mileStoneID,
        "This is just a test description"
    ); // Create new test run object

    let testCasesResults = [new objectModels.testCaseResultObject(15569, 5, "Test result", "4m"), new objectModels.testCaseResultObject(15100, 2, "Test result2", "2m")];


    let addedRun = await trInstance.pushNewTestRun(
        await cookies,
        await projectID,
        newTestRunObject
    ); // Push test run object to test rail

    let addedResults = await trInstance.updateTestRunResults(
        await cookies,
        await addedRun,
        testCasesResults
    ); // Push the test run results

    console.log(await addedRun);
    console.log(await addedResults);
}

async function tryJira() {
    const jira = new jiraHelper(configFile.jira)
    let sessionCookies = await jira.initateAuthenticationToken()

    let jiraObject = new objectModels.jiraDefectObject(
        "AVLAUT",
        "Test Case Summary",
        "Test Case description",
        "Target component name",
        "Test case priority",
        "Test case severty",
        ["Array of labels"]
    ); // Create new jira defect object

    let createIssue = await jira.pushNewIssue(await sessionCookies, jiraObject)

    console.log(await createIssue)
}