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

    def initialize(*args)
      super(*args)
      @repository = FileRepository.new
    end

    get '/ajax/dashboards' do
      #json(FileRepository.new.load_dashboards)
      json(@repository.load_dashboards)
    end

    get '/ajax/monitor/:id' do
      #monitor = FileRepository.new.load_monitor(params[:id])
      monitor = @repository.load_monitor(params[:id])
      monitor_view = MonitorRuntimeService.new.get_monitor_view(monitor)
      json(monitor_view)
    end

    post '/ajax/dashboard/:dashboard_id/monitor' do
      #@repository = FileRepository.new
      monitor = create_monitor(JSON.parse(request.body.read))
      add_monitor_to_dashboard(params[:dashboard_id], monitor)
    end

    private

    def create_monitor(monitor_json)
      new_monitor = BuildMonitor.new
      new_monitor.name = monitor_json['name']
      new_monitor.refresh_interval = monitor_json['refresh_interval']
      settings = monitor_json['ciserver_settings']
      new_monitor.ciserver_settings = CIServer::ServerSettingsFactory.get_settings(settings)
      @repository.save_monitor(new_monitor)
    end

    def add_monitor_to_dashboard(dashboard_id, monitor)
      dashboard = @repository.load_dashboard(dashboard_id)
      dashboard.monitor_ids << monitor.id
      @repository.save_dashboard(dashboard)
    end
  end
end
