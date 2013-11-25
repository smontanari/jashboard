# Jashboard

Jashboard is a web application that allows the user to set up dashboards to contain a variety of monitors that dynamically fetch and report any sort of information.

Jashboard works as a **single page web application**, where the client side is fully written in Javascript (AngularJS) and the server side is a simple Sinatra (Ruby) instance.

### Screenshots

<table>
  <tr>
    <td style="text-align:center">
      <a href="http://smontanari.github.io/jashboard/screenshots/generic_dashboard.png"><img src="http://smontanari.github.io/jashboard/screenshots/generic_dashboard-thb.png">A generic multi-dashboard set up
    </td>
    <td style="text-align:center">
      <a href="http://smontanari.github.io/jashboard/screenshots/build_monitor_form.png"><img src="http://smontanari.github.io/jashboard/screenshots/build_monitor_form-thb.png">Form to create a Build monitor
    </td>
    <td style="text-align:center">
      <a href="http://smontanari.github.io/jashboard/screenshots/git_monitor_form.png"><img src="http://smontanari.github.io/jashboard/screenshots/git_monitor_form-thb.png">Form to create a Git monitor
    </td>
  </tr>
</table>

## Why?
Initially the idea was to create a CI build monitor web application (right, like we needed another one…), but then I expanded the concept to be more general purpose and provide the ability to quickly extend the application and include plugins for any type of monitor you can think of.

## Currently supported monitor types
At the moment you can create and use the following type of monitors:

Monitor type  | Description | 
------------  | ----------- |
build/jenkins | monitor an existing Jenkins build | 
build/go      | monitor an existing Go build |
vcs/git       | monitor the commits made to a git repository/branch |
ipsum         | random generator of sentences (inspired by the *ipsum* gem). This is more for demo purposes |

## Installation
### Prerequisites
For the backend server you will need **Ruby** and **Bundler** installed on your machine. I've only tested the app with Ruby 1.9.3.  
For the frontend you will need [**npm**](https://npmjs.org/) and [**Bower**](http://bower.io/) to manage the javascript libraries, dependencies and packaging.

### Production instance

    $ cd deploy
    $ rake install

This will generate a directory `deploy/jashboard_app` which will contain the full webapp with only production files, css and javascript minified, environment variables set to production etc. You can then copy that folder anywhere you like or just leave it there.
	
After the install complete (successfully), you can then start the Sinatra application:

	$ ./start_server.sh
	
This will fire up a WEBRick server listening on port 8001. If you want a different port just change the script.  
Now you launch your favourite browser (and I mean browser, not IE) and load the app at

	http://<hostname>:8001/index.html

### Development instance
This is more for test/development purposes, that is you want to modify the code, the web styles, add a new monitor plugin, etc. and then test your changes.

#### Install dependencies

	$ cd web
	$ npm install    #install grunt and grunt plugins to build and run the tests
	$ bower install
	
	$ cd server
	$ bundle install

#### Start the server

	$./start_server.sh

This will start the application in *development* mode (more details about customising your Jashboard are given below).   
Note that nothing stops you from running the application in *development* mode and using it as a production instance.


## Usage
The application is pretty straightforward to use. 

* Start creating your dashboard using the *"Actions/Create new dashboard"* menu at the top of the page.
* Add a new monitor to your dashboard using the *"Add monitor"* button. 
* Once the monitor is in the dashboard you can modify its layout (i.e. size and position), as well as change its configuration settings.

## Demo it
You can try out the application without starting the server and just by running the javascript client it in your browser.
You only have to open the `web/index.html` file directly in your browser passing a particular parameter in the url, as in:

    file:///<path-to-the-repo>/web/index.html?test_scenario=demo
    
This way the application runs only on the browser, with simulated ajax responses from the server, and you can create/delete dashboards, monitors and get a glance of what the actual functionality would be like.

In order for this to work your browser needs to have permission to load files from the local file system. This should be fine for **Firefox** and **Safari**, but it might not work in Chrome. In that case you can try and start **Chrome** with a couple of special flags, like this:
    
    chrome --args --allow-file-access-from-files --incognito

# Developing your own monitor type
This is just a brief guide. More details will be put in the wiki (when I have the time).

Adding a new monitor type involves adding both a client side plugin and a server side plugin.
You can look at the existing monitor plugins that I've written to get an idea of what needs to be done, but basically the steps to follow are:

* Define a plugin type name. This may seem trivial, but the monitor type name is actually crucial for the application to work correctly. 
   
   Choose possibly a short name, with only alphanumeric characters, because it will be used both by javascript (client) and ruby (server) to dynamically invoke your plugin code. 

* Client side: 
    * **javascript**: this is where you write the logic to interpret the monitor runtime information and configuration
        1. Add your plugin type name in the array of plugins defined in `web/jashboard/plugins.js`.
        2. Create a folder with name equal to your plugin type name under web/jashboard/plugins i.e. `web/jashboard/plugins/<type_name>`. This folder will contain your custom code.
        3. Define a **module** (yes, I like modules even in javascript) `jashboard.plugin.<type-name>` which will include all your objects, variables, functions, etc.
        3. Add a `web/jashboard/plugins/<type_name>/MonitorAdapter.js` file which will define `jashboard.plugin.<type-name>.MonitorAdapter`, your very Monitor type adapter function.
        4. Add a `<type_name>_plugin.js` file which will load your MonitorAdapter.js plus any other file necessary to run your plugin.
    * **html**: this is how you render the monitor runtime information and configuration form
        1. Create a folder with name equal to your plugin type name under web/html/plugins i.e. `web/html/plugins/<type_name>`.
        2. Add a monitor_runtime_partial.html file which will be used to display the monitor runtime information.
        3. Add a monitor_form_partial.html file which will be used to display the monitor configuration form.
    * **styles**[optional]: this is how you add custom styles for your view/html elements
        1. Add a less file under web/css/plugins i.e. `web/css/plugins/jashboard-plugin-<type_name>.less`.
        2. Add @import statement to the base less file `web/css/jashboard.less` to load your specific less file i.e. `@import url('plugins/jashboard-plugin-<type_name>.less');`.
* Server side:
    1. Create a folder with name equal to your plugin type name under server/app/plugins i.e. `server/app/plugins/<type_name>`.
    2. Add your own ruby plugin class, extending `Jashboard::Plugin` and implementing a `get_runtime_info` method which will contain the logic necessary to fetch and return the monitor data.

Of course if you want to do things properly you should add tests for your monitor plugin, **Jasmine** and **FuncUnit** tests for the client/javascript side and **RSpec** and **Cucumber** for the server/ruby side. 

The **ipsum** monitor plugin is a very simple example that you can look at as a starting point for adding a new monitor plugin. Have fun!

# Copyright

Copyright &copy; 2013 Silvio Montanari. See LICENSE for details.

