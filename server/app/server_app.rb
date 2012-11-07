require 'sinatra/base'
require "sinatra/json"
require 'json'
require 'service/repository'
require 'service/monitor_runtime_service'

module Jashboard
  class ServerApp < Sinatra::Base
    set :json_encoder, :to_json
    helpers Sinatra::JSON
    enable :logging
    configure :development do |conf|
      set :public_folder, File.join(File.dirname(__FILE__), '../../web')
      set :static_cache_control, "no-cache"
    end

    get '/ajax/dashboards' do
      json(FileRepository.new.load_dashboards)
    end

    get '/ajax/monitor/:id' do
      monitor = FileRepository.new.load_monitor(params[:id])
      monitor_view = MonitorRuntimeService.new.get_monitor_view(monitor)
      json(monitor_view)
    end

    post '/ajax/dashboard/:dashboard_id/monitor' do
      monitor = BuildMonitor.new
      params = JSON.parse(request.body.read)
      monitor.name = params['name']
      monitor.refresh_interval = params['refresh_interval']
      settings = params['ciserver_settings']
      monitor.ciserver_settings = CIServer::ServerSettingsFactory.get_settings(settings)

      FileRepository.new.save_monitor(monitor)
    end
  end
end
