require 'sinatra/base'
require "sinatra/json"
require 'json'
require 'service/repository'
require 'plugins/monitor_adapter'
require 'model/dashboard_view'

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
      @monitor_adapter = Plugin::MonitorAdapter.new
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
      json(@monitor_adapter.get_runtime_info(monitor))
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
      status 201
      json(monitor)
    end

    private

    def create_monitor(monitor_json)
      new_monitor = Monitor.new.tap do |monitor|
        monitor.name = monitor_json['name']
        monitor.refresh_interval = monitor_json['refresh_interval']
        monitor.type = monitor_json['type']
        monitor.configuration = @monitor_adapter.get_configuration(monitor_json['type'], monitor_json['configuration'])
      end
      @repository.save_monitor(new_monitor)
    end

    def add_monitor_to_dashboard(dashboard_id, monitor)
      dashboard = @repository.load_dashboard(dashboard_id)
      dashboard.monitor_ids << monitor.id
      @repository.save_dashboard(dashboard)
    end
  end
end
