# Jashboard

This is a web application that allows the user to set up dashboards that contains a variety of monitors that dynamically fetch and report information.

Jashboard works as a **single page web application**, where the client side is fully written in Javascript (AngularJS) and the server side is a simple Sinatra (Ruby) instance.

## Why?
I just wanted to have some fun and learn a bit of AngularJS. Initially the idea was to create a CI build monitor web application (right, like we needed another one…), but then I expanded the concept to be more general purpose and provide the ability to quickly extend the application and include any type of monitor you can think of.

## Currently supported monitor types
At the moment you can create and use the following type of monitors:

Monitor type  | Description | 
------------  | ----------- |
build/jenkins | monitor an existing Jenkins build | 
build/go      | monitor an existing Go build (actually this is still a work in progress, sorry) |
vcs/git       | monitor the commits made to a git repository/branch |
ipsum         | random generator of sentences (inspired by the *ipsum* gem). This is more for demo purposes |

## Installation
### Prerequisites
You will only need Ruby installed on your machine. I've only tested the app with Ruby 1.9.3, but I suppose you could try 2.0.0 and possibly nothing will break (I'm planning to switch to 2.0 at some point though).

### Production instance

    $ cd deploy
    $ rake install

This will generate a directory **deploy/jashboard_app** which will contain the full webapp with only production files, css and javascript minified, environment variables set. You can then copy that folder anywhere you like or just leave it there.

From within the application folder run the following script:

	$ bundle install --without=test
	
This will download and install all the the necessary gems for the server to run.

After bundle completes (successfully), you can then start the Sinatra application:

	$ ./start_server.sh
	
This will start up a WEBRick server listening on port 8001. If you want a different port just change the script.

Now you can fire up your favourite browser (and I mean browser, not IE) and load the app at

	http://<hostname>:8001/index.html

### Development instance
This is more for development purposes, that is you want to modify the code, the web styles, add a new monitor plugin, etc.

	$ cd server
	$ bundle install
	$./start_server.sh

This will start the application in *development* mode (more details about customising your Jashboard are given below).

Note that nothing stops you from running the application in *development* mode and using it for real.


## Usage
The application is pretty straightforward to use. 

* Start creating your dashboard using the *"Actions/Create new dashboard"* menu at the top of the page.
* Add a new monitor to your dashboard using the *"Add monitor"* button. 
* Once the monitor is in the dashboard you can modify its layout (i.e. size and position), as well as change its configuration settings.

# Developing your own monitor type
Working on this section...

# Copyright

Copyright (c) 2013 Silvio Montanari. See LICENSE for details.

