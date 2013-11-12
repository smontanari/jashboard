$LOAD_PATH << File.join(File.dirname(__FILE__), '/../../spec')
$JSON_FIXTURE_PATH = File.join(File.dirname(__FILE__), '/../../../web/test/scenarios/fixtures')

require 'rack/test'
require 'json_spec'
require 'spec_helper'
require 'server_app'
require 'fake_server'

ENV['JASHBOARD_ENV'] = 'test'
Jashboard::ServerApp.set :environment, :test

def app
  Jashboard::ServerApp.new
end

include Rack::Test::Methods
include JsonSpec::Matchers
