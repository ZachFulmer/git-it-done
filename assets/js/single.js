var issueContainerEl = document.querySelector("#issues-container");
var limitwarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

var getRepoName = function()
{
    var queryString = document.location.search;

    var repoName = queryString.split("=")[1];
    
    if(repoName)
    {
        // display repo on the page
        repoNameEl.textContent = repoName;
        getRepoIssues(repoName);
    }
    else
    {
        // if no repo was given, redirect to the homepage
        document.location.replace("./index.html");
    }
    
};

var getRepoIssues = function(repo)
{
    var apiURL = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    fetch(apiURL).then(function(response) 
    {
        // Request was successful
        if(response.ok)
        {
            response.json().then(function(data)
            {
                // pass response data to dom function
                displayIssues(data);
            });

            if(response.headers.get("Link"))
            {
                displayWarning(repo);
            }
        }
        else
        {
            // if not successful, redirect to homepage
            document.location.replace("./index.html");  
        }
    });
};

var displayIssues = function(issues)
{
    if(issues.length === 0)
    {
        issueContainerEl.textContent = "This repo has no open issues";
        return;
    }

    for(var i = 0; i < issues.length; i++)
    {
        var issueEl = document.createElement("a");

        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append to container
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span");

        // check if issue is an actual issue or a pull request
        if(issues[i].pull_request)
        {
            typeEl.textContent = "(Pull Request)";
        }
        else
        {
            typeEl.textContent = "(Issue)";
        }

        // append to container
        issueEl.appendChild(typeEl);

        // append to html container
        issueContainerEl.appendChild(issueEl);
    }
};

var displayWarning = function(repo)
{
    //add text to warning container
    limitwarningEl.textContent = "To see more than 30 issues, visit ";

    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href","https://github.com/"+repo+"/issues");
    linkEl.setAttribute("target","_blank");

    // append to warning container
    limitwarningEl.appendChild(linkEl);
};

getRepoName();