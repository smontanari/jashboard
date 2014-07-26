require 'spec_helper'
require 'service/repository'

module Jashboard
  describe FileRepository do
    before(:each) do
      ENV['JASHBOARD_ENV'] = 'test'
      @db_helper = FSDBHelper.new("db/test")
      @db_helper.clean_data
    end

    it("should load a monitor from a yaml file") do
      @db_helper.serialize_monitor(MonitorBuilder.new.
        with_id("test-monitor-id").
        with_type(123).
        with_name("test monitor-name").
        with_refresh_interval(12).
        with_configuration(Struct.new(:attr1, :attr2).new("test_attr1", 1234)).
        build)

      monitor = subject.load_monitor("test-monitor-id")

      expect(monitor.id).to eq("test-monitor-id")
      expect(monitor.name).to eq("test monitor-name")
      expect(monitor.type).to eq(123)
      expect(monitor.refresh_interval).to eq(12)
      expect(monitor.configuration.attr1).to eq("test_attr1")
      expect(monitor.configuration.attr2).to eq(1234)
    end

    it("should delete a monitor yaml file") do
      @db_helper.serialize_monitor(MonitorBuilder.new.
        with_id("test-monitor-id").
        with_type(123).
        with_name("test monitor-name").
        with_refresh_interval(12).
        with_configuration(Struct.new(:attr1, :attr2).new("test_attr1", 1234)).
        build)

      subject.delete_monitor("test-monitor-id")

      expect(@db_helper.find_monitor("test-monitor-id")).to be_nil
    end

    it("should store a monitor as yaml into a file") do
      new_monitor = subject.save_monitor(
        MonitorBuilder.new.
        with_type(123).
        with_name("test new_name").
        with_refresh_interval(456).
        with_configuration(Struct.new(:attr1, :attr2).new("test_attr1", 1234)).
        build)

      expect(new_monitor.id).not_to be_nil
      @db_helper.verify_monitor(new_monitor.id) do |monitor|
        expect(monitor.type).to eq(123)
        expect(monitor.name).to eq("test new_name")
        expect(monitor.refresh_interval).to eq(456)
        expect(monitor.configuration.attr1).to eq("test_attr1")
        expect(monitor.configuration.attr2).to eq(1234)
      end
    end

    it("should store a monitor as yaml into an existing file") do
      monitor = MonitorBuilder.new.
        with_id("test-new_monitor-id").
        with_type(123).
        with_name("test new_name").
        with_refresh_interval(456).
        with_configuration(Struct.new(:attr1, :attr2).new("test_attr1", 1234)).
        build

      @db_helper.serialize_monitor(monitor)

      monitor.name = "test change name"
      monitor.refresh_interval = 123
      monitor.configuration.attr1 = "test_changed_attr1"
      monitor.configuration.attr2 = 9876

      subject.save_monitor(monitor)

      @db_helper.verify_monitor("test-new_monitor-id") do |m|
        expect(m.name).to eq("test change name")
        expect(m.refresh_interval).to eq(123)
        expect(m.configuration.attr1).to eq("test_changed_attr1")
        expect(m.configuration.attr2).to eq(9876)
      end
    end

    it("should load a dashboard from a yaml file") do
      @db_helper.serialize_dashboard(DashboardBuilder.new.
          with_id("test-dashboard-id").
          with_name("test dashboard-name").
          with_monitor_id("test-mon-1").
          with_monitor_id("test-mon-2").
          build
      )

      dashboard = subject.load_dashboard("test-dashboard-id")

      expect(dashboard.id).to eq("test-dashboard-id")
      expect(dashboard.name).to eq("test dashboard-name")
      expect(dashboard.monitor_ids).to eq(["test-mon-1", "test-mon-2"])
    end

    it("should remove a dashboard from a yaml file") do
      @db_helper.serialize_dashboard(DashboardBuilder.new.
          with_id("test-dashboard-id").
          with_name("test dashboard-name").
          build
      )

      subject.delete_dashboard("test-dashboard-id")

      expect(@db_helper.find_dashboard("test-dashboard-id")).to be_nil
    end

    it("should load all dashboards") do
      @db_helper.serialize_dashboard(DashboardBuilder.new.
          with_id("test-dashboard-id1").
          with_name("test dashboard-name1").
          with_monitor_id("test-mon-1").
          with_monitor_id("test-mon-2").
          build
      )
      @db_helper.serialize_dashboard(DashboardBuilder.new.
          with_id("test-dashboard-id2").
          with_name("test dashboard-name2").
          with_monitor_id("test-mon-3").
          build
      )

      dashboards = subject.load_dashboards()

      expect(dashboards.size).to eq(2)
      expect(dashboards[0].id).to eq("test-dashboard-id1")
      expect(dashboards[0].name).to eq("test dashboard-name1")
      expect(dashboards[0].monitor_ids).to eq(["test-mon-1", "test-mon-2"])
      expect(dashboards[1].id).to eq("test-dashboard-id2")
      expect(dashboards[1].name).to eq("test dashboard-name2")
      expect(dashboards[1].monitor_ids).to eq(["test-mon-3"])
    end

    it("should store a dashboard as yaml into a new file") do
      new_dashboard = subject.save_dashboard(
        DashboardBuilder.new.
          with_name("test dashboard-name").
          with_monitor_id("test-mon-1").
          with_monitor_id("test-mon-2").
          build
      )

      expect(new_dashboard.id).not_to be_nil
      @db_helper.verify_dashboard(new_dashboard.id) do |dashboard|
        expect(dashboard.name).to eq("test dashboard-name")
        expect(dashboard.monitor_ids.length).to eq(2)
        expect(dashboard.monitor_ids[0]).to eq("test-mon-1")
        expect(dashboard.monitor_ids[1]).to eq("test-mon-2")
      end
    end
  end
end
