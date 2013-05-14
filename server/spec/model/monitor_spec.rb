require 'spec_helper'
require 'json_spec'
require 'model/monitor'

module Jashboard
  describe Monitor do
    it("should represent the build monitor as json") do
      monitor = MonitorBuilder.new.
        with_id("test.id").
        with_name("test.name").
        with_type(123).
        with_refresh_interval(9876).
        with_position(Struct.new(:top, :left).new(123, 456)).
        with_size(Struct.new(:width, :height).new(432, 789)).
        with_configuration(Struct.new(:attr_one, :attr_two).new("test_attr1", "test_attr2")).
        with_runtime_info(Struct.new(:attr_three, :attr_four).new("test_attr3", "test_attr4")).
        build

      expected_json = %({
        "id": "test.id",
        "name": "test.name",
        "type": 123,
        "refreshInterval": 9876,
        "position": {"top": 123, "left": 456},
        "size": {"width": 432, "height": 789},
        "configuration": {
          "attrOne": "test_attr1",
          "attrTwo": "test_attr2"
        }
      })

      monitor.to_json.should be_json_eql(expected_json).including(:id)
    end
    it("should not have position if not initialised") do
      monitor = MonitorBuilder.new.
        with_id("test.id").
        with_name("test.name").
        with_type(123).
        with_refresh_interval(9876).
        with_configuration(Struct.new(:attr_one, :attr_two).new("test_attr1", "test_attr2")).
        with_runtime_info(Struct.new(:attr_three, :attr_four).new("test_attr3", "test_attr4")).
        build

      expected_json = %({
        "id": "test.id",
        "name": "test.name",
        "type": 123,
        "refreshInterval": 9876,
        "configuration": {
          "attrOne": "test_attr1",
          "attrTwo": "test_attr2"
        }
      })

      monitor.to_json.should be_json_eql(expected_json).including(:id)
    end
  end
end
