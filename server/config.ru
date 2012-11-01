# config.ru
$LOAD_PATH << File.join(File.dirname(__FILE__), "app")
require 'server_app'
run Jashboard::ServerApp

