require 'spec_helper'
require 'json_spec'
require 'dashboard_builder'

module Jashboard
  describe Dashboard do
    it("should represent q Dashboard with no monitor ids as json") do
      dashboard = DashboardBuilder.new.
        with_id("test-id").
        with_name("test-name").
        build

      expected_json = %({"id": "test-id", "name": "test-name", "monitor_ids": []})

      dashboard.to_json.should be_json_eql(expected_json).including(:id)
    end
    it("should represent a Dashboard with monitor ids as json") do
      dashboard = DashboardBuilder.new.
        with_id("test-id").
        with_name("test-name").
        with_monitor_id("1").
        with_monitor_id("2").
        build

      expected_json = %({"id": "test-id", "name": "test-name", "monitor_ids": ["1", "2"]})

      dashboard.to_json.should be_json_eql(expected_json).including(:id)
    end
  end
end
