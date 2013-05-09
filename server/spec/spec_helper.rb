$LOAD_PATH << File.join(File.dirname(__FILE__), '../app')
ENV['RACK_ENV'] = "test"
ENV['JASHBOARD_ENV'] = "test"

require 'extensions/jashboard_extensions'
require 'fsdb_helper'
require 'builder/builder_helper'
require 'builder/dashboard_builder'
require 'builder/monitor_builder'

