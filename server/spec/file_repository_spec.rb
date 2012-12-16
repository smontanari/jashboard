require 'spec_helper'
require 'service/repository'

module Jashboard
  describe FileRepository do
    before(:each) do
      ENV['JASHBOARD_ENV'] = 'test'
      @db_helper = FSDBHelper.new("db/test")
      @db_helper.clean_data
    end

    it("should load a build monitor from a yaml file") do
      @db_helper.serialize_monitor(MonitorBuilder.new.
        with_id("test-monitor-id").
        with_type(123).
        with_name("test monitor-name").
        with_refresh_interval(12).
        with_settings(Struct.new(:attr1, :attr2).new("test_attr1", 1234)).
        build)

      monitor = subject.load_monitor("test-monitor-id")

      monitor.id.should == "test-monitor-id"
      monitor.name.should == "test monitor-name"
      monitor.type.should == 123
      monitor.refresh_interval.should == 12
      monitor.settings.attr1.should == "test_attr1"
      monitor.settings.attr2.should == 1234
    end

    it("should store a build monitor as yaml into a file") do
      monitor = subject.save_monitor(
        MonitorBuilder.new.
        with_id("test-monitor-id").
        with_type(123).
        with_name("test new_name").
        with_refresh_interval(456).
        with_settings(Struct.new(:attr1, :attr2).new("test_attr1", 1234)).
        build)

      monitor.id.should_not be_nil
      @db_helper.verify_monitor(monitor)
    end

    it("should store a build monitor as yaml into an existing file") do
      monitor = MonitorBuilder.new.
        with_id("test-new_monitor-id").
        with_type(123).
        with_name("test new_name").
        with_refresh_interval(456).
        with_settings(Struct.new(:attr1, :attr2).new("test_attr1", 1234)).
        build

      @db_helper.serialize_monitor(monitor)

      monitor.name = "test change name"
      monitor.refresh_interval = 123
      monitor.settings.attr1 = "test_changed_attr1"
      monitor.settings.attr2 = 9876

      subject.save_monitor(monitor)

      @db_helper.verify_monitor(monitor)
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

      dashboard.id.should == "test-dashboard-id"
      dashboard.name.should == "test dashboard-name"
      dashboard.monitor_ids.should == ["test-mon-1", "test-mon-2"]
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

      dashboards.size.should == 2
      dashboards[0].id.should == "test-dashboard-id1"
      dashboards[0].name.should == "test dashboard-name1"
      dashboards[0].monitor_ids.should == ["test-mon-1", "test-mon-2"]
      dashboards[1].id.should == "test-dashboard-id2"
      dashboards[1].name.should == "test dashboard-name2"
      dashboards[1].monitor_ids.should == ["test-mon-3"]
    end

    it("should store a dashboard as yaml into a new file") do
      dashboard = subject.save_dashboard(
        DashboardBuilder.new.
          with_name("test dashboard-name").
          with_monitor_id("test-mon-1").
          with_monitor_id("test-mon-2").
          build
      )

      dashboard.id.should_not be_nil
      @db_helper.verify_dashboard(dashboard)
    end
  end
end
