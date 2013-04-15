require 'spec_helper'
require 'json_spec'
require 'model/monitor'
# require 'plugins/build/jenkins_plugin'

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
        with_configuration(Struct.new(:attr1, :attr2).new("test_attr1", "test_attr2")).
        with_runtime_info(Struct.new(:attr3, :attr4).new("test_attr3", "test_attr4")).
        build

      expected_json = %({
        "id": "test.id",
        "name": "test.name",
        "type": 123,
        "refresh_interval": 9876,
        "position": {"top": 123, "left": 456},
        "size": {"width": 432, "height": 789},
        "configuration": {
          "attr1": "test_attr1",
          "attr2": "test_attr2"
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
        with_configuration(Struct.new(:attr1, :attr2).new("test_attr1", "test_attr2")).
        with_runtime_info(Struct.new(:attr3, :attr4).new("test_attr3", "test_attr4")).
        build

      expected_json = %({
        "id": "test.id",
        "name": "test.name",
        "type": 123,
        "refresh_interval": 9876,
        "configuration": {
          "attr1": "test_attr1",
          "attr2": "test_attr2"
        }
      })

      monitor.to_json.should be_json_eql(expected_json).including(:id)
    end
  end
end
