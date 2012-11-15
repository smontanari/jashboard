$LOAD_PATH << File.join(File.dirname(__FILE__), '../app')
ENV['RACK_ENV'] = "test"

require 'builder/builder_helper'
require 'builder/dashboard_builder'
require 'builder/monitor_builder'

