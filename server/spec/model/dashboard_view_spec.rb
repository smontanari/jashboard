require 'spec_helper'
require 'json_spec'
require 'model/dashboard_view'

module Jashboard
  describe DashboardView do
    it("should represent a Dashboard with no monitors as json") do
      dashboard = DashboardBuilder.new.
        with_id("test-id").
        with_name("test-name").
        build

      expected_json = %({"id": "test-id", "name": "test-name", "monitors": []})

      DashboardView.new(dashboard).to_json.should be_json_eql(expected_json).including(:id)
    end
    it("should represent a Dashboard with monitors as json") do
      mock_monitor1 = double
      mock_monitor2 = double
      mock_monitor1.stub(:to_json => '"monitor1"')
      mock_monitor2.stub(:to_json => '"monitor2"')

      dashboard = DashboardBuilder.new.
        with_id("test-id").
        with_name("test-name").
        build

      expected_json = %({"id": "test-id", "name": "test-name", "monitors": ["monitor1", "monitor2"]})

      DashboardView.new(dashboard, [mock_monitor1, mock_monitor2]).to_json.should be_json_eql(expected_json).including(:id)
    end
  end
end
