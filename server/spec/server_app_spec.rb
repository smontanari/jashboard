require 'spec_helper'
require 'rack/test'
require 'sinatra'
require 'json_spec'
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
      @mock_monitor = double
      @mock_monitor.stub(:type).and_return("test_type")
      @mock_monitor.stub(:configuration).and_return("test_configuration")
      Plugin.stub(:load_plugins).and_return({"test_type" => @mock_monitor_adapter})
      def app
        subject
      end
    end

    context "Error handling" do
      it("should return a response with an error description") do
        @mock_repository.should_receive(:load_dashboards).and_raise("test_error")

        get '/ajax/dashboards'

        last_response.status.should == 500
        last_response.body.should == "test_error"
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
          @mock_repository.should_receive(:load_monitor).with("test-monitor-id").and_return(@mock_monitor)
          @mock_monitor_adapter.should_receive(:get_runtime_info).with("test_configuration").and_return({id: "test-monitor-runtime"})

          get '/ajax/monitor/test-monitor-id/runtime'

          last_response.should be_ok
          last_response.content_type.should include('application/json')
          last_response.body.should be_json_eql %({"id":"test-monitor-runtime"})
        end
      end
    end

    context "Data deletion" do
      describe("DELETE /ajax/dashboard/:dashboard_id/monitor/:monitor_id") do
        before(:each) do
          @dashboard = DashboardBuilder.new.with_id("test_dashboard").with_monitor_id("monitor1").with_monitor_id("test-monitor-id").build
          @mock_repository.stub(:load_dashboard).with("test_dashboard").and_return(@dashboard)
          @mock_repository.stub(:save_dashboard)
          @mock_repository.stub(:delete_monitor)
        end

        it("should remove the monitor from the repository") do
          @mock_repository.should_receive(:delete_monitor).with("test-monitor-id")

          delete '/ajax/dashboard/test_dashboard/monitor/test-monitor-id'

          last_response.status.should == 204
        end
        it("should persist the dashboard without the monitor") do
          @mock_repository.should_receive(:save_dashboard).with(@dashboard)

          delete '/ajax/dashboard/test_dashboard/monitor/test-monitor-id'

          @dashboard.monitor_ids.length.should == 1
          @dashboard.monitor_ids.should include "monitor1"
        end
      end
      describe("DELETE /ajax/dashboard/:dashboard_id") do
        before(:each) do
          @dashboard = DashboardBuilder.new.with_id("test_dashboard").with_monitor_id("monitor1").with_monitor_id("monitor2").build
          @mock_repository.stub(:load_dashboard).with("test_dashboard").and_return(@dashboard)
          @mock_repository.stub(:save_dashboard)
          @mock_repository.stub(:delete_monitor)
        end

        it("should remove the dashboard from the repository") do
          @mock_repository.should_receive(:delete_dashboard).with("test_dashboard")

          delete '/ajax/dashboard/test_dashboard'

          last_response.status.should == 204
        end
        it("should remove all the the monitors belonging to the dashboard") do
          @mock_repository.should_receive(:delete_monitor).with("monitor1")
          @mock_repository.should_receive(:delete_monitor).with("monitor2")

          delete '/ajax/dashboard/test_dashboard'
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

    context "Dashboard update" do
      describe("PUT /ajax/dashboard/:dashboard_id") do
        before(:each) do
          @dashboard = Dashboard.new
          @mock_repository.should_receive(:load_dashboard).with("test_id").and_return(@dashboard)
          @mock_repository.stub(:save_dashboard)
        end
        it("should return a successful response") do
          put '/ajax/dashboard/test_id', %({"name":"test.dashboard.name"})

          last_response.status.should == 204
          last_response.body.should be_empty
        end
        it("should persist the dashboard to the repository") do
          @mock_repository.should_receive(:save_dashboard).with(@dashboard)

          put '/ajax/dashboard/test_id', %({"name":"test.dashboard.name"})

          @dashboard.name.should == "test.dashboard.name"
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
          @mock_repository.stub(:save_dashboard)
          @monitor_json = %(
            {
              "name": "test.monitor.name",
              "refresh_interval": 345,
              "type": "test_type",
              "position": {"top": 10, "left": 20},
              "size": {"width": 100, "height": 200},
              "configuration": {
                "attr1": "test_attr1",
                "attr2": 123
              }
            })
        end

        it("should persist the monitor to the repository") do
          @mock_repository.should_receive(:save_monitor) do |monitor|
            @actual_monitor = monitor
            monitor
          end

          post '/ajax/dashboard/test.dashboard.id/monitor', @monitor_json

          @actual_monitor.type.should == "test_type"
          @actual_monitor.name.should == "test.monitor.name"
          @actual_monitor.refresh_interval.should == 345
          @actual_monitor.position.top.should == 10
          @actual_monitor.position.left.should == 20
          @actual_monitor.size.width.should == 100
          @actual_monitor.size.height.should == 200
          @actual_monitor.configuration.attr1.should == "test_attr1"
          @actual_monitor.configuration.attr2.should == 123
        end

        it("should persist the dashboard with the added monitor") do
          @mock_repository.should_receive(:save_dashboard).with(@dashboard)
          new_monitor_id = Object.new
          def new_monitor_id.to_s
            "789"
          end
          monitor = MonitorBuilder.new.
            with_id(new_monitor_id).
            build
          @mock_repository.stub(:save_monitor).and_return(monitor)

          post '/ajax/dashboard/test.dashboard.id/monitor', @monitor_json

          @dashboard.monitor_ids.length.should == 3
          @dashboard.monitor_ids.should include "123"
          @dashboard.monitor_ids.should include "456"
          @dashboard.monitor_ids.should include "789"
        end

        it("should return the monitor as json") do
          monitor = double
          monitor.stub(:id)
          monitor.stub(:to_json).and_return("test_json")

          @mock_repository.stub(:save_monitor).and_return(monitor)
          post '/ajax/dashboard/test.dashboard.id/monitor', @monitor_json

          last_response.status.should == 201
          last_response.content_type.should include('application/json')
          last_response.body.should == "test_json"
        end
      end
    end

    context "Monitor update" do
      describe("PUT /ajax/monitor/:monitor_id/configuration") do
        before(:each) do
          @monitor = MonitorBuilder.new.
            with_id("test-monitor-id").
            with_name("test-monitor-name").
            with_refresh_interval(123).
            with_type("test_type").
            with_configuration(Struct.new(:attr1, :attr2).new("test_attr1", 456)).
            build

          @mock_repository.should_receive(:load_monitor).with("test-monitor-id").and_return(@monitor)
          @mock_repository.stub(:save_monitor)
          @monitor_json = %(
            {
              "name": "test.new.monitor.name",
              "refresh_interval": 321,
              "type": "test_type",
              "configuration": {
                "attr1": "test_new_attr1",
                "attr2": 654
              }
            })
        end

        it("should return a successful response") do
          put '/ajax/monitor/test-monitor-id/configuration', @monitor_json

          last_response.status.should == 204
          last_response.body.should be_empty
        end
        it("should update the monitor details") do
          @mock_repository.should_receive(:save_monitor).with(@monitor)
          
          put '/ajax/monitor/test-monitor-id/configuration', @monitor_json

          @monitor.name.should == "test.new.monitor.name"
          @monitor.refresh_interval.should == 321
          @monitor.type.should == "test_type"
          @monitor.configuration.attr1 == "test_new_attr1"
          @monitor.configuration.attr2 == 654
        end
      end

      describe("PUT /ajax/monitor/:monitor_id/position") do
        before(:each) do
          @monitor = MonitorBuilder.new.
            with_id("test-monitor-id").
            build
          @mock_repository.should_receive(:load_monitor).with("test-monitor-id").and_return(@monitor)
          @mock_repository.stub(:save_monitor)
        end

        it("should return a successful response") do
          put '/ajax/monitor/test-monitor-id/position', %({"top": 243, "left": 765})

          last_response.status.should == 204
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
          @monitor = MonitorBuilder.new.
            with_id("test-monitor-id").
            build
          @mock_repository.should_receive(:load_monitor).with("test-monitor-id").and_return(@monitor)
          @mock_repository.stub(:save_monitor)
        end

        it("should return a successful response") do
          put '/ajax/monitor/test-monitor-id/size', %({"width": 243, "height": 765})

          last_response.status.should == 204
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
