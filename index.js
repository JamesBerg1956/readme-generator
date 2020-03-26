// import inquirer
const fs = require("fs");
const util = require("util");
const inquirer = require("inquirer");
const axios = require("axios");

const questions = 
[
    
];

const writeFileAsync = util.promisify(fs.writeFile);

//create var to store profile url
var strGitHubProfileURL = "";
var strGitHubUserName = "";

//create empty array of repo names
var arrRepoNames = [];
//create an array of license choices
const arrLicenses = 
[
    "apache-2.0","bsd-3-clause","cc-by-4.0","epl-1.0","gpl-3.0","lgpl-3.0","ms-pl","mit","mpl-2.0","osi-3.0","unlicense"
]


function writeToFile(fileName, data) {
}

// START init() function
function init() {

    // Call enquirer to get GitHub Username
    inquirer
        // START inquirer prompt
        .prompt([
            {
                type: "input",
                message: "Enter a GitHub Username.",
                name: "UserName"
            }
        ])
        // END inquirer prompt

        // START Axios call
        .then(function({UserName}){
            
            strGitHubUserName = UserName;

            //create queryString
            var queryString = `https://api.github.com/users/${strGitHubUserName}/repos?per_page=100`
            
            //call axios
            axios
            // URL for API call
            .get(queryString)

            // START axios promise
            .then(function(response){
                
                //create var to store repos
                var arrRepos = response.data;
                
                //loop through repo array
                arrRepos.forEach(element => {

                    // add repo name to array
                    arrRepoNames.push(element.name);

                    //get strGitHubProfileURL
                    strGitHubProfileURL = element.owner.avatar_url;

                })
    
            })
            // END axios promise
            // START second inquirer prompt
            .then(function(){
                // TODO: add questions from object array
                inquirer
                    .prompt([
                       {
                           type: "list",
                           choices: arrRepoNames,
                           message: "Select the repository for this project",
                           name: "Repo"
                       },
                       {
                           type: "input",
                           message: "Enter a description of what the project does",
                           name: "Description"
                       },
                       {
                           type: "input",
                           message: "Enter what the project is useful for",
                           name: "Usage"
                       },
                       {
                           type: "list",
                           choices: arrLicenses,
                           message: "Select the license for the project",
                           name: "License"
                       },
                       {
                           type: "input",
                           message: "Describe how you performed testing on the project",
                           name: "Testing"
                       },
                       {
                           type: "input",
                           message: "Enter an email address where user can contact you",
                           name: "Contact"
                       }
                    ])
                    // START readme.md creation
                    .then(function({Repo, Description, Usage, License, Testing, Contact}){
                        
                        // write title header section
                        // TODO: include GitHub profile picture
                        var strTitle =
                        `![JamesBerg1956](${strGitHubProfileURL})\n# ${Repo}`;
                        
                        // write table of contents section
                        var strTableOfContents = 
                        `\n\n## Table of Contents\n\n[Description](./README.md#Description)\n\n[Installation](./README.md#Installation)\n\n[Usage](./README.md#Usage)\n\n[Licensing](./README.md#Licensing)\n\n[Contributing](./README.md#Contributing)\n\n[Testing](./README.md#Testing)\n\n[Questions](./README.md#Questions)`;
                        
                        // write description section
                        var strDescription = 
                        `\n## Description
                        \n${Description}`;
                        
                        // write installation section
                        var strInstallation = 
                        `\n## Installation
                        \n1. Clone the repo
                        \n\`git clone https://github.com/${strGitHubUserName}/${Repo}.git\`
                        \n2. Install npm packages
                        \n\`npm install\``;
                        
                        // write usage section
                        var strUsage =
                        `\n## Usage
                        \n${Usage}`;
                        
                        // Write license section
                        var strLicense = 
                        `\n## Licensing
                        \nThis project is licensed under ${License}.`;
                        
                        // TODO: add license badge

                        // write contributing section
                        var strContributing = 
                        `\n## Contributing
                        \n###### Step 1
                        \n* Option 1
                        \n  - Fork this repository
                        \n* Option 2
                        \n  - Clone this repository \`git clone https://github.com/${strGitHubUserName}/${Repo}.git\`
                        \n###### Step 2
                        \n* Make local changes
                        \n###### Step 3
                        \n* Create a new pull request using \`https://github.com/${strGitHubUserName}/${Repo}/compare/\``;
                        
                        // Write the testing section
                        var strTesting =
                        `\n## Testing
                        \n${Testing}`;
                        
                        // Write the contact section
                        // TODO: format Contact as email link
                        var strContact =
                        `\n## Questions
                        \nYou can reach me for questions at: ${Contact}`;
                        
                        //concat readme content
                        var strReadmeContent = `${strTitle}${strTableOfContents}${strDescription}${strInstallation}${strUsage}${strLicense}${strContributing}${strTesting}${strContact}`;
                        
                        writeFileAsync("README.md", strReadmeContent)
                        .then(function(data){
                            console.log("README.md succesfully created");
                        })
                        .catch(function(err){
                            if(err){
                                console.log("writeFileAsync error: "+ err);
                            }
                        });
                                                
                    })
                    // END readme.md creation
                    // START document writer catch
                    .catch(function(err){
                        if(err){
                            console.log("document writer catch: "+err);
                        }
                    });
                    // END document writer catch

            })
            // END second inquirer prompt

            // START axios catch
            .catch(function(err){
                //error handling for axios
                if(err){
                    console.log("Axios catch: "+err);
                }
            });
            // END axios catch

        })
        // START inquirer catch
        .catch(function(err){
            //error handling for inquirer
            if(err){
                console.log("Inquirer catch 1: "+err);
            }
        });
        // END inquirer catch

}
// END init() function

init();
