require 'plugins/build/adapters/jenkins_adapter'
require 'plugins/build/adapters/go_adapter'

include Jashboard::Plugin::CIServer::JenkinsAdapter
include Jashboard::Plugin::CIServer::GoAdapter
