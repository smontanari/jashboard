require 'spec_helper'
require 'rack/test'
require 'sinatra'
require 'json_spec'
require 'extensions/jashboard_extensions'
require 'builder/dashboard_builder'
require 'builder/monitor_builder'
require 'server_app'
require 'service/repository'

set :environment, :test

module Jashboard
  describe ServerApp do
    include Rack::Test::Methods

    before(:each) do
      @mock_repository = double("repository")
      FileRepository.stub(:new).and_return(@mock_repository)
      @mock_monitor_adapter = double("monitor_adapter")
      Plugin::MonitorAdapter.stub(:new).and_return(@mock_monitor_adapter)
      def app
        subject
      end
    end

    context "Error handling" do
      it("should return a response with an error description") do
        @mock_repository.should_receive(:load_dashboards).and_raise("test_error")

        get '/ajax/dashboards'

        expected_response = %({"error": "test_error"})
        last_response.status.should == 500
        last_response.content_type.should include('application/json')
        last_response.body.should be_json_eql expected_response
      end
    end

    context "Data retrieval" do
      describe("GET /ajax/dashboards") do
        it("should return the dashboard and monitor data from the repository as json") do
          dashboard1 = DashboardBuilder.new.with_id("dashboard1").with_monitor_id("monitor1").with_monitor_id("monitor2").build
          dashboard2 = DashboardBuilder.new.with_id("dashboard2").with_monitor_id("monitor3").build
          @mock_repository.should_receive(:load_dashboards).and_return([dashboard1, dashboard2])
          (1..3).each {|n| @mock_repository.should_receive(:load_monitor).with("monitor#{n}").and_return("test.monitor.#{n}")}
          DashboardView.stub(:new).with(dashboard1, ["test.monitor.1", "test.monitor.2"]).and_return("test.dashboardview1")
          DashboardView.stub(:new).with(dashboard2, ["test.monitor.3"]).and_return("test.dashboardview2")

          get '/ajax/dashboards'

          expected_response = %(["test.dashboardview1","test.dashboardview2"])
          last_response.should be_ok
          last_response.content_type.should include('application/json')
          last_response.body.should be_json_eql expected_response
        end
      end

      describe("GET /ajax/monitor/:id/runtime") do
        it("should load monitor from the repository and return the runtime info from the service") do
          @mock_repository.should_receive(:load_monitor).with("test-monitor-id").and_return("test-monitor")
          @mock_monitor_adapter.should_receive(:get_runtime_info).with("test-monitor").and_return({id: "test-monitor-runtime"})

          get '/ajax/monitor/test-monitor-id/runtime'

          last_response.should be_ok
          last_response.content_type.should include('application/json')
          last_response.body.should be_json_eql %({"id":"test-monitor-runtime"})
        end
      end
    end

    context "Data deletion" do
      describe("DELETE /ajax/monitor") do
        before(:each) do
          dashboard1 = DashboardBuilder.new.with_id("dashboard2").with_monitor_id("monitor3").build
          @dashboard2 = DashboardBuilder.new.with_id("dashboard1").with_monitor_id("monitor1").with_monitor_id("monitor2").build
          @mock_repository.stub(:load_dashboards).and_return([dashboard1, @dashboard2])
          @mock_repository.stub(:save_dashboard)
          @mock_repository.stub(:delete_monitor)
        end

        it("should remove the monitor from the repository") do
          @mock_repository.should_receive(:delete_monitor).with("test-monitor-id")

          delete '/ajax/monitor/test-monitor-id'

          last_response.should be_ok
        end
        it("should persist the dashboard without the monitor") do
          @mock_repository.should_receive(:save_dashboard).with(@dashboard2)

          delete '/ajax/monitor/monitor2'

          @dashboard2.monitor_ids.length.should == 1
          @dashboard2.monitor_ids.should include "monitor1"
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

          post '/ajax/dashboard', %({"name":"test.dashboard.name"})
        end
        it("should return the dashboard view as json") do
          new_dashboard = double
          @mock_repository.stub(:save_dashboard).and_return(new_dashboard)
          DashboardView.should_receive(:new).with(new_dashboard).and_return({id:"test-dashboard"})

          post '/ajax/dashboard', %({"name":"test.dashboard.name"})

          last_response.status.should == 201
          last_response.content_type.should include('application/json')
          last_response.body.should be_json_eql %({"id":"test-dashboard"})
        end
      end
    end

    context "Monitor create" do
      describe("POST /ajax/dashboard/:dashboard_id/monitor") do
        before(:each) do
          @dashboard = DashboardBuilder.new.
            with_monitor_id("123").
            with_monitor_id("456").
            build
          @mock_repository.stub(:load_dashboard).with("test.dashboard.id").and_return(@dashboard)
          @mock_repository.stub(:load_dashboard).with("test.dashboard.id").and_return(@dashboard)
          @mock_repository.stub(:save_dashboard)
          monitor = Monitor.new.tap {|m| m.id = "789"}
          @mock_repository.stub(:save_monitor).and_return(monitor)
          @mock_monitor_adapter.stub(:get_configuration)
        end

        it("should persist the monitor to the repository") do
          mock_configuration = Object.new
          @mock_monitor_adapter.should_receive(:get_configuration).
            with(123, {"attr1" => "test_attr1", "attr2" => "test_attr2"}).
            and_return(mock_configuration)

          @mock_repository.should_receive(:save_monitor) do |monitor|
            monitor.type.should == 123
            monitor.name.should == "test.monitor.name"
            monitor.refresh_interval.should == 345
            monitor.configuration.should == mock_configuration
            monitor
          end

          post '/ajax/dashboard/test.dashboard.id/monitor', %(
            {
              "name": "test.monitor.name",
              "refresh_interval": 345,
              "type": 123,
              "configuration": {
                "attr1": "test_attr1",
                "attr2": "test_attr2"
              }
            })
        end

        it("should persist the dashboard with the added monitor") do
          @mock_repository.should_receive(:save_dashboard).with(@dashboard)

          post '/ajax/dashboard/test.dashboard.id/monitor', "{}"

          @dashboard.monitor_ids.length.should == 3
          @dashboard.monitor_ids.should include "123"
          @dashboard.monitor_ids.should include "456"
          @dashboard.monitor_ids.should include "789"
        end

        it("should return the monitor as json") do
          @mock_repository.stub(:save_monitor).and_return(Struct.new(:id, :attr).new("test_id", "test_attr"))

          post '/ajax/dashboard/test.dashboard.id/monitor', "{}"

          last_response.status.should == 201
          last_response.content_type.should include('application/json')
          last_response.body.should be_json_eql %({"id": "test_id", "attr": "test_attr"})
        end
      end
    end
    context "Monitor update" do
      describe("PUT /ajax/monitor/:monitor_id/position") do
        before(:each) do
          @monitor = Monitor.new
          @monitor.id = "test-monitor-id"
          @mock_repository.should_receive(:load_monitor).with("test-monitor-id").and_return(@monitor)
          @mock_repository.stub(:save_monitor)
        end

        it("should return a successful response") do
          put '/ajax/monitor/test-monitor-id/position', %({"top": 243, "left": 765})

          last_response.should be_ok
          last_response.body.should be_empty
        end
        it("should update the monitor position") do
          @mock_repository.should_receive(:save_monitor).with(@monitor)
          
          put '/ajax/monitor/test-monitor-id/position', %({"top": 243, "left": 765})

          @monitor.position.top.should == 243
          @monitor.position.left.should == 765
        end
      end
      describe("PUT /ajax/monitor/:monitor_id/size") do
        before(:each) do
          @monitor = Monitor.new
          @monitor.id = "test-monitor-id"
          @mock_repository.should_receive(:load_monitor).with("test-monitor-id").and_return(@monitor)
          @mock_repository.stub(:save_monitor)
        end

        it("should return a successful response") do
          put '/ajax/monitor/test-monitor-id/size', %({"width": 243, "height": 765})

          last_response.should be_ok
          last_response.body.should be_empty
        end
        it("should update the monitor size") do
          @mock_repository.should_receive(:save_monitor).with(@monitor)
          
          put '/ajax/monitor/test-monitor-id/size', %({"width": 243, "height": 765})

          @monitor.size.width.should == 243
          @monitor.size.height.should == 765
        end
      end
    end
  end
end
