require 'sinatra/base'
require "sinatra/json"
require 'json'
require 'service/repository'
require 'model/dashboard_view'
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
      dashboard_views = @repository.load_dashboards.map do |dashboard|
        monitors = dashboard.monitor_ids.map do |monitor_id|
          @repository.load_monitor(monitor_id)
        end
        DashboardView.new(dashboard, monitors)
      end
      json(dashboard_views)
    end

    get '/ajax/monitor/:id/runtime' do
      monitor = @repository.load_monitor(params[:id])
      json(MonitorRuntimeService.new.get_monitor_runtime_info(monitor))
    end

    post '/ajax/dashboard' do
      dashboard_params = JSON.parse(request.body.read)
      dashboard = @repository.save_dashboard(Dashboard.new(dashboard_params['name']))
      status 201
      json(DashboardView.new(dashboard))
    end

    post '/ajax/dashboard/:dashboard_id/monitor' do
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
