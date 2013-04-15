require 'plugins/build/adapters/jenkins_adapter'
require 'plugins/build/adapters/go_adapter'

include Jashboard::Plugin::Build::JenkinsAdapter
include Jashboard::Plugin::Build::GoAdapter
