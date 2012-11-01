require 'sinatra/base'
require "sinatra/json"
require 'json'
require 'service/repository'
require 'service/monitor_runtime_service'

module Jashboard
  class ServerApp < Sinatra::Base
    set :public_folder, File.join(File.dirname(__FILE__), '../../web')
    set :json_encoder, :to_json
    helpers Sinatra::JSON
    enable :logging
    configure :development do |conf|
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
  end
end
