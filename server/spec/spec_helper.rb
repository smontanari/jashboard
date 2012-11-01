$LOAD_PATH << File.join(File.dirname(__FILE__), '../app')
ENV['RACK_ENV'] = "test"

require 'builder_helper'

