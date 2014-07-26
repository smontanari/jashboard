require 'spec_helper'
require 'json_spec'
require 'model/monitor'

module Jashboard
  describe Monitor do
    it ("should initialize a new monitor from json data") do
      json = %({
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
      
      monitor = MonitorBuilder.new.build
      monitor.init_from_json json

      expect(monitor.type).to eq("test_type")
      expect(monitor.name).to eq("test.monitor.name")
      expect(monitor.refresh_interval).to eq(345)
      expect(monitor.position.top).to eq(10)
      expect(monitor.position.left).to eq(20)
      expect(monitor.size.width).to eq(100)
      expect(monitor.size.height).to eq(200)
      expect(monitor.configuration.attr_one).to eq("test_attr1")
      expect(monitor.configuration.attr_two).to eq(123)
    end

    it ("should update configuration from json data") do
      monitor = MonitorBuilder.new.
        with_id("test_id").
        with_name("test_name").
        with_type(123).
        with_refresh_interval(9876).
        with_configuration(Struct.new(:attr_one, :attr_two).new("test_attr1", "test_attr2")).
        build

      json = %({
        "name": "test_new_name",
        "refreshInterval": 1234,
        "configuration": {
          "attrOne": "test_attr1",
          "attrTwo": "test_attr2_new",
          "attrThree": "test_attr3"
        }
      })
      
      monitor.update_configuration_from_json json

      expect(monitor.id).to eq("test_id")
      expect(monitor.name).to eq("test_new_name")
      expect(monitor.type).to eq(123)
      expect(monitor.refresh_interval).to eq(1234)
      expect(monitor.configuration.attr_one).to eq("test_attr1")
      expect(monitor.configuration.attr_two).to eq("test_attr2_new")
      expect(monitor.configuration.attr_three).to eq("test_attr3")
    end

    it ("should update the position from json data") do
      monitor = MonitorBuilder.new.
        with_id("test_id").
        build

      json = %({"top": 243, "left": 765})
      
      monitor.update_position_from_json json

      expect(monitor.position.top).to eq(243)
      expect(monitor.position.left).to eq(765)
    end

    it ("should update the size from json data") do
      monitor = MonitorBuilder.new.
        with_id("test_id").
        build

      json = %({"width": 243, "height": 765})
      monitor.update_size_from_json json

      expect(monitor.size.width).to eq(243)
      expect(monitor.size.height).to eq(765)
    end

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

      expect(monitor.to_json).to be_json_eql(expected_json).including(:id)
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

      expect(monitor.to_json).to be_json_eql(expected_json).including(:id)
    end
  end
end
