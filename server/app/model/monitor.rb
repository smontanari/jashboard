require 'json'

module Jashboard
  class Monitor
    attr_accessor :id, :type, :name, :refresh_interval, :position, :size, :configuration, :runtime_info

    def initialize(options = nil)
      init(options) if options
    end

    def to_json(*args)
      map = {
        id: @id,
        name: @name,
        type: @type,
        refreshInterval: @refresh_interval,
        configuration: @configuration.to_map_with_camel_case_keys
      }
      map[:position] = @position unless @position.nil?
      map[:size] = @size unless @size.nil?
      map.to_json(*args)
    end

    def init(options)
      @name = options['name']
      @refresh_interval = options['refreshInterval']
      @type = options['type']
      @configuration = options['configuration'].to_struct_with_snake_keys
      update_position options['position']
      update_size options['size']
    end

    def update_configuration data
      @name = data['name']
      @refresh_interval = data['refreshInterval']
      @configuration = data['configuration'].to_struct_with_snake_keys
    end

    def update_position data
      @position = Struct.new(:top, :left).new(data['top'], data['left'])
    end

    def update_size data
      @size = Struct.new(:width, :height).new(data['width'], data['height'])
    end

    def method_missing method, args, &block
      match = method.to_s.match(/(.+)_from_json/)
      super(method, args) if match.nil?

      self.send("#{match[1]}".to_sym, JSON.parse(args))
    end
  end
end
