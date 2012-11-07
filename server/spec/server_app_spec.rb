require 'spec_helper'
require 'rack/test'
require 'sinatra'
require 'server_app'
require 'service/repository'
require 'service/monitor_runtime_service'

set :environment, :test

module Jashboard
  describe ServerApp do
    include Rack::Test::Methods
    def app
      ServerApp
    end

    before(:each) do
      @mock_repository = double("repository")
      FileRepository.stub(:new).and_return(@mock_repository)
    end

    context "Retrieving data" do
      before(:each) do
        @mock_monitor_service = double
        MonitorRuntimeService.stub(:new).and_return(@mock_monitor_service)
      end

      describe("GET /ajax/dashboards") do
        it("should return the dashboard view data as loaded from the repository") do
          @mock_repository.should_receive(:load_dashboards).and_return({test: "test.dashboardData"})

          get '/ajax/dashboards'

          last_response.should be_ok
          last_response.content_type.should include('application/json')
          last_response.body.should be_json_eql %({"test": "test.dashboardData"})
        end
      end

      describe("GET /ajax/monitor/:id") do
        it("should load monitor settings from the repository and create the view through the service") do
          @mock_repository.should_receive(:load_monitor).with("test-monitor-id").and_return("test-monitor")
          @mock_monitor_service.should_receive(:get_monitor_view).with("test-monitor").and_return({id: "test-monitor-view"})

          get '/ajax/monitor/test-monitor-id'

          last_response.should be_ok
          last_response.content_type.should include('application/json')
          last_response.body.should be_json_eql %({"id": "test-monitor-view"})
        end
      end
    end

    context "Inserting data" do
      describe("POST /ajax/dashboard/:dashboard_id/monitor") do
        it("should save the monitor to the repository") do
          monitor = double("monitor")
          settings = double("server_settings")
          BuildMonitor.stub(:new => monitor)
          CIServer::ServerSettingsFactory.should_receive(:get_settings).with({"type" => 1, "hostname" => "test.host", "port" => 567, "build_id" => "test-build"}).and_return(settings)
          monitor.should_receive(:name=).with("test.monitor.name")
          monitor.should_receive(:refresh_interval=).with(345)
          monitor.should_receive(:ciserver_settings=).with(settings)
          @mock_repository.should_receive(:save_monitor).with(monitor)

          post '/ajax/dashboard/test.dashboard.id/monitor', %(
            {
              "name": "test.monitor.name",
              "refresh_interval": 345,
              "type": 1,
              "ciserver_settings": {
                "type": 1,
                "hostname": "test.host",
                "port": 567,
                "build_id": "test-build"
              }
            })
        end
      end
    end
  end
end
