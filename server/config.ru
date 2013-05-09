# config.ru
$LOAD_PATH << File.join(File.dirname(__FILE__), "app")
current_environment = 'development'

ENV['RACK_ENV'] = current_environment
ENV['JASHBOARD_ENV'] = current_environment

require 'server_app'
run Jashboard::ServerApp

