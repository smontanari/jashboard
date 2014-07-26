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
      allow(FileRepository).to receive(:new).and_return(@mock_repository)
      @mock_monitor_plugin_dispatcher = double("monitor_plugin_dispatcher")
      @mock_monitor = double
      allow(@mock_monitor).to receive(:type).and_return("test_type")
      allow(@mock_monitor).to receive(:configuration).and_return("test_configuration")
      allow(Plugin).to receive(:load_monitor_plugins).and_return(@mock_monitor_plugin_dispatcher)
      def app
        subject
      end
    end

    describe 'redirection' do
      it 'redirects GET / to /index.html' do
        get '/'

        expect(last_response.status).to eq(302)
        expect(last_response['Location']).to include('/index.html')
      end
    end

    context "Error handling" do
      it("should return a response with an error description") do
        expect(@mock_repository).to receive(:load_dashboards).and_raise("test_error")

        get '/ajax/dashboards'

        expect(last_response.status).to eq(500)
        expect(last_response.body).to eq("test_error")
      end
    end

    context "Data retrieval" do
      describe("GET /ajax/dashboards") do
        it("should return the dashboard and monitor data from the repository as json") do
          dashboard1 = DashboardBuilder.new.with_id("dashboard1").with_monitor_id("monitor1").with_monitor_id("monitor2").build
          dashboard2 = DashboardBuilder.new.with_id("dashboard2").with_monitor_id("monitor3").build
          expect(@mock_repository).to receive(:load_dashboards).and_return([dashboard1, dashboard2])
          (1..3).each {|n| expect(@mock_repository).to receive(:load_monitor).with("monitor#{n}").and_return("test.monitor.#{n}")}
          allow(DashboardView).to receive(:new).with(dashboard1, ["test.monitor.1", "test.monitor.2"]).and_return("test.dashboardview1")
          allow(DashboardView).to receive(:new).with(dashboard2, ["test.monitor.3"]).and_return("test.dashboardview2")

          get '/ajax/dashboards'

          expected_response = %(["test.dashboardview1","test.dashboardview2"])
          expect(last_response).to be_ok
          expect(last_response.content_type).to include('application/json')
          expect(last_response.body).to be_json_eql expected_response
        end
      end

      describe("GET /ajax/monitor/:id/runtime") do
        it("should load monitor from the repository and return the runtime info from the service") do
          expect(@mock_repository).to receive(:load_monitor).with("test-monitor-id").and_return(@mock_monitor)
          expect(@mock_monitor_plugin_dispatcher).to receive(:get_runtime_info).with(@mock_monitor).
            and_return(Struct.new(:some_attr).new("test-monitor-runtime"))

          get '/ajax/monitor/test-monitor-id/runtime'

          expect(last_response).to be_ok
          expect(last_response.content_type).to include('application/json')
          expect(last_response.body).to be_json_eql %({"someAttr":"test-monitor-runtime"})
        end
      end
    end

    context "Data deletion" do
      describe("DELETE /ajax/dashboard/:dashboard_id/monitor/:monitor_id") do
        before(:each) do
          @dashboard = DashboardBuilder.new.with_id("test_dashboard").with_monitor_id("monitor1").with_monitor_id("test-monitor-id").build
          allow(@mock_repository).to receive(:load_dashboard).with("test_dashboard").and_return(@dashboard)
          allow(@mock_repository).to receive(:save_dashboard)
          allow(@mock_repository).to receive(:delete_monitor)
        end

        it("should remove the monitor from the repository") do
          expect(@mock_repository).to receive(:delete_monitor).with("test-monitor-id")

          delete '/ajax/dashboard/test_dashboard/monitor/test-monitor-id'

          expect(last_response.status).to eq(204)
        end
        it("should persist the dashboard without the monitor") do
          expect(@mock_repository).to receive(:save_dashboard).with(@dashboard)

          delete '/ajax/dashboard/test_dashboard/monitor/test-monitor-id'

          expect(@dashboard.monitor_ids.length).to eq(1)
          expect(@dashboard.monitor_ids).to include "monitor1"
        end
      end
      describe("DELETE /ajax/dashboard/:dashboard_id") do
        before(:each) do
          @dashboard = DashboardBuilder.new.with_id("test_dashboard").with_monitor_id("monitor1").with_monitor_id("monitor2").build
          allow(@mock_repository).to receive(:load_dashboard).with("test_dashboard").and_return(@dashboard)
          allow(@mock_repository).to receive(:save_dashboard)
          allow(@mock_repository).to receive(:delete_monitor)
        end

        it("should remove the dashboard from the repository") do
          expect(@mock_repository).to receive(:delete_dashboard).with("test_dashboard")

          delete '/ajax/dashboard/test_dashboard'

          expect(last_response.status).to eq(204)
        end
        it("should remove all the the monitors belonging to the dashboard") do
          expect(@mock_repository).to receive(:delete_monitor).with("monitor1")
          expect(@mock_repository).to receive(:delete_monitor).with("monitor2")

          delete '/ajax/dashboard/test_dashboard'
        end
      end
    end

    context "Dashboard create" do
      describe("POST /ajax/dashboard") do
        before(:each) do
          @dashboard = double
          allow(Dashboard).to receive(:new).with("test.dashboard.name").and_return(@dashboard)
          allow(DashboardView).to receive(:new).and_return("something")
        end
        it("should persist the dashboard to the repository") do
          expect(@mock_repository).to receive(:save_dashboard).with(@dashboard)

          post '/ajax/dashboard', %({"name":"test.dashboard.name"})
        end
        it("should return the dashboard view as json") do
          new_dashboard = double
          allow(@mock_repository).to receive(:save_dashboard).and_return(new_dashboard)
          expect(DashboardView).to receive(:new).with(new_dashboard).and_return({id:"test-dashboard"})

          post '/ajax/dashboard', %({"name":"test.dashboard.name"})

          expect(last_response.status).to eq(201)
          expect(last_response.content_type).to include('application/json')
          expect(last_response.body).to be_json_eql %({"id":"test-dashboard"})
        end
      end
    end

    context "Dashboard update" do
      describe("PUT /ajax/dashboard/:dashboard_id") do
        before(:each) do
          @dashboard = Dashboard.new
          expect(@mock_repository).to receive(:load_dashboard).with("test_id").and_return(@dashboard)
          allow(@mock_repository).to receive(:save_dashboard)
        end
        it("should return a successful response") do
          put '/ajax/dashboard/test_id', %({"name":"test.dashboard.name"})

          expect(last_response.status).to eq(204)
          expect(last_response.body).to be_empty
        end
        it("should persist the dashboard to the repository") do
          expect(@mock_repository).to receive(:save_dashboard).with(@dashboard)

          put '/ajax/dashboard/test_id', %({"name":"test.dashboard.name"})

          expect(@dashboard.name).to eq("test.dashboard.name")
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
          allow(@mock_repository).to receive(:load_dashboard).with("test.dashboard.id").and_return(@dashboard)
          allow(@mock_repository).to receive(:save_dashboard)
          @monitor_json = %(
            {
              "name": "test.monitor.name",
              "refreshInterval": 345,
              "type": "test_type",
              "position": {"top": 10, "left": 20},
              "size": {"width": 100, "height": 200},
              "configuration": {
                "attrOne": "test_attr1",
                "attrTwo": 123
              }
            })
        end

        it("should persist the monitor to the repository") do
          expect(@mock_repository).to receive(:save_monitor) do |monitor|
            @actual_monitor = monitor
            monitor
          end

          post '/ajax/dashboard/test.dashboard.id/monitor', @monitor_json

          expect(@actual_monitor.type).to eq("test_type")
          expect(@actual_monitor.name).to eq("test.monitor.name")
          expect(@actual_monitor.refresh_interval).to eq(345)
          expect(@actual_monitor.position.top).to eq(10)
          expect(@actual_monitor.position.left).to eq(20)
          expect(@actual_monitor.size.width).to eq(100)
          expect(@actual_monitor.size.height).to eq(200)
          expect(@actual_monitor.configuration.attr_one).to eq("test_attr1")
          expect(@actual_monitor.configuration.attr_two).to eq(123)
        end

        it("should persist the dashboard with the added monitor") do
          expect(@mock_repository).to receive(:save_dashboard).with(@dashboard)
          new_monitor_id = Object.new
          def new_monitor_id.to_s
            "789"
          end

          allow(@mock_repository).to receive(:save_monitor) do |monitor|
            monitor.id = new_monitor_id
            monitor
          end

          post '/ajax/dashboard/test.dashboard.id/monitor', @monitor_json

          expect(@dashboard.monitor_ids.length).to eq(3)
          expect(@dashboard.monitor_ids).to include "123"
          expect(@dashboard.monitor_ids).to include "456"
          expect(@dashboard.monitor_ids).to include "789"
        end

        it("should return the monitor as json") do
          allow(@mock_repository).to receive(:save_monitor) do |monitor|
            allow(monitor).to receive(:id)
            allow(monitor).to receive(:to_json).and_return("test_json")
            monitor
          end

          post '/ajax/dashboard/test.dashboard.id/monitor', @monitor_json

          expect(last_response.status).to eq(201)
          expect(last_response.content_type).to include('application/json')
          expect(last_response.body).to eq("test_json")
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

          expect(@mock_repository).to receive(:load_monitor).with("test-monitor-id").and_return(@monitor)
          allow(@mock_repository).to receive(:save_monitor)
          @monitor_json = %(
            {
              "name": "test.new.monitor.name",
              "refreshInterval": 321,
              "type": "test_type",
              "configuration": {
                "attrOne": "test_new_attr1",
                "attrTwo": 654
              }
            })
        end

        it("should return a successful response") do
          put '/ajax/monitor/test-monitor-id/configuration', @monitor_json

          expect(last_response.status).to eq(204)
          expect(last_response.body).to be_empty
        end
        it("should update the monitor details") do
          expect(@mock_repository).to receive(:save_monitor).with(@monitor)
          
          put '/ajax/monitor/test-monitor-id/configuration', @monitor_json

          expect(@monitor.name).to eq("test.new.monitor.name")
          expect(@monitor.refresh_interval).to eq(321)
          expect(@monitor.type).to eq("test_type")
          @monitor.configuration.attr_one == "test_new_attr1"
          @monitor.configuration.attr_two == 654
        end
      end

      describe("PUT /ajax/monitor/:monitor_id/position") do
        before(:each) do
          @monitor = MonitorBuilder.new.
            with_id("test-monitor-id").
            build
          expect(@mock_repository).to receive(:load_monitor).with("test-monitor-id").and_return(@monitor)
          allow(@mock_repository).to receive(:save_monitor)
        end

        it("should return a successful response") do
          put '/ajax/monitor/test-monitor-id/position', %({"top": 243, "left": 765})

          expect(last_response.status).to eq(204)
          expect(last_response.body).to be_empty
        end
        it("should update the monitor position") do
          expect(@mock_repository).to receive(:save_monitor).with(@monitor)
          
          put '/ajax/monitor/test-monitor-id/position', %({"top": 243, "left": 765})

          expect(@monitor.position.top).to eq(243)
          expect(@monitor.position.left).to eq(765)
        end
      end
      describe("PUT /ajax/monitor/:monitor_id/size") do
        before(:each) do
          @monitor = MonitorBuilder.new.
            with_id("test-monitor-id").
            build
          expect(@mock_repository).to receive(:load_monitor).with("test-monitor-id").and_return(@monitor)
          allow(@mock_repository).to receive(:save_monitor)
        end

        it("should return a successful response") do
          put '/ajax/monitor/test-monitor-id/size', %({"width": 243, "height": 765})

          expect(last_response.status).to eq(204)
          expect(last_response.body).to be_empty
        end
        it("should update the monitor size") do
          expect(@mock_repository).to receive(:save_monitor).with(@monitor)
          
          put '/ajax/monitor/test-monitor-id/size', %({"width": 243, "height": 765})

          expect(@monitor.size.width).to eq(243)
          expect(@monitor.size.height).to eq(765)
        end
      end
    end
  end
end
