// How to maintain this file:
// Edit links inside one category block
// Use ['Name', 'URL', 'Optional description']

const I = (name, url, description = '') => ({ name, url, description });

window.linksByCategory = {

    Glass: [

        I('Glass Releases', 'https://jira2.horizon.bankofamerica.com/projects/GLASS'),
        I('Octane access ticket for myself', 'https://jira3.horizon.bankofamerica.com/browse/CODE-35339'),
        I('Glass Early Adoption', 'https://jira2.horizon.bankofamerica.com/browse/GLASS-3765'),
        I('Glass Issues', 'https://horizon.bankofamerica.com/docs/display/GLASS'),
        I('Glass Builds PROD', 'https://build2.horizon.bankofamerica.com/job/GLASS/job/master'),
        I('Glass Builds UAT', 'https://build2.horizon.bankofamerica.com/job/glass/job/develop'),
        I('Glass Release Calendar', 'https://horizon.bankofamerica.com/docs/display/GLASS'),
        I('Glass Scrum', 'https://goto.webex.com/goto/pnp'),
        I('Regression Testing Task', 'https://horizon.bankofamerica.com/docs/display/GLASS'),
        I('Glass Regression Estimation', 'https://horizon.bankofamerica.com/docs/display/GLASS'),
        I('Glass Daily Task', 'https://horizon.bankofamerica.com/docs/display/GLASS'),
        I('Glass Bug Template', 'https://jira2.horizon.bankofamerica.com/browse/GLASS-6165'),
        I('Glass UI Release Rotation', 'https://horizon.bankofamerica.com/docs/display/GLASS'),
        I('Glass Regression Observations', 'https://horizon.bankofamerica.com/docs/display/GLASS'),
        I('Glass Release Fix version', 'https://jira3.horizon.bankofamerica.com/browse/CODE'),
        I('Glass Daily Task', 'https://horizon.bankofamerica.com/docs/display/GLASS'),
        I('Glass Code Bitbucket', 'https://scm.horizon.bankofamerica.com/projects/GLASS'),
        I('Glass Automation Status', 'https://horizon.bankofamerica.com/docs/display/GLASS'),
    ],

    Octane: [

        I('Octane Home Page', 'https://octane.horizon.bankofamerica.com'),
        I('Octane Tests', 'https://octane.horizon.bankofamerica.com'),
        I('Octane Test Run Env', 'https://octane.horizon.bankofamerica.com'),
        I('Octane general wiki', 'https://horizon.bankofamerica.com/docs'),
        I('Octane Jira link', 'https://jira3.horizon.bankofamerica.com'),
        I('Octane Direct link', 'https://horizon.bankofamerica.com/docs'),
        I('Octane Tutorials', 'https://snapshots.bankofamerica.com'),

    ],

    QTest: [

        I('QTest Home Page', 'https://tcm.horizon.bankofamerica.com')

    ],

    Other: [

        I('Tech Self Service Action 1', 'https://techselfservice.bankofamerica.com'),
        I('Tech Self Service Action 2', 'https://techselfservice.bankofamerica.com'),
        I('CODE-322470', 'https://jira3.horizon.bankofamerica.com/browse/CODE-322470'),

    ],

    Meeting: [

        I('Fahim Webex', 'https://u.go/fahim'),
        I('Amol Webex', 'https://u.go/amol'),
        I('Dharmendra Webex', 'https://u.go/dharmendra'),
        I('Pavitha Webex', 'https://u.go/pavitha'),

    ],

};

window.linksData =
    Object.entries(window.linksByCategory).flatMap(([category, items]) =>
        items.map(item => ({ category, ...item }))
    );