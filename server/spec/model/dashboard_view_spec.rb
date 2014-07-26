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

      expect(DashboardView.new(dashboard).to_json).to be_json_eql(expected_json).including(:id)
    end
    it("should represent a Dashboard with monitors as json") do
      mock_monitor1 = double
      mock_monitor2 = double
      allow(mock_monitor1).to receive_messages(:to_json => '"monitor1"')
      allow(mock_monitor2).to receive_messages(:to_json => '"monitor2"')

      dashboard = DashboardBuilder.new.
        with_id("test-id").
        with_name("test-name").
        build

      expected_json = %({"id": "test-id", "name": "test-name", "monitors": ["monitor1", "monitor2"]})

      expect(DashboardView.new(dashboard, [mock_monitor1, mock_monitor2]).to_json).to be_json_eql(expected_json).including(:id)
    end
  end
end
