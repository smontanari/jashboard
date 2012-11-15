require 'spec_helper'
require 'rack/test'
require 'sinatra'
require 'json_spec'
require 'builder/dashboard_builder'
require 'builder/monitor_builder'
require 'server_app'
require 'service/repository'
require 'service/monitor_runtime_service'

set :environment, :test

module Jashboard
  describe ServerApp do
    include Rack::Test::Methods

    before(:each) do
      @mock_repository = double("repository")
      FileRepository.stub(:new).and_return(@mock_repository)
      def app
        subject
      end
    end

    context "Retrieving data" do
      before(:each) do
        @mock_monitor_service = double
        MonitorRuntimeService.stub(:new).and_return(@mock_monitor_service)
      end

      describe("GET /ajax/dashboards") do
        it("should return the dashboard and monitor data from the repository and return the view") do
          dashboard1 = DashboardBuilder.new.with_id("dashboard1").with_monitor_id("monitor1").with_monitor_id("monitor2").build
          dashboard2 = DashboardBuilder.new.with_id("dashboard2").with_monitor_id("monitor3").build
          @mock_repository.should_receive(:load_dashboards).and_return([dashboard1, dashboard2])
          @mock_repository.should_receive(:load_monitor).with("monitor1").and_return("test.monitor.1")
          @mock_repository.should_receive(:load_monitor).with("monitor2").and_return("test.monitor.2")
          @mock_repository.should_receive(:load_monitor).with("monitor3").and_return("test.monitor.3")
          DashboardView.stub(:new).with(dashboard1, ["test.monitor.1", "test.monitor.2"]).and_return("test.dashboardview1")
          DashboardView.stub(:new).with(dashboard2, ["test.monitor.3"]).and_return("test.dashboardview2")

          get '/ajax/dashboards'

          last_response.should be_ok
          last_response.content_type.should include('application/json')
          last_response.body.should be_json_eql %(["test.dashboardview1", "test.dashboardview2"])
        end
      end

      describe("GET /ajax/monitor/:id/runtime") do
        it("should load monitor from the repository and return the runtime info from the service") do
          @mock_repository.should_receive(:load_monitor).with("test-monitor-id").and_return("test-monitor")
          @mock_monitor_service.should_receive(:get_monitor_runtime_info).with("test-monitor").and_return({id: "test-monitor-runtime"})

          get '/ajax/monitor/test-monitor-id/runtime'

          last_response.should be_ok
          last_response.content_type.should include('application/json')
          last_response.body.should be_json_eql %({"id": "test-monitor-runtime"})
        end
      end
    end

    context "Dashboard create" do
      describe("POST /ajax/dashboard") do
        before(:each) do
          @dashboard = double
          Dashboard.stub(:new).with("test.dashboard.name").and_return(@dashboard)
          DashboardView.stub(:new).and_return("something")
        end
        it("should persist the dashboard to the repository") do
          @mock_repository.should_receive(:save_dashboard).with(@dashboard)

          post '/ajax/dashboard', %({"name": "test.dashboard.name"})
        end
        it("should return the dashboard view as json") do
          new_dashboard = double
          @mock_repository.stub(:save_dashboard).and_return(new_dashboard)
          DashboardView.should_receive(:new).with(new_dashboard).and_return({id: "test-dashboard"})

          post '/ajax/dashboard', %({"name": "test.dashboard.name"})

          last_response.status.should == 201
          last_response.content_type.should include('application/json')
          last_response.body.should be_json_eql %({"id": "test-dashboard"})
        end
      end
    end

    context "Creating monitors" do
      describe("POST /ajax/dashboard/:dashboard_id/monitor") do
        before(:each) do
          @monitor = MonitorBuilder.as_build_monitor.
            with_id("789").
            build
          @mock_repository.stub(:save_monitor).and_return(@monitor)
          @dashboard = DashboardBuilder.new.
            with_monitor_id("123").
            with_monitor_id("456").
            build
          @mock_repository.stub(:load_dashboard).with("test.dashboard.id").and_return(@dashboard)
          @mock_repository.stub(:save_dashboard)
          CIServer::ServerSettingsFactory.stub(:get_settings)
        end

        it("should persist the monitor to the repository") do
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

        it("should add the monitor id to the specified dashboard") do
          post '/ajax/dashboard/test.dashboard.id/monitor', "{}"

          @dashboard.monitor_ids.length.should == 3
          @dashboard.monitor_ids.should include "123"
          @dashboard.monitor_ids.should include "456"
          @dashboard.monitor_ids.should include "789"
        end

        it("should persist the dashboard to the repository") do
          @mock_repository.should_receive(:save_dashboard).with(@dashboard)

          post '/ajax/dashboard/test.dashboard.id/monitor', "{}"
        end
      end
    end
  end
end
