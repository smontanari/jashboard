require 'rubygems'
require 'bundler/setup'

require 'logger'
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
    log_dir = ENV['JASHBOARD_LOGDIR'] || File.join(File.dirname(__FILE__), '../log')
    Dir.mkdir(log_dir) unless Dir.exists?(log_dir)
    logfile = File.new("#{log_dir}/#{settings.environment}.log", 'w+')
    logfile.sync = true
    use Rack::CommonLogger, logfile
    logger = Logger.new(logfile, 'a+')

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
      if self.class.development? || self.class.test?
        logger.error(env['sinatra.error'].backtrace.join("\n"))
      end
      status 500
      env['sinatra.error'].to_s
    end

    get '/' do
      redirect '/index.html'
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
      create_success_response DashboardView.new(dashboard)
    end

    put '/ajax/dashboard/:dashboard_id' do
      modify_dashboard params[:dashboard_id] do |dashboard|
        dashboard_params = JSON.parse(request.body.read)
        dashboard.name = dashboard_params['name']
      end
    end

    post '/ajax/dashboard/:dashboard_id/monitor' do
      monitor = Monitor.new
      modify_dashboard params[:dashboard_id], false do |dashboard|
        monitor.init_from_json request.body.read
        @repository.save_monitor(monitor)
        dashboard.monitor_ids << monitor.id.to_s
      end
      create_success_response monitor
    end

    ['configuration', 'position', 'size'].each do |property|
      put "/ajax/monitor/:id/#{property}" do
        monitor = @repository.load_monitor(params[:id])
        monitor.send("update_#{property}_from_json".to_sym, request.body.read)
        @repository.save_monitor(monitor)
        update_success_response
      end
    end

    delete '/ajax/dashboard/:dashboard_id' do
      dashboard = @repository.load_dashboard(params[:dashboard_id])
      dashboard.monitor_ids.each { |id| @repository.delete_monitor(id) }
      @repository.delete_dashboard(dashboard.id)
      update_success_response
    end

    delete '/ajax/dashboard/:dashboard_id/monitor/:monitor_id' do
      modify_dashboard params[:dashboard_id] do |dashboard|
        monitor_id = params[:monitor_id]
        @repository.delete_monitor(monitor_id)
        dashboard.monitor_ids.delete(monitor_id)
      end
    end

    private

    def modify_dashboard dashboard_id, handle_response = true
      dashboard = @repository.load_dashboard(dashboard_id)
      yield(dashboard) if block_given?
      @repository.save_dashboard(dashboard)
      update_success_response if handle_response
    end

    def create_success_response obj
      status 201
      json obj
    end

    def update_success_response
      status 204
    end

    def convert_case(data)
      if data.is_a?(Array)
        return data.map {|obj| obj.to_map_with_camel_case_keys}
      end 
      data.to_map_with_camel_case_keys
    end
  end
end
