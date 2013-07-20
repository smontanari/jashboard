require 'rubygems'
require 'bundler/setup'

require 'sinatra/base'
require "sinatra/json"
require 'json'
require 'extensions/jashboard_extensions'
require 'service/repository'
require 'plugins/plugin'
require 'model/dashboard_view'

module Jashboard
  class ServerApp < Sinatra::Base
    set :json_encoder, :to_json
    helpers Sinatra::JSON
    enable :logging
    configure :development do |conf|
      set :public_folder, File.join(File.dirname(__FILE__), '../../web')
      set :static_cache_control, "no-cache"
      set :show_exceptions, :after_handler
    end
    configure :test do
      set :raise_errors, false
    end
    configure :production do |conf|
      set :public_folder, File.join(File.dirname(__FILE__), 'web')
    end

    def initialize(*args)
      super(*args)
      @repository = FileRepository.new
      @monitor_dispatcher = Plugin.load_monitor_plugins(File.join(File.dirname(__FILE__), 'plugins'))
    end

    error do
      # puts "********"
      # puts env['sinatra.error']
      # puts "********"
      status 500
      env['sinatra.error'].to_s
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
      runtime_data = @monitor_dispatcher.get_runtime_info(monitor)
      json(convert_case(runtime_data))
    end

    post '/ajax/dashboard' do
      dashboard_params = JSON.parse(request.body.read)
      dashboard = @repository.save_dashboard(Dashboard.new(dashboard_params['name']))
      status 201
      json(DashboardView.new(dashboard))
    end

    put '/ajax/dashboard/:dashboard_id' do
      dashboard_params = JSON.parse(request.body.read)
      dashboard = @repository.load_dashboard(params[:dashboard_id])
      dashboard.name = dashboard_params['name']
      dashboard = @repository.save_dashboard(dashboard)
      status 204
    end

    post '/ajax/dashboard/:dashboard_id/monitor' do
      data = JSON.parse(request.body.read)
      monitor = create_monitor(data)
      add_monitor_to_dashboard(params[:dashboard_id], monitor)
      status 201
      json(monitor)
    end

    put '/ajax/monitor/:id/configuration' do
      data = JSON.parse(request.body.read)
      monitor = @repository.load_monitor(params[:id])
      update_monitor(monitor, data)
      @repository.save_monitor(monitor)
      status 204
    end

    put '/ajax/monitor/:id/position' do
      data = JSON.parse(request.body.read)
      monitor = @repository.load_monitor(params[:id])
      monitor.position = get_monitor_position(data)
      @repository.save_monitor(monitor)
      status 204
    end

    put '/ajax/monitor/:id/size' do
      data = JSON.parse(request.body.read)
      monitor = @repository.load_monitor(params[:id])
      monitor.size = get_monitor_size(data)
      @repository.save_monitor(monitor)
      status 204
    end

    delete '/ajax/dashboard/:dashboard_id' do
      dashboard_id = params[:dashboard_id]
      dashboard = @repository.load_dashboard(dashboard_id)
      dashboard.monitor_ids.each { |id| @repository.delete_monitor(id) }
      @repository.delete_dashboard(dashboard_id)
      status 204
    end

    delete '/ajax/dashboard/:dashboard_id/monitor/:monitor_id' do
      dashboard_id = params[:dashboard_id]
      monitor_id = params[:monitor_id]
      @repository.delete_monitor(monitor_id)
      dashboard = @repository.load_dashboard(dashboard_id)
      dashboard.monitor_ids.delete(monitor_id)
      @repository.save_dashboard(dashboard)
      status 204
    end

    private

    def update_monitor(monitor, monitor_json)
      monitor.name = monitor_json['name']
      monitor.refresh_interval = monitor_json['refreshInterval']
      monitor.configuration = monitor_json['configuration'].to_struct_with_snake_keys
    end

    def create_monitor(monitor_json)
      new_monitor = Monitor.new.tap do |monitor|
        monitor.name = monitor_json['name']
        monitor.refresh_interval = monitor_json['refreshInterval']
        monitor.type = monitor_json['type']
        monitor.configuration = monitor_json['configuration'].to_struct_with_snake_keys
        monitor.position = get_monitor_position(monitor_json['position'])
        monitor.size = get_monitor_size(monitor_json['size'])
      end
      @repository.save_monitor(new_monitor)
    end

    def get_monitor_position(data)
      Struct.new(:top, :left).new(data['top'], data['left'])
    end

    def get_monitor_size(data)
      Struct.new(:width, :height).new(data['width'], data['height'])
    end

    def add_monitor_to_dashboard(dashboard_id, monitor)
      dashboard = @repository.load_dashboard(dashboard_id)
      dashboard.monitor_ids << monitor.id.to_s
      @repository.save_dashboard(dashboard)
    end

    def convert_case(data)
      if data.is_a?(Array)
        return data.map {|obj| obj.to_map_with_camel_case_keys}
      end 
      data.to_map_with_camel_case_keys
    end
  end
end
